"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shell section">
      <div className="empty-state">
        <p className="eyebrow justify-center">A brief intermission</p>
        <h1>The catalog is taking a moment.</h1>
        <p>
          We couldn’t load this page. The service may be busy or temporarily
          unavailable. Please try again shortly.
        </p>
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link className="button subtle ml-3" href="/">
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
