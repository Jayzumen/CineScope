import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getKnownForMovie(id: string) {
  const data = await tmdbFetch<{ cast: MovieRole[] }>(
    `/person/${id}/movie_credits?language=en-US`
  );
  return data.cast as MovieRole[];
}
