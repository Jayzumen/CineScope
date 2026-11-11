import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { detail, limitBrowse } from "@/lib/catalog";
import { titleOf, type MediaItem, type MediaResults } from "@/lib/catalogTypes";
import { artworkUrl } from "@/lib/media";
import Artwork from "./Artwork";
import TitleGrid from "./TitleGrid";
import TrailerButton from "./TrailerButton";
import LibraryActions from "./LibraryActions";
import LikeButton from "./LikeButton";
type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
};
type Provider = { provider_id: number; provider_name: string };
export type DetailData = MediaItem & {
  tagline?: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  original_language?: string;
  number_of_seasons?: number;
  videos: { results: Video[] };
  credits: { cast: Person[]; crew: Person[] };
  recommendations: MediaResults;
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
    overview: string;
    air_date: string;
  }[];
  "watch/providers"?: {
    results: Record<
      string,
      {
        link?: string;
        flatrate?: Provider[];
        rent?: Provider[];
        buy?: Provider[];
      }
    >;
  };
};
export async function detailMetadata(kind: "movie" | "tv", id: string) {
  const item = await detail<DetailData>(kind, id, "videos");
  const title = titleOf(item);
  const path = `/${kind === "movie" ? "movies" : "shows"}/${id}`;
  return {
    title,
    description: item.overview?.slice(0, 160),
    alternates: { canonical: path },
    openGraph: {
      title,
      description: item.overview?.slice(0, 160),
      images: item.backdrop_path
        ? [
            {
              url: artworkUrl(item.backdrop_path, "w1280"),
              width: 1280,
              height: 720,
              alt: title,
            },
          ]
        : [],
    },
  };
}
export default async function DetailPage({
  kind,
  id,
  region = "US",
}: {
  kind: "movie" | "tv";
  id: string;
  region?: string;
}) {
  await limitBrowse();
  const item = await detail<DetailData>(
    kind,
    id,
    "videos,credits,recommendations,watch/providers",
  );
  const title = titleOf(item);
  const regions = [
    ["US", "United States"],
    ["DE", "Germany"],
    ["GB", "United Kingdom"],
    ["CA", "Canada"],
    ["AU", "Australia"],
    ["FR", "France"],
    ["JP", "Japan"],
  ];
  const country = regions.some(([code]) => code === region) ? region : "US";
  const providers = item["watch/providers"]?.results[country];
  const base = kind === "movie" ? "/movies" : "/shows";
  const crew =
    item.credits?.crew
      .filter((x) =>
        ["Director", "Creator", "Screenplay"].includes(x.job ?? ""),
      )
      .slice(0, 6) ?? [];
  const availabilityLink = providers?.link?.startsWith(
    "https://www.themoviedb.org/",
  )
    ? providers.link
    : undefined;
  return (
    <>
      <section className="hero detail-hero">
        <div className="hero-image">
          <Artwork
            fill
            priority
            sizes="100vw"
            alt=""
            src={artworkUrl(item.backdrop_path, "w1280", item.poster_path)}
          />
        </div>
        <div className="shell">
          <div className="hero-copy">
            <Link className="text-link mb-5" href={base}>
              <ArrowLeft size={14} />
              Explore {kind === "movie" ? "movies" : "shows"}
            </Link>
            <h1>{title}</h1>
            <div className="metadata">
              <span className="rating">
                <Star size={14} />
                {item.vote_average?.toFixed(1) ?? "—"}{" "}
                <span className="muted font-normal">/ 10</span>
              </span>
              <span>
                {(item.release_date || item.first_air_date)?.slice(0, 4)}
              </span>
              {item.runtime ? (
                <span>{item.runtime} min</span>
              ) : item.number_of_seasons ? (
                <span>{item.number_of_seasons} seasons</span>
              ) : null}
              <span>{item.vote_count?.toLocaleString()} votes</span>
            </div>
            <div className="tags">
              {item.genres.map((g) => (
                <span className="tag" key={g.id}>
                  {g.name}
                </span>
              ))}
            </div>
            <p className="hero-description">
              {item.overview ||
                "A synopsis is not available for this title yet."}
            </p>
            <div className="hero-actions">
              <TrailerButton videos={item.videos} title={title} />
              <LibraryActions item={item} kind={kind} />
              <LikeButton
                item={item}
                collectionName={kind === "movie" ? "likedMovies" : "likedShows"}
                itemName={title}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="shell">
        <div className="detail-columns">
          <div>
            <section className="section">
              <div className="section-heading">
                <h2 className="section-title">The cast</h2>
              </div>
              <div className="cast-strip">
                {item.credits?.cast.slice(0, 6).map((person) => (
                  <Link
                    className="person"
                    href={`/cast/${person.id}`}
                    key={person.id}
                  >
                    <div className="person-image">
                      <Artwork
                        fill
                        sizes="150px"
                        src={artworkUrl(person.profile_path)}
                        alt={person.name}
                      />
                    </div>
                    <h3>{person.name}</h3>
                    <p>{person.character}</p>
                  </Link>
                ))}
              </div>
            </section>
            {kind === "tv" && (
              <section className="section">
                <h2 className="section-title mb-4">Seasons & episodes</h2>
                {item.seasons
                  ?.filter((s) => s.season_number > 0)
                  .map((s) => (
                    <details className="season" key={s.season_number}>
                      <summary>
                        <span>{s.name}</span>
                        <span className="muted text-xs">
                          {s.episode_count} episodes ·{" "}
                          {s.air_date?.slice(0, 4) || "TBA"}
                        </span>
                      </summary>
                      <p>
                        {s.overview || "Explore the episodes in this season."}
                      </p>
                      <Link
                        className="text-link"
                        href={`/shows/${id}/seasons/${s.season_number}`}
                      >
                        View episodes →
                      </Link>
                    </details>
                  ))}
              </section>
            )}
            <section className="section">
              <h2 className="section-title">Where to watch</h2>
              <form className="filter-bar" action={`${base}/${id}`}>
                <label className="field">
                  Your region
                  <select name="region" defaultValue={country}>
                    {regions.map(([code, label]) => (
                      <option value={code} key={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="button subtle">Update region</button>
              </form>
              {[
                ["Stream", providers?.flatrate],
                ["Rent", providers?.rent],
                ["Buy", providers?.buy],
              ].map(([label, list]) =>
                Array.isArray(list) && list.length ? (
                  <div key={String(label)}>
                    <p className="muted text-xs">{String(label)}</p>
                    <div className="provider-row">
                      {(list as Provider[]).map((p) => (
                        <span className="provider" key={p.provider_id}>
                          {p.provider_name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
              {!providers?.flatrate?.length &&
                !providers?.rent?.length &&
                !providers?.buy?.length && (
                  <p className="muted my-5 text-sm">
                    No availability is listed for this region. This does not
                    necessarily mean the title is unavailable.
                  </p>
                )}
              {availabilityLink && (
                <a
                  className="text-link"
                  href={availabilityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check current offers →
                </a>
              )}
              <p className="muted mt-3 text-xs">
                Availability data provided by JustWatch via TMDB. Services and
                offers can change.
              </p>
            </section>
          </div>
          <aside className="section">
            <dl className="facts">
              <dt>Original title</dt>
              <dd>{item.original_title || item.original_name || title}</dd>
              <dt>Status</dt>
              <dd>{item.status || "Unknown"}</dd>
              <dt>Original language</dt>
              <dd>{item.original_language?.toUpperCase() || "Unknown"}</dd>
              {crew.map((p, i) => (
                <div key={`${p.id}-${i}`}>
                  <dt>{p.job}</dt>
                  <dd>
                    <Link className="text-link" href={`/cast/${p.id}`}>
                      {p.name}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
        {!!item.recommendations?.results.length && (
          <section className="section">
            <div className="section-heading">
              <h2 className="section-title">
                Stay in this world a little longer
              </h2>
            </div>
            <TitleGrid
              items={item.recommendations.results.slice(0, 6)}
              kind={kind}
            />
          </section>
        )}
      </div>
    </>
  );
}
