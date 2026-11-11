// Run with hosting environment exported, or node --env-file=.env.local scripts/check-deployment.mjs.
// Only variable names and validation errors are printed; never values or credentials.
const required = [
  "SITE_URL",
  "TMDB_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "RATE_LIMIT_NAMESPACE",
  "TRUSTED_CLIENT_IP_HEADER",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_HOSTNAME",
];
const errors = required
  .filter((key) => !process.env[key]?.trim())
  .map(
    (key) => `${key} is required for the complete production configuration.`,
  );
for (const key of ["SITE_URL", "UPSTASH_REDIS_REST_URL"]) {
  if (!process.env[key]) continue;
  try {
    const url = new URL(process.env[key]);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error();
  } catch {
    errors.push(
      `${key} must be an HTTPS origin without credentials, query, or path.`,
    );
  }
}
if (process.env.SITE_URL && process.env.TURNSTILE_HOSTNAME) {
  try {
    if (
      new URL(process.env.SITE_URL).hostname !== process.env.TURNSTILE_HOSTNAME
    )
      errors.push("TURNSTILE_HOSTNAME must match SITE_URL.");
  } catch {
    /* handled above */
  }
}
for (const [key, value] of Object.entries(process.env)) {
  if (
    /^(TMDB_GLOBAL|SEARCH|BROWSE)_RATE_LIMIT_PER_(MINUTE|HOUR)$|^SEARCH_CHALLENGE_THRESHOLD$/.test(
      key,
    ) &&
    (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
  )
    errors.push(`${key} must be a positive safe integer.`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Configuration shape passed. Verify live rules, proxy identity, challenge flow, quotas and App Check before launch; this check does not contact providers.",
  );
