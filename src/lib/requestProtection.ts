import { createHash } from "node:crypto";
import { isIP } from "node:net";

export type LimitConfig = {
  key: string;
  maxRequests: number;
  windowMs: number;
};
export class RequestLimitError extends Error {
  readonly retryAfterSeconds: number;
  constructor(seconds: number) {
    super(`Too many requests. Please try again in ${seconds} seconds.`);
    this.retryAfterSeconds = seconds;
  }
}
export function positiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0)
    throw new Error("Invalid rate-limit configuration.");
  return parsed;
}
export function validateSearchQuery(value: unknown): string {
  if (typeof value !== "string" || value.length > 200 || !value.trim()) {
    throw new Error("Enter a search term between 1 and 200 characters.");
  }
  return value.trim();
}
// Only configure a header your proxy overwrites; block direct origin access.
export function clientKey(
  headers: Pick<Headers, "get">,
  trustedHeader?: string,
): string {
  const value = trustedHeader ? headers.get(trustedHeader)?.trim() : undefined;
  const version = value ? isIP(value) : 0;
  const normalized =
    version === 6 ? new URL(`http://[${value}]/`).hostname : value;
  return version
    ? createHash("sha256").update(normalized!).digest("hex")
    : "anonymous";
}
export function validateLimits(limits: LimitConfig[]) {
  if (
    !limits.length ||
    new Set(limits.map((x) => x.key)).size !== limits.length
  )
    throw new Error("Invalid limits.");
  for (const limit of limits) {
    positiveInteger(String(limit.maxRequests), 1);
    positiveInteger(String(limit.windowMs), 1);
    if (!limit.key || limit.key.length > 256)
      throw new Error("Invalid rate-limit key.");
  }
}
export function createMemoryLimiter(maxEntries = 10_000) {
  const store = new Map<string, { count: number; expires: number }>();
  return (limits: LimitConfig[], now = Date.now()) => {
    validateLimits(limits);
    for (const [key, record] of store)
      if (record.expires <= now) store.delete(key);
    const newKeys = limits.filter((x) => !store.has(x.key)).length;
    if (store.size + newKeys > maxEntries)
      throw new Error("Request protection is temporarily unavailable.");
    let retry = 0;
    for (const limit of limits) {
      const record = store.get(limit.key);
      if (record && record.count >= limit.maxRequests)
        retry = Math.max(retry, record.expires - now);
    }
    if (retry) throw new RequestLimitError(Math.ceil(retry / 1000));
    for (const limit of limits) {
      const record = store.get(limit.key) ?? {
        count: 0,
        expires: now + limit.windowMs,
      };
      record.count++;
      store.set(limit.key, record);
    }
  };
}
// Check every window before consuming any. Redis executes this atomically.
export const rateLimitScript = `
local retry = 0
for i, key in ipairs(KEYS) do
  local count = tonumber(redis.call('GET', key) or '0')
  if count >= tonumber(ARGV[i * 2 - 1]) then
    local ttl = redis.call('PTTL', key)
    if ttl < 0 then ttl = tonumber(ARGV[i * 2]) end
    retry = math.max(retry, ttl)
  end
end
if retry > 0 then return retry end
for i, key in ipairs(KEYS) do
  local count = redis.call('INCR', key)
  if count == 1 then redis.call('PEXPIRE', key, ARGV[i * 2]) end
end
return 0
`;
export async function enforceSharedLimits(
  limits: LimitConfig[],
  options: {
    url: string;
    token: string;
    namespace: string;
    fetcher?: typeof fetch;
  },
) {
  validateLimits(limits);
  const url = new URL(options.url);
  if (
    url.protocol !== "https:" ||
    !options.token ||
    !/^[a-zA-Z0-9_-]{1,64}$/.test(options.namespace)
  ) {
    throw new Error("Invalid shared rate-limit configuration.");
  }
  const response = await (options.fetcher ?? fetch)(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      rateLimitScript,
      limits.length,
      ...limits.map((x) => `{${options.namespace}}:${x.key}`),
      ...limits.flatMap((x) => [x.maxRequests, x.windowMs]),
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
    redirect: "error",
  });
  if (!response.ok)
    throw new Error("Request protection is temporarily unavailable.");
  const data = await response.json();
  if (data.error || !Number.isSafeInteger(data.result) || data.result < 0) {
    throw new Error("Request protection is temporarily unavailable.");
  }
  if (data.result > 0)
    throw new RequestLimitError(Math.ceil(data.result / 1000));
}
