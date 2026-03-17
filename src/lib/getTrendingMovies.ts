import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getMovies() {
  const data = await tmdbFetch<{ results: Movies[] }>(
    `/trending/movie/week?language=en-US&page=1`
  );
  return data.results as Movies[];
}
