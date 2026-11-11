import "server-only";
import {
  createMemoryLimiter,
  enforceSharedLimits,
  type LimitConfig,
} from "./requestProtection";
const localLimiter = createMemoryLimiter();
export async function enforceRateLimit(limits: LimitConfig[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return enforceSharedLimits(limits, {
      url,
      token,
      namespace: process.env.RATE_LIMIT_NAMESPACE ?? "cinescope",
    });
  }
  if (url || token || process.env.NODE_ENV === "production") {
    throw new Error("Shared request protection is not configured.");
  }
  localLimiter(limits);
}
