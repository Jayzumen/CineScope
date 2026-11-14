# CineScope

A cinematic movie, TV and people discovery website built with Next.js, React, TypeScript, Tailwind CSS, Radix UI and Firebase. Features include unified search, filtered catalogs, trailers, regional streaming availability, season information, themed collections, an installable app manifest, branded link previews, and a private library with favorites, watchlists, watched status and personal ratings. Selected titles can be shared through public URLs without exposing account data.

## Local development

Use Node 24 and pnpm 10.12.4:

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# Set TMDB_API_KEY; Firebase is optional for browsing, required for accounts.
pnpm dev
```

Open http://localhost:3000. Use SITE_URL matching your browser origin. Without Firebase configuration the account UI explains that sign-in is unavailable. Development without Redis uses bounded in-memory limits; production requires shared Redis and fails closed when it is unavailable. Builds do not need live service credentials.

## Validation

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:rules  # Java 21+, local Firestore emulator, demo project only
pnpm test:redis  # redis-server and redis-cli on PATH (or REDIS_SERVER_BIN/REDIS_CLI_BIN)
pnpm test:e2e    # Chromium installed with pnpm exec playwright install chromium
```

Browser integration tests include automated accessibility scans. They need a valid TMDB_API_KEY, live TMDB connectivity and no Firebase configuration. Set E2E_BASE_URL to test an already running local server. CI always runs static, unit, rules, Redis and build checks; live browser checks run when the repository has the TMDB_API_KEY Actions secret. No Firebase production credentials are used by tests.

## Deployment and design

Deploy to Netlify using the checked-in netlify.toml and its automatic Next.js adapter. Follow [the Netlify checklist](docs/deployment.md), [security model](docs/security.md), and [style guide](docs/style-guide.md). Service provisioning, published Firestore rules and App Check enforcement are separate deployment steps; source code alone does not activate them.

The gitignored IMPROVEMENTS.local.md tracks implementation and remaining launch checks. The project uses Next.js 16, Firebase 13, ESLint 10 and the latest TypeScript version supported by the current TypeScript-ESLint parser. Production builds use Next.js's supported webpack mode; development keeps the default Turbopack compiler. Current moderate development-tool advisories are documented in the security guide.

Movie data and images are provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB. Viewing availability is supplied through TMDB/JustWatch and varies by region and time. Trailers use YouTube privacy-enhanced embeds.
