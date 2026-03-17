import "server-only";

type LimitConfig = {
  key: string;
  maxRequests: number;
  windowMs: number;
  message?: string;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const requestStore = new Map<string, RateLimitRecord>();

const now = () => Date.now();

function checkWindow(config: LimitConfig) {
  const current = now();
  const existing = requestStore.get(config.key);

  if (!existing || current >= existing.resetAt) {
    requestStore.set(config.key, {
      count: 1,
      resetAt: current + config.windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(config.maxRequests - 1, 0),
      retryAfterMs: config.windowMs,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(existing.resetAt - current, 0),
    };
  }

  existing.count += 1;
  requestStore.set(config.key, existing);

  return {
    allowed: true,
    remaining: Math.max(config.maxRequests - existing.count, 0),
    retryAfterMs: Math.max(existing.resetAt - current, 0),
  };
}

export function enforceRateLimit(configs: LimitConfig[]) {
  for (const config of configs) {
    const result = checkWindow(config);

    if (!result.allowed) {
      throw new Error(
        config.message ??
          `Too many requests. Please try again in ${Math.ceil(result.retryAfterMs / 1000)} seconds.`
      );
    }
  }
}

