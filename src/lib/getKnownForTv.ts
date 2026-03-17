import "server-only";
import { tmdbFetch } from "@/lib/tmdb";

export default async function getKnownForTv(id: string) {
  const data = await tmdbFetch<{ cast: TvRole[] }>(
    `/person/${id}/tv_credits?language=en-US`
  );
  return data.cast as TvRole[];
}
