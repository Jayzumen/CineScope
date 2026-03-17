import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getShows() {
  const data = await tmdbFetch<{ results: Shows[] }>(
    `/trending/tv/week?language=en-US&page=1`
  );
  return data.results as Shows[];
}
