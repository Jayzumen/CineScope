export const metadata = { title: "Privacy & data" };
export default function Page() {
  return (
    <article className="shell prose">
      <h1>Your collection belongs to you.</h1>
      <p>
        CineScope uses TMDB to display films, series and people. You can browse
        without creating an account.
      </p>
      <h2>Account and library</h2>
      <p>
        Signing in uses Firebase Authentication. Favorites, watchlist, watched
        status, ratings and the date you saved each title are stored in
        Firestore under your account. Library records are private under our
        application rules. You can remove saved titles from My Library, and you
        can permanently delete your account and all library data yourself at the
        bottom of My Library.
      </p>
      <h2>Region</h2>
      <p>
        Where-to-watch information defaults to the country your connection
        appears to come from, as reported by our host, or your browser’s
        language settings. If you choose a region, a cookie remembers that
        choice for a year. It stores only the two-letter region code.
      </p>
      <h2>Sharing</h2>
      <p>
        A shared list puts selected movie and series IDs in a URL. Anyone who
        receives that URL can view those titles. Your email, account identity,
        ratings and viewing status are not included. Links can be copied and
        cannot be revoked; only share selections you are comfortable making
        public.
      </p>
      <h2>Service providers</h2>
      <p>
        Netlify hosts the site. TMDB supplies catalog data and JustWatch
        supplies availability through TMDB. Opening a trailer connects to
        YouTube. Firebase stores account data. When configured, Upstash provides
        request limiting and Cloudflare Turnstile and Google reCAPTCHA
        Enterprise help protect against abuse.
      </p>
      <h2>Abuse prevention</h2>
      <p>
        Request-limit identifiers are derived from trusted connection
        information and hashed before storage. Short-lived counters help reduce
        automated abuse. Hosting and service providers may retain operational
        logs according to their own policies. Hashing is not a guarantee of
        anonymity.
      </p>
      <h2>Account requests</h2>
      <p>
        For a copy of your data or help with your account, contact{" "}
        <a href="mailto:jnreinhardt96@gmail.com">jnreinhardt96@gmail.com</a>.
        This page describes the application’s data flow; deployment-specific
        retention and processor settings must be reviewed before public launch.
      </p>
    </article>
  );
}
