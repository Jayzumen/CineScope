import test from "node:test";
import assert from "node:assert/strict";
import {
  clientKey,
  createMemoryLimiter,
  enforceSharedLimits,
  positiveInteger,
  RequestLimitError,
  validateSearchQuery,
} from "../src/lib/requestProtection.ts";
const limit = (key, maxRequests = 2, windowMs = 1000) => ({
  key,
  maxRequests,
  windowMs,
});
test("search accepts short titles and rejects malformed or oversized inputs", () => {
  assert.equal(validateSearchQuery(" Up "), "Up");
  for (const input of [null, {}, 3, "", "  ", "x".repeat(201)])
    assert.throws(() => validateSearchQuery(input));
});
test("configuration rejects disabled and invalid limits", () => {
  assert.equal(positiveInteger(undefined, 20), 20);
  for (const input of ["0", "-1", "NaN", "", "1.5", "Infinity"])
    assert.throws(() => positiveInteger(input, 20));
});
test("forwarded headers are untrusted by default; malformed lists share fallback", () => {
  const h = new Headers({
    "x-forwarded-for": "1.2.3.4",
    "x-client-ip": "2001:db8::1",
  });
  assert.equal(clientKey(h), "anonymous");
  assert.equal(
    clientKey(h, "x-client-ip"),
    clientKey(
      new Headers({ "x-client-ip": "2001:0db8:0:0:0:0:0:1" }),
      "x-client-ip",
    ),
  );
  h.set("x-client-ip", "1.2.3.4, 5.6.7.8");
  assert.equal(clientKey(h, "x-client-ip"), "anonymous");
});
test("burst rejection, expiry, and all-or-nothing window accounting", () => {
  const enforce = createMemoryLimiter();
  enforce([limit("hour", 1, 10_000)], 0);
  assert.throws(
    () => enforce([limit("minute", 1), limit("hour", 1, 10_000)], 100),
    RequestLimitError,
  );
  enforce([limit("minute", 1)], 100);
  assert.throws(() => enforce([limit("minute", 1)], 101), RequestLimitError);
  enforce([limit("minute", 1)], 1100);
});
test("memory is bounded and expired keys are reclaimed", () => {
  const enforce = createMemoryLimiter(1);
  enforce([limit("a")], 0);
  assert.throws(() => enforce([limit("b")], 1), /unavailable/);
  enforce([limit("b")], 1000);
});
test("shared limiter sends one atomic command and exposes retry time", async () => {
  const options = {
    url: "https://redis.example",
    token: "test",
    namespace: "test",
    fetcher: async (_url, init) => {
      const command = JSON.parse(init.body);
      assert.equal(command[0], "EVAL");
      assert.equal(command[2], 2);
      assert.deepEqual(command.slice(3), [
        "{test}:a",
        "{test}:b",
        2,
        1000,
        2,
        1000,
      ]);
      assert.equal(init.cache, "no-store");
      return Response.json({ result: 1500 });
    },
  };
  await assert.rejects(
    enforceSharedLimits([limit("a"), limit("b")], options),
    (error) => error.retryAfterSeconds === 2,
  );
});
test("shared backend fails closed on errors and invalid results", async () => {
  for (const response of [
    new Response("", { status: 503 }),
    Response.json({ error: "failed" }),
    Response.json({ result: -1 }),
    Response.json({ result: "0" }),
  ]) {
    await assert.rejects(
      enforceSharedLimits([limit("a")], {
        url: "https://redis.example",
        token: "test",
        namespace: "test",
        fetcher: async () => response,
      }),
    );
  }
  await enforceSharedLimits([limit("a")], {
    url: "https://redis.example",
    token: "test",
    namespace: "test",
    fetcher: async () => Response.json({ result: 0 }),
  });
});
