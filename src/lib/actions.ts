"use server";

import { headers } from "next/headers";
import { enforceRateLimit } from "@/lib/rateLimit";
import { tmdbFetch } from "@/lib/tmdb";

async function getClientIp() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");
  const cfIp = headerStore.get("cf-connecting-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() ??
    realIp ??
    cfIp ??
    "unknown-client"
  );
}

async function enforceSearchRateLimit() {
  const ip = await getClientIp();

  enforceRateLimit([
    {
      key: `search:${ip}:minute`,
      maxRequests: Number(process.env.SEARCH_RATE_LIMIT_PER_MINUTE ?? "20"),
      windowMs: 60_000,
      message: "Too many searches. Please wait a minute and try again.",
    },
    {
      key: `search:${ip}:hour`,
      maxRequests: Number(process.env.SEARCH_RATE_LIMIT_PER_HOUR ?? "300"),
      windowMs: 3_600_000,
      message: "Hourly search limit reached. Please try again later.",
    },
  ]);
}

export async function searchMovies(query: string): Promise<Movies[]> {
  await enforceSearchRateLimit();
  const data = await tmdbFetch<{ results: Movies[] }>(
    `/search/movie?language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}`
  );
  return data.results as Movies[];
}

export async function searchShows(query: string): Promise<Shows[]> {
  await enforceSearchRateLimit();
  const data = await tmdbFetch<{ results: Shows[] }>(
    `/search/tv?language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}`
  );
  return data.results as Shows[];
}
