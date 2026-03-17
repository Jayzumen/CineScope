import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getShow(id: string): Promise<Show> {
  const data = await tmdbFetch<Show>(
    `/tv/${id}?language=en-US&append_to_response=videos`
  );
  return data;
}
