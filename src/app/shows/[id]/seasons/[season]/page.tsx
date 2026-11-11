import Link from "next/link";
import { notFound } from "next/navigation";
import { mediaId } from "@/lib/catalogValidation";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import { limitBrowse } from "@/lib/catalog";
export const metadata = { title: "Season episodes" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; season: string }>;
}) {
  const { id, season } = await params;
  try {
    mediaId(id);
    if (!/^\d{1,3}$/.test(season)) throw new Error();
  } catch {
    notFound();
  }
  await limitBrowse();
  let data;
  try {
    data = await tmdbFetch<{
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
    }>(`/tv/${id}/season/${season}?language=en-US`);
  } catch (e) {
    if (e instanceof TmdbError && e.status === 404) notFound();
    throw e;
  }
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
                {ep.air_date || "Date TBA"}
                {ep.runtime ? ` · ${ep.runtime} min` : ""}
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
