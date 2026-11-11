"use server";
import { headers } from "next/headers";
import { enforceRateLimit } from "@/lib/rateLimit";
import {
  clientKey,
  positiveInteger,
  RequestLimitError,
  validateSearchQuery,
} from "@/lib/requestProtection";
import { tmdbFetch } from "@/lib/tmdb";

async function search<T>(
  kind: "movie" | "tv",
  input: unknown,
): Promise<{ results: T[]; error?: string }> {
  let query: string;
  try {
    query = validateSearchQuery(input);
  } catch {
    return {
      results: [],
      error: "Enter a search term between 1 and 200 characters.",
    };
  }
  try {
    const key = clientKey(
      await headers(),
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
    return await tmdbFetch<{ results: T[] }>(
      `/search/${kind}?language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}`,
    );
  } catch (error) {
    return {
      results: [],
      error:
        error instanceof RequestLimitError
          ? error.message
          : "Search is temporarily unavailable. Please try again later.",
    };
  }
}
export async function searchMovies(query: string) {
  return search<Movies>("movie", query);
}
export async function searchShows(query: string) {
  return search<Shows>("tv", query);
}
