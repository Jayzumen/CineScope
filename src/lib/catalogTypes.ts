export type MediaKind = "movie" | "tv" | "person";
export type MediaItem = {
  id: number;
  media_type?: MediaKind;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  known_for_department?: string;
};
export type MediaResults = {
  results: MediaItem[];
  total_pages: number;
  total_results: number;
  page: number;
};
export const titleOf = (item: MediaItem) =>
  item.title ||
  item.name ||
  item.original_title ||
  item.original_name ||
  "Untitled";
export const hrefOf = (item: MediaItem, kind: MediaKind = "movie") =>
  `/${(item.media_type ?? kind) === "person" ? "cast" : (item.media_type ?? kind) === "tv" ? "shows" : "movies"}/${item.id}`;
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
export const collections = [
  {
    slug: "after-dark",
    title: "After dark",
    subtitle: "Tension. Mystery. One more scene.",
    genre: 53,
    tint: "plum",
  },
  {
    slug: "other-worlds",
    title: "Other worlds",
    subtitle: "A little further from the everyday.",
    genre: 878,
    tint: "blue",
  },
  {
    slug: "small-wonders",
    title: "Small wonders",
    subtitle: "Big imagination, frame by frame.",
    genre: 16,
    tint: "gold",
  },
];
