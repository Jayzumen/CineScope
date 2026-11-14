/** Thrown for user-supplied input that fails validation (never for outages). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
// Single source for the discover filters; catalogTypes re-exports these.
// Kept here (no imports) so the Node unit tests can load this module directly.
export const genres = [
  { id: 28, label: "Action" },
  { id: 35, label: "Comedy" },
  { id: 18, label: "Drama" },
  { id: 27, label: "Horror" },
  { id: 878, label: "Science fiction" },
  { id: 53, label: "Thriller" },
  { id: 16, label: "Animation" },
  { id: 99, label: "Documentary" },
];
export const tvGenres = [
  { id: 10759, label: "Action & adventure" },
  { id: 35, label: "Comedy" },
  { id: 18, label: "Drama" },
  { id: 9648, label: "Mystery" },
  { id: 10765, label: "Sci-fi & fantasy" },
  { id: 16, label: "Animation" },
  { id: 99, label: "Documentary" },
];
export function mediaId(value: string): string {
  if (!/^[1-9]\d{0,9}$/.test(value))
    throw new ValidationError("Invalid media ID.");
  return value;
}
export function safeReturnPath(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\r\n]/.test(value) ||
    value.startsWith("/login")
  )
    return "/account";
  return value.slice(0, 2000);
}
export function catalogParams(
  values: Record<string, string | string[] | undefined>,
  kind: "movie" | "tv",
) {
  const read = (key: string) =>
    typeof values[key] === "string" ? (values[key] as string) : "";
  const query = read("q").trim();
  if (query.length > 200)
    throw new ValidationError("Search is limited to 200 characters.");
  const number = (key: string, min: number, max: number, fallback: number) => {
    const raw = read(key);
    if (!raw) return fallback;
    const n = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(n) || n < min || n > max)
      throw new ValidationError(`Invalid ${key}.`);
    return n;
  };
  const page = number("page", 1, 500, 1);
  const year = number("year", 1870, new Date().getFullYear() + 3, 0);
  const rating = number("rating", 0, 9, 0);
  const genre = number("genre", 1, 99999, 0);
  const allowed = (kind === "movie" ? genres : tvGenres).map((g) => g.id);
  if (genre && !allowed.includes(genre))
    throw new ValidationError("Invalid genre.");
  const sort = read("sort") || "popularity.desc";
  if (
    ![
      "popularity.desc",
      "vote_average.desc",
      kind === "movie" ? "primary_release_date.desc" : "first_air_date.desc",
    ].includes(sort)
  )
    throw new ValidationError("Invalid sort order.");
  return { query, page, year, rating, genre, sort };
}
