import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getShowCredits(id: string): Promise<ShowCredits> {
  const data = await tmdbFetch<ShowCredits>(
    `/tv/${id}/credits`
  );
  return data;
}
