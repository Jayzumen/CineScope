import "server-only";
import { unstable_cache } from "next/cache";
import { positiveInteger } from "@/lib/requestProtection";
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
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new TmdbError(503);
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
        `https://api.themoviedb.org/3${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`,
        {
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
export async function tmdbFetch<T>(
  endpoint: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  const seconds =
    init?.next?.revalidate ?? (endpoint.startsWith("/search/") ? 300 : 3600);
  if (seconds === 0 || init?.cache === "no-store")
    return upstream(endpoint) as Promise<T>;
  // Only cache misses consume upstream quotas; failures are not cached.
  return unstable_cache(() => upstream(endpoint), ["tmdb-v2", endpoint], {
    revalidate: seconds,
    tags: init?.next?.tags,
  })() as Promise<T>;
}
