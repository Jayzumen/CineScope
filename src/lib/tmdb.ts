import "server-only";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import {
  clientKey,
  positiveInteger,
  type LimitConfig,
} from "@/lib/requestProtection";
import { enforceRateLimit } from "@/lib/rateLimit";

export class TmdbError extends Error {
  constructor(public readonly status: number) {
    super(
      status === 404
        ? "Title not found."
        : "The catalog is temporarily unavailable.",
    );
  }
}
async function upstream(endpoint: string): Promise<unknown> {
  // Prefer the v4 read access token: it travels in a header, so it never
  // appears in request URLs, logs or traces. The v3 key remains a fallback.
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!token && !apiKey) throw new TmdbError(503);
  if (!/^\/[a-zA-Z0-9_/?=&%.,+-]+$/.test(endpoint) || endpoint.length > 2000)
    throw new TmdbError(400);
  for (let attempt = 0; attempt < 2; attempt++) {
    await enforceRateLimit([
      {
        key: "tmdb:global:minute",
        maxRequests: positiveInteger(
          process.env.TMDB_GLOBAL_RATE_LIMIT_PER_MINUTE,
          120,
        ),
        windowMs: 60_000,
      },
      {
        key: "tmdb:global:hour",
        maxRequests: positiveInteger(
          process.env.TMDB_GLOBAL_RATE_LIMIT_PER_HOUR,
          3000,
        ),
        windowMs: 3_600_000,
      },
    ]);
    try {
      const response = await fetch(
        token
          ? `https://api.themoviedb.org/3${endpoint}`
          : `https://api.themoviedb.org/3${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
            : { Accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
          redirect: "error",
        },
      );
      if (response.ok) return response.json();
      if (response.status < 500 || attempt === 1)
        throw new TmdbError(response.status);
    } catch (error) {
      if (error instanceof TmdbError || attempt === 1)
        throw error instanceof TmdbError ? error : new TmdbError(503);
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 200),
    );
  }
  throw new TmdbError(503);
}
// Per-visitor browse quota. It is read from the request outside the cache and
// only charged when a request actually reaches TMDB, so cached page views need
// no Redis call. Abusive traffic on cached pages is left to the host's WAF.
async function browseLimits(): Promise<LimitConfig[]> {
  const key = clientKey(await headers(), process.env.TRUSTED_CLIENT_IP_HEADER);
  return [
    {
      key: `browse:${key}:minute`,
      maxRequests: positiveInteger(
        process.env.BROWSE_RATE_LIMIT_PER_MINUTE,
        60,
      ),
      windowMs: 60_000,
    },
    {
      key: `browse:${key}:hour`,
      maxRequests: positiveInteger(process.env.BROWSE_RATE_LIMIT_PER_HOUR, 600),
      windowMs: 3_600_000,
    },
  ];
}
export async function tmdbFetch<T>(
  endpoint: string,
  init?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
    /** Set false when the caller already applies its own per-visitor limits. */
    browseLimit?: boolean;
  },
): Promise<T> {
  const visitorLimits = init?.browseLimit === false ? [] : await browseLimits();
  const miss = async () => {
    if (visitorLimits.length) await enforceRateLimit(visitorLimits);
    return upstream(endpoint);
  };
  const seconds =
    init?.next?.revalidate ?? (endpoint.startsWith("/search/") ? 300 : 3600);
  if (seconds === 0 || init?.cache === "no-store") return miss() as Promise<T>;
  // Only cache misses consume upstream quotas; failures are not cached.
  // unstable_cache (not "use cache") is deliberate: Next 16 still supports it
  // without Cache Components, and its entries survive redeploys, so a deploy
  // does not trigger a burst of TMDB requests.
  // The closure is not part of the key: entries are shared by all visitors.
  return unstable_cache(miss, ["tmdb-v2", endpoint], {
    revalidate: seconds,
    tags: init?.next?.tags,
  })() as Promise<T>;
}
