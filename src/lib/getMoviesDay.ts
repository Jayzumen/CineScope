import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getMoviesDay() {
  const data = await tmdbFetch<{ results: Movies[] }>(
    `/trending/movie/day?language=en-US&page=1`,
    {
      next: {
        revalidate: 20,
      },
    }
  );
  return data.results as Movies[];
}
