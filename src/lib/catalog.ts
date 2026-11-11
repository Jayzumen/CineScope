import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { tmdbFetch, TmdbError } from "./tmdb";
import { enforceRateLimit } from "./rateLimit";
import { clientKey, positiveInteger } from "./requestProtection";
import { catalogParams, mediaId } from "./catalogValidation";
import type { MediaResults } from "./catalogTypes";
export async function limitBrowse() {
  const key = clientKey(await headers(), process.env.TRUSTED_CLIENT_IP_HEADER);
  await enforceRateLimit([
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
  ]);
}
export async function catalog(
  kind: "movie" | "tv",
  values: Record<string, string | string[] | undefined>,
) {
  const p = catalogParams(values, kind);
  // All text search must pass through the challenge-protected API.
  if (p.query)
    redirect(`/search?q=${encodeURIComponent(p.query)}&page=${p.page}`);
  await limitBrowse();
  const params = new URLSearchParams({
    language: "en-US",
    page: String(p.page),
    include_adult: "false",
  });
  params.set("sort_by", p.sort);
  params.set("vote_count.gte", p.sort === "vote_average.desc" ? "200" : "20");
  if (p.genre) params.set("with_genres", String(p.genre));
  if (p.rating) params.set("vote_average.gte", String(p.rating));
  if (p.year)
    params.set(
      kind === "movie" ? "primary_release_year" : "first_air_date_year",
      String(p.year),
    );
  params.set(
    kind === "movie" ? "primary_release_date.lte" : "first_air_date.lte",
    new Date().toISOString().slice(0, 10),
  );
  const result = await tmdbFetch<MediaResults>(`/discover/${kind}?${params}`);
  return { result, p };
}
export async function detail<T>(
  kind: "movie" | "tv" | "person",
  raw: string,
  append: string,
): Promise<T> {
  let id;
  try {
    id = mediaId(raw);
  } catch {
    notFound();
  }
  try {
    return await tmdbFetch<T>(
      `/${kind}/${id}?language=en-US&append_to_response=${append}`,
    );
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) notFound();
    throw error;
  }
}
