import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rateLimit";
import {
  clientKey,
  positiveInteger,
  RequestLimitError,
} from "@/lib/requestProtection";
import {
  readSearchBody,
  verifyChallenge,
  challengeKey,
} from "@/lib/searchProtection";
import { verifiedUser } from "@/lib/verifyUser";
import { tmdbFetch } from "@/lib/tmdb";
import type { MediaResults } from "@/lib/catalogTypes";
export const runtime = "nodejs";
const reply = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : `${new URL(request.url).protocol}//${request.headers.get("host")}`;
  if (origin && origin !== expectedOrigin)
    return reply({ error: "Request origin is not allowed." }, 403);
  let body;
  try {
    body = await readSearchBody(request);
  } catch {
    return reply(
      { error: "Enter a valid search of 1–200 characters and a valid page." },
      400,
    );
  }
  try {
    const key = clientKey(
      request.headers,
      process.env.TRUSTED_CLIENT_IP_HEADER,
    );
    await enforceRateLimit([
      {
        key: `search:${key}:minute`,
        maxRequests: positiveInteger(
          process.env.SEARCH_RATE_LIMIT_PER_MINUTE,
          20,
        ),
        windowMs: 60_000,
      },
      {
        key: `search:${key}:hour`,
        maxRequests: positiveInteger(
          process.env.SEARCH_RATE_LIMIT_PER_HOUR,
          300,
        ),
        windowMs: 3_600_000,
      },
    ]);
    let uid;
    try {
      uid = await verifiedUser(request.headers.get("authorization"));
    } catch {
      return reply(
        {
          error:
            "Your session has expired. Sign in again or search while signed out.",
        },
        401,
      );
    }
    if (uid)
      await enforceRateLimit([
        { key: `search:user:${uid}:minute`, maxRequests: 20, windowMs: 60_000 },
        {
          key: `search:user:${uid}:hour`,
          maxRequests: 300,
          windowMs: 3_600_000,
        },
      ]);
    let needsChallenge = false;
    try {
      await enforceRateLimit([
        {
          key: `search:soft:${key}`,
          maxRequests: positiveInteger(
            process.env.SEARCH_CHALLENGE_THRESHOLD,
            8,
          ),
          windowMs: 60_000,
        },
      ]);
    } catch (error) {
      if (error instanceof RequestLimitError) needsChallenge = true;
      else throw error;
    }
    if (needsChallenge) {
      const secret = process.env.TURNSTILE_SECRET_KEY;
      const hostname = process.env.TURNSTILE_HOSTNAME;
      if (!secret || !hostname || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
        return reply(
          { error: "Please pause a moment before searching again." },
          429,
          { "Retry-After": "60" },
        );
      if (!body.token || !(await verifyChallenge(body.token, secret, hostname)))
        return reply(
          { error: "Complete the verification to continue.", challenge: true },
          403,
        );
      // Our atomic store closes any provider-side replay propagation window.
      await enforceRateLimit([
        { key: challengeKey(body.token), maxRequests: 1, windowMs: 300_000 },
      ]);
    }
    const results = await tmdbFetch<MediaResults>(
      `/search/multi?query=${encodeURIComponent(body.query)}&page=${body.page}&language=en-US&include_adult=false`,
    );
    return reply(results);
  } catch (error) {
    if (error instanceof RequestLimitError)
      return reply({ error: error.message }, 429, {
        "Retry-After": String(error.retryAfterSeconds),
      });
    return reply(
      { error: "Search is temporarily unavailable. Please try again later." },
      503,
      { "Retry-After": "30" },
    );
  }
}
