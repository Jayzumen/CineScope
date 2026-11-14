import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageCount, pageWindow } from "@/lib/pagination";

/** Numbered pagination. `href` builds the link for a page number. */
export default function Pagination({
  page,
  totalPages,
  href,
  label = "Pagination",
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  label?: string;
}) {
  const last = pageCount(totalPages);
  if (last <= 1 && page <= 1) return null;
  return (
    <nav className="pagination" aria-label={label}>
      {page > 1 && (
        <Link
          className="page-link"
          href={href(Math.min(page - 1, last))}
          rel="prev"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden />
          <span className="page-link-text">Previous</span>
        </Link>
      )}
      <ol className="page-list">
        {pageWindow(page, last).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} className="page-gap far" aria-hidden>
              …
            </li>
          ) : (
            <li key={n} className={Math.abs(n - page) > 1 ? "far" : undefined}>
              <Link
                className="page-link"
                href={href(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Page ${n}`}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < last && (
        <Link
          className="page-link"
          href={href(page + 1)}
          rel="next"
          aria-label="Next page"
        >
          <span className="page-link-text">Next</span>
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}
    </nav>
  );
}
