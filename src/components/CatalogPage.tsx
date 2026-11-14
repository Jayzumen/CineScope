import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { genres, tvGenres } from "@/lib/catalogTypes";
import TitleGrid from "./TitleGrid";
export default async function CatalogPage({
  kind,
  values,
}: {
  kind: "movie" | "tv";
  values: Record<string, string | string[] | undefined>;
}) {
  let data;
  try {
    data = await catalog(kind, values);
  } catch (error) {
    if (
      error instanceof Error &&
      /^Invalid|Search is limited/.test(error.message)
    )
      return (
        <div className="shell section">
          <div className="empty-state">
            <h1>Those filters aren’t valid</h1>
            <p>Reset your filters and try again.</p>
            <Link
              className="button"
              href={kind === "movie" ? "/movies" : "/shows"}
            >
              Reset filters
            </Link>
          </div>
        </div>
      );
    throw error;
  }
  const { result, p } = data;
  const base = kind === "movie" ? "/movies" : "/shows";
  const pageHref = (page: number) => {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(values))
      if (typeof value === "string") q.set(key, value);
    q.set("page", String(page));
    return `${base}?${q}`;
  };
  return (
    <div className="shell">
      <div className="page-top">
        <p className="eyebrow">Explore the collection</p>
        <h1>{kind === "movie" ? "Movies" : "TV shows"}</h1>
        <p>
          {kind === "movie"
            ? "Find the film you didn’t know you were looking for."
            : "Great characters. Unforgettable worlds. Your next obsession."}
        </p>
      </div>
      <form className="filter-bar" action={base}>
        <label className="field search">
          Search by title
          <input
            name="q"
            defaultValue={p.query}
            placeholder={kind === "movie" ? "Find a film…" : "Find a series…"}
            maxLength={200}
          />
        </label>
        <label className="field">
          Genre
          <select name="genre" defaultValue={p.genre || ""}>
            <option value="">All genres</option>
            {(kind === "movie" ? genres : tvGenres).map((g) => (
              <option value={g.id} key={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Year
          <input
            name="year"
            type="number"
            min="1870"
            max={new Date().getFullYear() + 3}
            defaultValue={p.year || ""}
            placeholder="Any year"
            className="w-28"
          />
        </label>
        <label className="field">
          Minimum score
          <select name="rating" defaultValue={p.rating || ""}>
            <option value="">Any score</option>
            {[6, 7, 8, 9].map((r) => (
              <option key={r} value={r}>
                {r}+ / 10
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Sort by
          <select name="sort" defaultValue={p.sort}>
            <option value="popularity.desc">Popular</option>
            <option value="vote_average.desc">Top rated</option>
            <option
              value={
                kind === "movie"
                  ? "primary_release_date.desc"
                  : "first_air_date.desc"
              }
            >
              Newest
            </option>
          </select>
        </label>
        <button className="button" type="submit">
          Explore
        </button>
        <Link className="text-link" href={base}>
          Reset
        </Link>
        <p className="filter-note">
          Title searches open unified search. Clear the title to browse by
          genre, year, score, and sort order.
        </p>
      </form>
      <div className="result-bar">
        <span>
          {result.total_results.toLocaleString()}{" "}
          {p.query ? `results for “${p.query}”` : "titles to explore"}
        </span>
        <span>
          Page {p.page} of {Math.max(1, Math.min(result.total_pages, 500))}
        </span>
      </div>
      {result.results.length ? (
        <TitleGrid items={result.results} kind={kind} eagerFirst />
      ) : (
        <div className="empty-state">
          <h2>No stories found this time</h2>
          <p>Try another title or broaden your filters.</p>
          <Link className="button subtle" href={base}>
            Clear filters
          </Link>
        </div>
      )}
      <nav className="pagination" aria-label="Pagination">
        {p.page > 1 && (
          <Link className="button subtle" href={pageHref(p.page - 1)}>
            Previous
          </Link>
        )}
        {p.page < Math.min(500, result.total_pages) && (
          <Link className="button subtle" href={pageHref(p.page + 1)}>
            Next page
          </Link>
        )}
      </nav>
    </div>
  );
}
