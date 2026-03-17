import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getMovieCredits(
  id: string
): Promise<MovieCredits> {
  const data = await tmdbFetch<MovieCredits>(
    `/movie/${id}/credits`
  );
  return data;
}
