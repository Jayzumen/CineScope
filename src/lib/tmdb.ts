import "server-only";

import { enforceRateLimit } from "@/lib/rateLimit";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_MINUTE_LIMIT = Number(process.env.TMDB_GLOBAL_RATE_LIMIT_PER_MINUTE ?? "120");
const TMDB_HOUR_LIMIT = Number(process.env.TMDB_GLOBAL_RATE_LIMIT_PER_HOUR ?? "3000");

export async function tmdbFetch<T>(
  endpoint: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TMDB_API_KEY environment variable.");
  }

  enforceRateLimit([
    {
      key: "tmdb:global:minute",
      maxRequests: TMDB_MINUTE_LIMIT,
      windowMs: 60_000,
      message: "Too many TMDB requests right now. Please try again in a minute.",
    },
    {
      key: "tmdb:global:hour",
      maxRequests: TMDB_HOUR_LIMIT,
      windowMs: 3_600_000,
      message: "Hourly TMDB request limit reached. Please try again later.",
    },
  ]);

  const hasQuery = endpoint.includes("?");
  const url = `${TMDB_BASE_URL}${endpoint}${hasQuery ? "&" : "?"}api_key=${apiKey}`;
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

