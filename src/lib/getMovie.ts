import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getMovie(id: string): Promise<Movie> {
  const data = await tmdbFetch<Movie>(
    `/movie/${id}?language=en-US&append_to_response=videos`
  );
  return data;
}
