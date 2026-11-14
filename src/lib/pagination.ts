// TMDB serves at most 500 pages for discover endpoints.
export const MAX_PAGES = 500;

/** Reachable page count for a TMDB total, never less than one. */
export const pageCount = (totalPages: number) =>
  Math.max(
    1,
    Math.min(Number.isFinite(totalPages) ? totalPages : 1, MAX_PAGES),
  );

/**
 * Page numbers to show around the current page, with "gap" markers.
 * Always includes the first and last page: 1 … 4 5 [6] 7 8 … 500.
 */
export function pageWindow(
  current: number,
  total: number,
  radius = 2,
): (number | "gap")[] {
  const last = pageCount(total);
  const page = Math.min(Math.max(1, current), last);
  const from = Math.max(2, page - radius);
  const to = Math.min(last - 1, page + radius);
  const items: (number | "gap")[] = [1];
  // A gap that would hide a single page shows that page instead.
  if (from === 3) items.push(2);
  else if (from > 3) items.push("gap");
  for (let n = from; n <= to; n++) items.push(n);
  if (to === last - 2) items.push(last - 1);
  else if (to < last - 2) items.push("gap");
  if (last > 1) items.push(last);
  return items;
}
