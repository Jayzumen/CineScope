import Link from "next/link";
export default function NotFound() {
  return (
    <div className="shell section">
      <div className="empty-state">
        <p className="eyebrow justify-center">Scene missing · 404</p>
        <h1>This story isn’t here.</h1>
        <p>
          The link may be incorrect, or this title is no longer in the catalog.
        </p>
        <Link className="button" href="/search">
          Find another story
        </Link>
      </div>
    </div>
  );
}
