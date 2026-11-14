"use client";
import Link from "next/link";
import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Share2, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useLibrary } from "@/components/LibraryProvider";
import TitleCard from "@/components/TitleCard";
import LibraryActions from "@/components/LibraryActions";
import { titleOf, type MediaItem } from "@/lib/catalogTypes";
export default function AccountDetails() {
  const { user, services, loading, error } = useAuth();
  const library = useLibrary();
  const [tab, setTab] = useState("watchlist");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("title");
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  if (loading)
    return (
      <div className="shell section" role="status">
        Opening your library…
      </div>
    );
  if (!user)
    return (
      <div className="shell section">
        <div className="empty-state">
          <p className="eyebrow justify-center">Your personal collection</p>
          <h1>Keep the stories that stay with you.</h1>
          <p>
            {error ||
              "Save films and series, track what you’ve watched, and make room for your next favorite."}
          </p>
          <Link href="/login?next=/account" className="button">
            Sign in to your library
          </Link>
          <Link href="/movies" className="button subtle ml-3">
            Explore movies
          </Link>
        </div>
      </div>
    );
  const source: MediaItem[] =
    tab === "favorites"
      ? library.favorites
      : library.entries
          .filter((e) => e.status === tab)
          .map((e) => ({
            id: e.id,
            media_type: e.kind,
            title: e.title,
            poster_path: e.poster_path,
            release_date: e.year,
            vote_average: 0,
          }));
  const items = source
    .filter((x) => titleOf(x).toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sort === "year"
        ? (b.release_date || b.first_air_date || "").localeCompare(
            a.release_date || a.first_air_date || "",
          )
        : titleOf(a).localeCompare(titleOf(b)),
    );
  const keyOf = (item: MediaItem) =>
    `${item.media_type === "tv" ? "tv" : "movie"}-${item.id}`;
  async function remove(item: MediaItem) {
    if (!services || !user || pending) return;
    const key = keyOf(item);
    setPending(key);
    try {
      await deleteDoc(
        doc(
          services.db,
          "users",
          user.uid,
          tab === "favorites"
            ? item.media_type === "tv"
              ? "likedShows"
              : "likedMovies"
            : "library",
          tab === "favorites" ? String(item.id) : key,
        ),
      );
      toast.success("Removed from this collection");
      setSelected((s) => s.filter((x) => x !== key));
    } catch {
      toast.error("Could not remove this title. Try again.");
    } finally {
      setPending(null);
    }
  }
  async function share() {
    const url = new URL("/list", window.location.origin);
    url.searchParams.set("titles", selected.join(","));
    url.searchParams.set("name", "A few stories worth sharing");
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success(
        "Share link copied. Anyone with it can see the selected titles.",
      );
    } catch {
      toast.error("Clipboard unavailable. Try another browser.");
    }
  }
  return (
    <div className="shell">
      <div className="page-top">
        <p className="eyebrow">Made personal</p>
        <h1>
          {user.displayName
            ? `${user.displayName.split(" ")[0]}’s library`
            : "Your library"}
        </h1>
        <p>For later. For the memories. For the stories you love.</p>
      </div>
      <div className="tab-row" aria-label="Library collection">
        {["watchlist", "watched", "favorites"].map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            onClick={() => {
              setTab(t);
              setSelected([]);
            }}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="library-controls">
        <input
          className="input"
          aria-label="Search your library"
          placeholder="Search your collection…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input"
          aria-label="Sort library"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="title">Title A–Z</option>
          <option value="year">Newest first</option>
        </select>
        <button
          className="button subtle"
          disabled={!selected.length}
          onClick={share}
        >
          <Share2 size={16} />
          Share selected ({selected.length}/12)
        </button>
      </div>
      <p className="filter-note mb-6">
        Your library is private. Sharing creates a link to only the titles you
        select, without your account details, viewing status, or ratings. Up to
        200 items per collection are shown.
      </p>
      {library.loading ? (
        <p role="status">Loading your collection…</p>
      ) : library.error ? (
        <p role="alert" className="alert">
          {library.error}
        </p>
      ) : items.length ? (
        <div className="poster-grid five">
          {items.map((item, index) => (
            <div key={keyOf(item)}>
              <TitleCard item={item} save={false} eager={index === 0} />
              <div className="small-actions">
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(keyOf(item))}
                    aria-label={`Select ${titleOf(item)} to share`}
                    disabled={
                      !selected.includes(keyOf(item)) && selected.length >= 12
                    }
                    onChange={(e) =>
                      setSelected((s) =>
                        e.target.checked
                          ? [...s, keyOf(item)]
                          : s.filter((x) => x !== keyOf(item)),
                      )
                    }
                  />{" "}
                  Share
                </label>
                <button
                  className="icon-button ml-auto"
                  disabled={!!pending}
                  aria-label={`Remove ${titleOf(item)}`}
                  onClick={() => remove(item)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {tab !== "favorites" && (
                <LibraryActions
                  item={item}
                  kind={item.media_type === "tv" ? "tv" : "movie"}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>
            {query
              ? "No matching titles"
              : "A new collection starts with one story"}
          </h2>
          <p>
            {query
              ? "Try a different search."
              : "Explore the catalog and save something that catches your eye."}
          </p>
          <Link className="button" href="/movies">
            Find your next film
          </Link>
        </div>
      )}
    </div>
  );
}
