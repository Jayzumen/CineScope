import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mediaId } from "@/lib/catalogValidation";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { formatDate, formatRuntime, plural } from "@/lib/format";
type Season = {
  name: string;
  overview: string;
  episodes: {
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    air_date: string;
    runtime: number;
  }[];
};
type Params = { params: Promise<{ id: string; season: string }> };
// Metadata and page share one request-scoped load.
const loadSeason = cache(async (id: string, season: string) => {
  try {
    mediaId(id);
    if (!/^\d{1,3}$/.test(season)) throw new Error();
  } catch {
    notFound();
  }
  try {
    return await tmdbFetch<Season>(`/tv/${id}/season/${season}?language=en-US`);
  } catch (e) {
    if (e instanceof TmdbError && e.status === 404) notFound();
    throw e;
  }
});
export async function generateMetadata({ params }: Params) {
  const { id, season } = await params;
  const data = await loadSeason(id, season);
  return {
    title: data.name || `Season ${season}`,
    description:
      data.overview?.slice(0, 160) || plural(data.episodes.length, "episode"),
    alternates: { canonical: `/shows/${id}/seasons/${season}` },
  };
}
export default async function Page({ params }: Params) {
  const { id, season } = await params;
  const data = await loadSeason(id, season);
  return (
    <div className="shell">
      <div className="page-top">
        <Link className="text-link" href={`/shows/${id}`}>
          ← Back to series
        </Link>
        <h1 className="mt-5">{data.name}</h1>
        <p>{data.overview}</p>
      </div>
      <section className="section">
        {data.episodes.map((ep) => (
          <article key={ep.id} className="episode">
            <span className="text-accent w-8 shrink-0">
              {String(ep.episode_number).padStart(2, "0")}
            </span>
            <div>
              <h2 className="text-lg">{ep.name}</h2>
              <p className="muted my-2 text-xs">
                {formatDate(ep.air_date) || "Date TBA"}
                {formatRuntime(ep.runtime) && ` · ${formatRuntime(ep.runtime)}`}
              </p>
              <p className="muted max-w-3xl">
                {ep.overview || "Episode synopsis not available."}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
