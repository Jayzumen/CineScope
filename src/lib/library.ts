// One private library document per title: users/{uid}/library/{kind}-{id}.
// Watch status and the favorite flag live together; a document exists only
// while the title is on a list or marked as a favorite.
export type LibraryStatus = "watchlist" | "watched";
export type LibraryTimestamp = { toMillis(): number };
export type LibraryFields = {
  id: number;
  kind: "movie" | "tv";
  title: string;
  poster_path: string;
  year: string;
  /** "" means favorite only, not on the watchlist or marked watched. */
  status: LibraryStatus | "";
  rating: number;
  favorite: boolean;
};
export type LibraryEntry = LibraryFields & {
  // Missing on documents written before timestamps were introduced.
  addedAt?: LibraryTimestamp;
  updatedAt?: LibraryTimestamp;
};
export type LibrarySource = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  year?: string;
};
export type LibraryChange = {
  status?: LibraryStatus | "";
  rating?: number;
  favorite?: boolean;
};
export const libraryKey = (kind: "movie" | "tv", id: number) => `${kind}-${id}`;
// Mirrors the library shape in firestore.rules so valid titles are never rejected.
export function libraryDocument(
  item: LibrarySource,
  kind: "movie" | "tv",
  state: { status: LibraryStatus | ""; rating: number; favorite: boolean },
): LibraryFields {
  if (!Number.isSafeInteger(item.id) || item.id <= 0 || item.id > 9999999999)
    throw new Error("Invalid title ID.");
  if (kind !== "movie" && kind !== "tv") throw new Error("Invalid kind.");
  if (!["", "watchlist", "watched"].includes(state.status))
    throw new Error("Invalid status.");
  const poster = item.poster_path ?? "";
  const year = (
    item.release_date ||
    item.first_air_date ||
    item.year ||
    ""
  ).slice(0, 4);
  const title =
    item.title || item.name || item.original_title || item.original_name || "";
  const { rating } = state;
  return {
    id: item.id,
    kind,
    title: (title.trim() || "Untitled").slice(0, 500),
    poster_path:
      poster.length <= 200 && /^\/[a-zA-Z0-9._-]+$/.test(poster) ? poster : "",
    year: /^\d{4}$/.test(year) ? year : "",
    status: state.status,
    rating:
      Number.isInteger(rating) && rating >= 0 && rating <= 10 ? rating : 0,
    favorite: state.favorite === true,
  };
}
/**
 * Applies a change to the stored entry (if any). Returns null when the title
 * is on no list and not a favorite, meaning the document should be deleted.
 */
export function mergeLibraryEntry(
  previous: Partial<LibraryEntry> | undefined,
  item: LibrarySource,
  kind: "movie" | "tv",
  change: LibraryChange,
): LibraryFields | null {
  const previousStatus =
    previous?.status === "watchlist" || previous?.status === "watched"
      ? previous.status
      : "";
  const status = change.status ?? previousStatus;
  const favorite = change.favorite ?? previous?.favorite === true;
  if (status === "" && !favorite) return null;
  return libraryDocument(item, kind, {
    status,
    favorite,
    rating: change.rating ?? previous?.rating ?? 0,
  });
}
export const addedMillis = (entry: Pick<LibraryEntry, "addedAt">) =>
  entry.addedAt?.toMillis() ?? 0;
