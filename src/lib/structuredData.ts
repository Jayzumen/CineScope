type Credit = { name: string; job?: string };
export type StructuredTitle = {
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: { name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  credits?: { cast?: Credit[]; crew?: Credit[] };
};

/**
 * schema.org Movie / TVSeries description for search engines. Only public
 * TMDB data is included; nothing from the visitor's library.
 */
export function titleStructuredData(
  item: StructuredTitle,
  kind: "movie" | "tv",
  page: { name: string; url: string; image?: string },
) {
  const date = kind === "movie" ? item.release_date : item.first_air_date;
  const people = (list: Credit[] | undefined) =>
    list?.map((p) => ({ "@type": "Person", name: p.name }));
  const directors = people(
    item.credits?.crew?.filter((p) =>
      kind === "movie" ? p.job === "Director" : p.job === "Creator",
    ),
  );
  const votes = item.vote_count ?? 0;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": kind === "movie" ? "Movie" : "TVSeries",
    name: page.name,
    url: page.url,
    description: item.overview || undefined,
    image: page.image,
    datePublished: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    genre: item.genres?.map((g) => g.name),
    actor: people(item.credits?.cast?.slice(0, 6)),
    [kind === "movie" ? "director" : "creator"]: directors?.length
      ? directors
      : undefined,
    duration:
      kind === "movie" && item.runtime ? `PT${item.runtime}M` : undefined,
    numberOfSeasons: kind === "tv" ? item.number_of_seasons : undefined,
    aggregateRating:
      votes > 0 && item.vote_average
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(item.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 0,
            ratingCount: votes,
          }
        : undefined,
  };
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) =>
        value !== undefined && !(Array.isArray(value) && !value.length),
    ),
  );
}

/**
 * Serializes JSON for an inline <script type="application/ld+json">. Escaping
 * "<" prevents upstream text such as "</script>" from closing the element.
 */
export const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
