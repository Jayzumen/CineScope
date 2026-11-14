import Link from "next/link";
import { ArrowRight, Star, ArrowUpRight } from "lucide-react";
import { tmdbFetch } from "@/lib/tmdb";
import { detail } from "@/lib/catalog";
import { collections, titleOf, type MediaResults } from "@/lib/catalogTypes";
import { artworkUrl } from "@/lib/media";
import Artwork from "@/components/Artwork";
import TitleGrid from "@/components/TitleGrid";
import TrailerButton from "@/components/TrailerButton";
import LibraryActions from "@/components/LibraryActions";
import type { DetailData } from "@/components/DetailPage";
export default async function Home() {
  const trending = tmdbFetch<MediaResults>(
    "/trending/movie/week?language=en-US",
  );
  // Start the featured title as soon as trending resolves, in parallel with
  // the other rows, instead of after all of them.
  const featuredDetail = trending.then((result) => {
    const featured =
      result.results.find((x) => x.backdrop_path) ?? result.results[0];
    return featured
      ? detail<DetailData>("movie", String(featured.id), "videos")
      : null;
  });
  const [movies, shows, releases, people, feature] = await Promise.all([
    trending,
    tmdbFetch<MediaResults>("/trending/tv/week?language=en-US"),
    tmdbFetch<MediaResults>("/movie/now_playing?language=en-US&page=1"),
    tmdbFetch<MediaResults>("/trending/person/week?language=en-US"),
    featuredDetail,
  ]);
  return (
    <>
      {feature && (
        <section className="hero">
          <div className="hero-image">
            <Artwork
              fill
              priority
              src={artworkUrl(
                feature.backdrop_path,
                "w1280",
                feature.poster_path,
              )}
              alt=""
              sizes="100vw"
            />
          </div>
          <div className="shell">
            <div className="hero-copy">
              <p className="eyebrow">The spotlight · This week</p>
              <h1>{titleOf(feature)}</h1>
              <div className="metadata">
                {!!feature.vote_average && (
                  <span className="rating">
                    <Star size={14} />
                    {feature.vote_average.toFixed(1)}
                  </span>
                )}
                {feature.release_date && (
                  <span>{feature.release_date.slice(0, 4)}</span>
                )}
                {!!feature.runtime && <span>{feature.runtime} min</span>}
                <span>
                  {(feature.genres ?? [])
                    .slice(0, 2)
                    .map((g) => g.name)
                    .join(" / ")}
                </span>
              </div>
              <p className="hero-description">
                {feature.overview && feature.overview.length > 220
                  ? feature.overview.slice(0, 217) + "…"
                  : feature.overview}
              </p>
              <div className="hero-actions">
                <TrailerButton
                  videos={feature.videos}
                  title={titleOf(feature)}
                />
                <Link className="button subtle" href={`/movies/${feature.id}`}>
                  Explore film <ArrowUpRight size={16} />
                </Link>
                <LibraryActions item={feature} kind="movie" compact />
              </div>
            </div>
          </div>
          <span className="hero-label">Your next great story starts here</span>
        </section>
      )}
      <div className="shell">
        <section className="section">
          <div className="section-heading">
            <div>
              <h2 className="section-title">In the conversation</h2>
              <p className="section-subtitle">
                The films everyone is discovering right now.
              </p>
            </div>
            <Link className="text-link" href="/movies">
              All movies <ArrowRight size={15} />
            </Link>
          </div>
          <TitleGrid items={movies.results.slice(0, 6)} />
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A different way in</p>
              <h2 className="section-title">Follow your curiosity</h2>
            </div>
          </div>
          <div className="collection-grid">
            {collections.map((c) => (
              <Link
                className={`collection-tile ${c.tint}`}
                key={c.slug}
                href={`/collections/${c.slug}`}
              >
                <p className="eyebrow">The collection</p>
                <h3>{c.title}</h3>
                <p>{c.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <h2 className="section-title">One more episode</h2>
              <p className="section-subtitle">Series worth making time for.</p>
            </div>
            <Link className="text-link" href="/shows">
              All shows <ArrowRight size={15} />
            </Link>
          </div>
          <TitleGrid items={shows.results.slice(0, 6)} kind="tv" />
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <h2 className="section-title">Fresh from the screen</h2>
              <p className="section-subtitle">
                Now playing. Next on your list.
              </p>
            </div>
            <Link
              className="text-link"
              href="/movies?sort=primary_release_date.desc"
            >
              New releases <ArrowRight size={15} />
            </Link>
          </div>
          <TitleGrid items={releases.results.slice(0, 6)} />
        </section>
        <section className="section">
          <div className="section-heading">
            <h2 className="section-title">The people behind the stories</h2>
          </div>
          <div className="people-row">
            {people.results.slice(0, 8).map((p) => (
              <Link className="person" href={`/cast/${p.id}`} key={p.id}>
                <div className="person-image">
                  <Artwork
                    fill
                    src={artworkUrl(p.profile_path)}
                    alt={titleOf(p)}
                    sizes="120px"
                  />
                </div>
                <h3>{titleOf(p)}</h3>
                <p>{p.known_for_department}</p>
              </Link>
            ))}
          </div>
        </section>
        <aside className="editorial-note">
          <div>
            <h2>A little less scrolling. A little more cinema.</h2>
            <p>Keep the stories you want to come back to, all in one place.</p>
          </div>
          <Link className="button subtle" href="/account">
            Make it your collection <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </>
  );
}
