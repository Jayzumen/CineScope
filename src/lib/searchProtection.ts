import { createHash } from "node:crypto";
export async function readSearchBody(
  request: Request,
): Promise<{ query: string; page: number; token?: string }> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Invalid request.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Invalid request.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new Error("Request too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (
    !raw ||
    typeof raw !== "object" ||
    Array.isArray(raw) ||
    Object.keys(raw).some((k) => !["query", "page", "token"].includes(k))
  )
    throw new Error("Invalid request.");
  if (
    typeof raw.query !== "string" ||
    !raw.query.trim() ||
    raw.query.length > 200
  )
    throw new Error("Enter 1 to 200 characters.");
  const page = raw.page ?? 1;
  if (!Number.isInteger(page) || page < 1 || page > 500)
    throw new Error("Invalid page.");
  if (
    raw.token !== undefined &&
    (typeof raw.token !== "string" || raw.token.length > 2048)
  )
    throw new Error("Invalid verification token.");
  return { query: raw.query.trim(), page, token: raw.token };
}
export async function verifyChallenge(
  token: string,
  secret: string,
  hostname: string,
  fetcher: typeof fetch = fetch,
) {
  if (!token || token.length > 2048 || !secret || !hostname) return false;
  const response = await fetcher(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
      redirect: "error",
      cache: "no-store",
    },
  );
  if (!response.ok) return false;
  const data = await response.json();
  const age = Date.now() - Date.parse(data.challenge_ts);
  return (
    data.success === true &&
    data.hostname === hostname &&
    data.action === "search" &&
    Number.isFinite(age) &&
    age >= -10_000 &&
    age <= 300_000
  );
}
export const challengeKey = (token: string) =>
  `challenge:${createHash("sha256").update(token).digest("hex")}`;
