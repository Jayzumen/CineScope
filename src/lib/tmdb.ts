import "server-only";

import { positiveInteger } from "@/lib/requestProtection";
import { enforceRateLimit } from "@/lib/rateLimit";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_MINUTE_LIMIT = positiveInteger(
  process.env.TMDB_GLOBAL_RATE_LIMIT_PER_MINUTE,
  120,
);
const TMDB_HOUR_LIMIT = positiveInteger(
  process.env.TMDB_GLOBAL_RATE_LIMIT_PER_HOUR,
  3000,
);

export async function tmdbFetch<T>(
  endpoint: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TMDB_API_KEY environment variable.");
  }

  await enforceRateLimit([
    {
      key: "tmdb:global:minute",
      maxRequests: TMDB_MINUTE_LIMIT,
      windowMs: 60_000,
    },
    {
      key: "tmdb:global:hour",
      maxRequests: TMDB_HOUR_LIMIT,
      windowMs: 3_600_000,
    },
  ]);

  const hasQuery = endpoint.includes("?");
  const url = `${TMDB_BASE_URL}${endpoint}${hasQuery ? "&" : "?"}api_key=${apiKey}`;
  const response = await fetch(url, {
    ...init,
    signal: init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(8000)])
      : AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}
