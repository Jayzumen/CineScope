"use client";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "./AuthProvider";
import TitleGrid from "./TitleGrid";
import Turnstile from "./Turnstile";
import type { MediaResults } from "@/lib/catalogTypes";
export default function GlobalSearch({ nonce }: { nonce?: string }) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const rawPage = Number(params.get("page") ?? 1);
  const page =
    Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= 500 ? rawPage : 1;
  return (
    <SearchExperience key={`${q}:${page}`} nonce={nonce} q={q} page={page} />
  );
}
function SearchExperience({
  nonce,
  q,
  page,
}: {
  nonce?: string;
  q: string;
  page: number;
}) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { user } = useAuth();
  const [input, setInput] = useState(q);
  const [result, setResult] = useState<MediaResults | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState(false);
  const [filter, setFilter] = useState("all");
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const load = useCallback(
    async (token?: string) => {
      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;
      const id = ++requestId.current;
      setBusy(true);
      setError("");
      setChallenge(false);
      setResult(null);
      try {
        const jwt = await user?.getIdToken();
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ query: q, page, token }),
          signal: ctrl.signal,
        });
        const data = await response.json();
        if (id !== requestId.current) return;
        if (!response.ok) {
          setError(data.error || "Search failed. Please try again.");
          setChallenge(data.challenge === true);
        } else setResult(data);
      } catch (e) {
        if (
          id === requestId.current &&
          !(e instanceof Error && e.name === "AbortError")
        )
          setError("Could not connect. Check your connection and try again.");
      } finally {
        if (id === requestId.current) setBusy(false);
      }
    },
    [page, q, user],
  );
  useEffect(() => {
    let active = true;
    if (q.trim())
      queueMicrotask(() => {
        if (active) void load();
      });
    return () => {
      active = false;
      controller.current?.abort();
    };
  }, [load, q]);
  const handleToken = useCallback((token: string) => void load(token), [load]);
  const navigate = (query: string, p = 1) =>
    router.push(
      `/search?${new URLSearchParams({ q: query, page: String(p) })}`,
    );
  return (
    <>
      <form
        className="search-form"
        action="/search"
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() === q && page === 1) void load();
          else navigate(input.trim());
        }}
      >
        <label className="sr-only" htmlFor="global-search">
          Search movies, shows and people
        </label>
        <input
          id="global-search"
          disabled={!hydrated}
          name="q"
          className="input"
          type="search"
          value={input}
          maxLength={200}
          required
          onChange={(e) => setInput(e.target.value)}
          placeholder="A title, a series, a familiar face…"
        />
        <button className="button" disabled={busy || !hydrated}>
          <Search size={17} />
          Search
        </button>
      </form>
      {busy && (
        <p role="status" className="muted">
          Finding your next story…
        </p>
      )}
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      {challenge && (
        <Turnstile nonce={nonce} onToken={handleToken} />
      )}
      {result && (
        <>
          <div className="result-bar">
            <span>
              {result.total_results.toLocaleString()} results for “{q}”
            </span>
            <span>Page {page}</span>
          </div>
          <div className="tab-row" aria-label="Filter this page">
            {[
              ["all", "All"],
              ["movie", "Movies"],
              ["tv", "TV shows"],
              ["person", "People"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {filter !== "all" && (
            <p className="filter-note mb-5">
              Showing{" "}
              {filter === "person"
                ? "people"
                : filter === "movie"
                  ? "movies"
                  : "TV shows"}{" "}
              on this results page.
            </p>
          )}
          {result.results.filter(
            (x) => filter === "all" || x.media_type === filter,
          ).length ? (
            <TitleGrid
              items={result.results.filter(
                (x) => filter === "all" || x.media_type === filter,
              )}
            />
          ) : (
            <div className="empty-state">
              <h2>No matches this time</h2>
              <p>
                Try another title or select All to see other results on this
                page.
              </p>
            </div>
          )}
          <nav className="pagination" aria-label="Search pages">
            {page > 1 && (
              <button
                className="button subtle"
                onClick={() => navigate(q, page - 1)}
              >
                Previous
              </button>
            )}
            {page < Math.min(result.total_pages, 500) && (
              <button
                className="button subtle"
                onClick={() => navigate(q, page + 1)}
              >
                Next page
              </button>
            )}
          </nav>
        </>
      )}
      {!q && !busy && (
        <div className="empty-state">
          <h2>Follow a name. Find a world.</h2>
          <p>
            Search across films, television and the people who bring them to
            life.
          </p>
        </div>
      )}
    </>
  );
}
