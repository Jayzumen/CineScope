import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer shell">
      <div>
        <Link className="wordmark" href="/">
          Cine<span className="text-accent">Scope</span>
        </Link>
        <p>A good story is always worth finding.</p>
      </div>
      <div className="footer-links">
        <Link href="/movies">Movies</Link>
        <Link href="/shows">TV shows</Link>
        <Link href="/privacy">Privacy</Link>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data by TMDB
        </a>
      </div>
      <p className="fine-print">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        Availability data by JustWatch.
      </p>
    </footer>
  );
}
