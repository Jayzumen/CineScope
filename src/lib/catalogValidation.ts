export function mediaId(value: string): string {
  if (!/^[1-9]\d{0,9}$/.test(value)) throw new Error("Invalid media ID.");
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
    throw new Error("Search is limited to 200 characters.");
  const number = (key: string, min: number, max: number, fallback: number) => {
    const raw = read(key);
    if (!raw) return fallback;
    const n = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(n) || n < min || n > max)
      throw new Error(`Invalid ${key}.`);
    return n;
  };
  const page = number("page", 1, 500, 1);
  const year = number("year", 1870, new Date().getFullYear() + 3, 0);
  const rating = number("rating", 0, 9, 0);
  const genre = number("genre", 1, 99999, 0);
  const allowed =
    kind === "movie"
      ? [28, 35, 18, 27, 878, 53, 16, 99]
      : [10759, 35, 18, 9648, 10765, 16, 99];
  if (genre && !allowed.includes(genre)) throw new Error("Invalid genre.");
  const sort = read("sort") || "popularity.desc";
  if (
    ![
      "popularity.desc",
      "vote_average.desc",
      kind === "movie" ? "primary_release_date.desc" : "first_air_date.desc",
    ].includes(sort)
  )
    throw new Error("Invalid sort order.");
  return { query, page, year, rating, genre, sort };
}
