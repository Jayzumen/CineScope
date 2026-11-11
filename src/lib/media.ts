export const artworkPlaceholder = "/artwork-placeholder.svg";
export function artworkUrl(
  path: string | null | undefined,
  size: "w500" | "w1280" = "w500",
  fallback?: string | null,
): string {
  const valid = (value: unknown): value is string =>
    typeof value === "string" &&
    /^\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(value);
  const selected = valid(path) ? path : valid(fallback) ? fallback : null;
  return selected
    ? `https://image.tmdb.org/t/p/${size}${selected}`
    : artworkPlaceholder;
}
export type TrailerVideo = {
  key: string;
  site: string;
  type: string;
  official?: boolean;
};
export function selectTrailer<T extends TrailerVideo>(
  videos: T[] | null | undefined,
): T | undefined {
  const candidates = (videos ?? []).filter(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      /^[a-zA-Z0-9_-]{11}$/.test(video.key),
  );
  return candidates.find((video) => video.official === true) ?? candidates[0];
}
