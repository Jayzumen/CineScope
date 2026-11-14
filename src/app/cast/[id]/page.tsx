import { cache } from "react";
import Link from "next/link";
import { detail } from "@/lib/catalog";
import { artworkPlaceholder, artworkUrl } from "@/lib/media";
import { type MediaItem } from "@/lib/catalogTypes";
import Artwork from "@/components/Artwork";
import TitleGrid from "@/components/TitleGrid";
import { ageInYears, formatDate, plural } from "@/lib/format";
type Person = {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  profile_path?: string | null;
  known_for_department?: string;
  combined_credits: {
    cast: MediaItem[];
    crew?: (MediaItem & { job?: string })[];
  };
};
// Metadata and page share one request-scoped load.
const loadPerson = cache((id: string) =>
  detail<Person>("person", id, "combined_credits"),
);
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await loadPerson((await params).id);
  const description = p.biography?.slice(0, 160);
  const image = artworkUrl(p.profile_path);
  return {
    title: p.name,
    description,
    alternates: { canonical: `/cast/${p.id}` },
    openGraph: {
      type: "profile",
      title: p.name,
      description,
      images:
        image === artworkPlaceholder
          ? []
          : [{ url: image, width: 500, height: 750, alt: p.name }],
    },
    twitter: { card: "summary", title: p.name, description },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await loadPerson((await params).id);
  // Directors, writers and other crew are known for work behind the camera;
  // their acting credits alone are often only cameos or none at all.
  const behindCamera =
    !!p.known_for_department && p.known_for_department !== "Acting";
  const credits = behindCamera
    ? [...(p.combined_credits.crew ?? []), ...p.combined_credits.cast]
    : p.combined_credits.cast;
  const unique = [
    ...new Map(
      credits
        .filter((x) => x.media_type === "movie" || x.media_type === "tv")
        .map((x) => [`${x.media_type}-${x.id}`, x]),
    ).values(),
  ].sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
  const born = formatDate(p.birthday);
  const died = formatDate(p.deathday);
  const age = ageInYears(p.birthday, p.deathday);
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
              {born && (
                <span>
                  Born {born}
                  {!died && age !== null ? ` (age ${age})` : ""}
                </span>
              )}
              {died && (
                <span>
                  Died {died}
                  {age !== null ? ` (aged ${age})` : ""}
                </span>
              )}
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
          <span className="muted text-sm">
            {plural(unique.length, "credit")}
          </span>
        </div>
        <TitleGrid items={unique} />
      </section>
    </div>
  );
}
