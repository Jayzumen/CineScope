import Link from "next/link";
import { detail } from "@/lib/catalog";
import { artworkUrl } from "@/lib/media";
import { type MediaItem } from "@/lib/catalogTypes";
import Artwork from "@/components/Artwork";
import TitleGrid from "@/components/TitleGrid";
type Person = {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  profile_path?: string | null;
  known_for_department?: string;
  combined_credits: { cast: MediaItem[] };
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await detail<Person>(
    "person",
    (await params).id,
    "combined_credits",
  );
  return {
    title: p.name,
    description: p.biography?.slice(0, 160),
    alternates: { canonical: `/cast/${p.id}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await detail<Person>(
    "person",
    (await params).id,
    "combined_credits",
  );
  const unique = [
    ...new Map(
      p.combined_credits.cast.map((x) => [`${x.media_type}-${x.id}`, x]),
    ).values(),
  ].sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
  return (
    <div className="shell">
      <div className="page-top">
        <Link className="text-link mb-6" href="/search">
          ← Explore people
        </Link>
        <div className="detail-columns">
          <div>
            <p className="eyebrow">Behind the stories</p>
            <h1>{p.name}</h1>
            <div className="metadata mt-5">
              <span>{p.known_for_department}</span>
              {p.birthday && <span>Born {p.birthday}</span>}
              {p.deathday && <span>Died {p.deathday}</span>}
            </div>
            <p>{p.place_of_birth}</p>
            <details className="season" open>
              <summary>Biography</summary>
              <p className="whitespace-pre-line">
                {p.biography || "A biography is not available yet."}
              </p>
            </details>
          </div>
          <div className="poster-art max-w-64">
            <Artwork
              fill
              priority
              sizes="256px"
              src={artworkUrl(p.profile_path)}
              alt={p.name}
            />
          </div>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <h2 className="section-title">A life in stories</h2>
          <span className="muted text-sm">{unique.length} credits</span>
        </div>
        <TitleGrid items={unique} />
      </section>
    </div>
  );
}
