# Security model

TMDB credentials remain server-side. HTML browse requests have burst/sustained limits; text searches use only POST /api/search, including title searches originating in the catalogs. The API bounds streaming JSON bodies to 4096 bytes, validates input and returns sanitized errors, 429/Retry-After for limits and 503 for backend failure. Same-origin checking is an additional browser safeguard, not authentication: nonbrowser clients can omit Origin.

Redis REST runs an atomic Lua operation that checks all windows before incrementing any, with expiring counters. All instances share a namespace. Production fails closed if configuration or Redis is unavailable; development alone may use bounded memory storage. Search uses IP limits and an additional verified Firebase UID quota when a bearer token is supplied. Google-signed ID tokens are checked for issuer, audience, algorithm, expiry and claims. This additive quota does not check token revocation or authorize database reads. Those are enforced separately by Firebase.

Anonymous IPs come only from an explicitly trusted single-IP header, normalized and hashed. Unconfigured or malformed values share an anonymous bucket. These hashes are pseudonymous. Shared networks share quotas; distributed bots still require edge controls. Do not trust arbitrary forwarding headers. See the Netlify verification steps in deployment.md.

Search requests above the soft threshold require Turnstile. Verification checks hostname, action, age and provider success, then uses Redis for replay protection. Challenge failures have an accessible retry path. Missing challenge configuration yields a temporary rate limit. Client-side Firebase App Check initialization is implemented, but registration and enforcement must be activated separately.

TMDB results are cached for one hour (search five minutes). Only upstream cache misses and actual retry attempts consume the global TMDB budget. Requests time out after eight seconds with at most one jittered retry for network/5xx failures; 404 and 429 are not retried. Redis calls time out after three seconds. Cached results can briefly lag provider changes.

## Firebase data

Rules restrict likedMovies, likedShows and library documents to their owning UID and validate exact bounded schemas. Library documents support movie/TV IDs, title/artwork/year, watchlist/watched and integer ratings 0–10. All other paths are denied. Rules validate structure, not metadata authenticity, and do not enforce collection-size or write-rate quotas. The library displays up to 200 entries per collection. Shared-list URLs contain only selected public title IDs/name; anyone with the link can view them and links cannot be revoked. Account identity, status and ratings stay out of those URLs.

Emulator tests cover ownership, anonymous/cross-user denial, malformed writes and legacy favorite documents. They do not inspect the deployed project. Publish updated clients before stricter rules; existing older clients may require reload. Live authentication/provider and App Check verification remains a launch requirement.

## Browser and dependency protections

Per-request CSP nonces restrict scripts; object embedding and framing are denied. The policy permits required Firebase, Google, Turnstile, TMDB image and privacy-enhanced YouTube origins. Inline styles remain allowed for UI libraries. Production adds HSTS and insecure-request upgrading. OAuth popups use same-origin-allow-popups. Review CSP with actual configured providers before launch.

The application was migrated to Next.js 16.4, Firebase 13.3, ESLint 10 and native flat ESLint configuration. TypeScript remains on 5.9 because the current TypeScript-ESLint parser declares support below 6.1; Node types remain on the Node 24 line used in production. Unused UI packages were removed. The November 14, 2026 audit still reports five moderate findings: one minimatch path in ESLint and four paths in the Firebase CLI development toolchain (minimatch, glob, uuid and OpenTelemetry), with no high or critical findings. None are bundled into the browser or production server. Their patched releases require incompatible transitive majors that the upstream tools do not yet accept, so this project does not force overrides across those package contracts. Re-run `pnpm audit` as advisories and upstream releases change; a historical audit is not a guarantee.

## Verification and limitations

Unit tests cover input, redirect, media and request protection behavior. Real Redis integration tests exercise the actual Lua script under concurrent requests, all-or-nothing consumption and expiry. Firestore tests use a loopback demo emulator. Playwright covers desktop/mobile layouts, URL controls, short/empty searches, missing artwork, modal Escape/focus restoration, missing account configuration and response headers. Eight automated WCAG-tagged axe scans passed across desktop/mobile home, catalog, search and login. These scans do not certify full accessibility. After the major migration, 12 unit tests, 10 Firestore tests, the Redis integration, and all 22 desktop/mobile browser and accessibility tests passed alongside lint, type checking and a production build.

External activation and testing remain necessary: Netlify ingress/WAF, multi-instance deployment, live challenge, App Check enforcement, provider login, production rules, quotas/alerts, privacy operations and performance under realistic traffic. No application can guarantee elimination of bots or abuse.
