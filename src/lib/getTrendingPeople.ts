import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getTrendingPeople() {
  const data = await tmdbFetch<{ results: People[] }>(
    `/person/popular?language=en-US&page=1`
  );
  return data.results as People[];
}
