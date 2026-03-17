import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getActor(id: string) {
  const data = await tmdbFetch<Cast>(
    `/person/${id}?language=en-US`
  );
  return data;
}
