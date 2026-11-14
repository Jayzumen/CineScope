import "server-only";
import { notFound, redirect } from "next/navigation";
import { tmdbFetch, TmdbError } from "./tmdb";
import { catalogParams, mediaId, ValidationError } from "./catalogValidation";
import type { MediaResults } from "./catalogTypes";
export async function catalog(
  kind: "movie" | "tv",
  values: Record<string, string | string[] | undefined>,
) {
  const p = catalogParams(values, kind);
  // All text search must pass through the challenge-protected API.
  if (p.query)
    redirect(`/search?q=${encodeURIComponent(p.query)}&page=${p.page}`);
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
  append = "",
): Promise<T> {
  let id;
  try {
    id = mediaId(raw);
  } catch (error) {
    if (error instanceof ValidationError) notFound();
    throw error;
  }
  try {
    return await tmdbFetch<T>(
      `/${kind}/${id}?language=en-US${append ? `&append_to_response=${append}` : ""}`,
    );
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) notFound();
    throw error;
  }
}
