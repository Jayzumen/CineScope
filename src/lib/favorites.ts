export type FavoriteCollection = "likedMovies" | "likedShows";
export type FavoriteSource = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
};
const text = (value: string | undefined, max: number) =>
  (value ?? "").slice(0, max);
export function favoriteDocument(
  item: FavoriteSource,
  collection: FavoriteCollection,
) {
  if (!Number.isSafeInteger(item.id) || item.id <= 0)
    throw new Error("Invalid title ID.");
  const score = item.vote_average ?? 0;
  const poster = item.poster_path ?? "";
  const common = {
    id: item.id,
    poster_path: /^\/[a-zA-Z0-9._-]+$/.test(poster) ? poster.slice(0, 200) : "",
    overview: text(item.overview, 5000),
    vote_average: Number.isFinite(score) ? Math.min(10, Math.max(0, score)) : 0,
  };
  const date = text(
    collection === "likedMovies" ? item.release_date : item.first_air_date,
    10,
  );
  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
  if (collection === "likedMovies")
    return {
      ...common,
      title: text(item.title || item.original_title || "Untitled", 500),
      original_title: text(item.original_title, 500),
      release_date: safeDate,
    };
  return {
    ...common,
    name: text(item.name || item.original_name || "Untitled", 500),
    original_name: text(item.original_name, 500),
    first_air_date: safeDate,
  };
}
