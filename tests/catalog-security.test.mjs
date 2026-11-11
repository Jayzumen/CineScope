import test from "node:test";
import assert from "node:assert/strict";
import {
  catalogParams,
  mediaId,
  safeReturnPath,
} from "../src/lib/catalogValidation.ts";
import {
  readSearchBody,
  verifyChallenge,
  challengeKey,
} from "../src/lib/searchProtection.ts";
test("bounded catalog input and safe redirects", () => {
  assert.equal(catalogParams({ q: " Up ", page: "2" }, "movie").query, "Up");
  for (const input of [
    { page: "0" },
    { page: "501" },
    { genre: "999" },
    { year: "0" },
    { rating: "10" },
    { sort: "evil" },
    { q: "x".repeat(201) },
  ])
    assert.throws(() => catalogParams(input, "movie"));
  for (const id of ["0", "../42", "42?x", "1e3", "99999999999"])
    assert.throws(() => mediaId(id));
  for (const url of [
    "//evil.test",
    "https://evil.test",
    "/\\evil.test",
    "/login?next=/",
  ])
    assert.equal(safeReturnPath(url), "/account");
  assert.equal(safeReturnPath("/movies/42"), "/movies/42");
});
test("search request parsing rejects unknown keys and oversized streams", async () => {
  const request = (data) =>
    new Request("http://localhost/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  assert.deepEqual(await readSearchBody(request({ query: " Up " })), {
    query: "Up",
    page: 1,
    token: undefined,
  });
  for (const body of [
    { query: "" },
    { query: [] },
    { query: "Up", admin: true },
    { query: "Up", page: -1 },
    { query: "Up", token: "x".repeat(5000) },
  ])
    await assert.rejects(readSearchBody(request(body)));
});
test("challenge verification enforces hostname, action, age and upstream failure", async () => {
  const good = {
    success: true,
    hostname: "example.com",
    action: "search",
    challenge_ts: new Date().toISOString(),
  };
  for (const patch of [
    { success: false },
    { hostname: "evil.test" },
    { action: "login" },
    { challenge_ts: new Date(Date.now() - 301000).toISOString() },
    { challenge_ts: "invalid" },
  ])
    assert.equal(
      await verifyChallenge("token", "secret", "example.com", async () =>
        Response.json({ ...good, ...patch }),
      ),
      false,
    );
  assert.equal(
    await verifyChallenge("token", "secret", "example.com", async () =>
      Response.json(good),
    ),
    true,
  );
  assert.equal(
    await verifyChallenge(
      "token",
      "secret",
      "example.com",
      async () => new Response("", { status: 500 }),
    ),
    false,
  );
  assert.equal(challengeKey("x"), challengeKey("x"));
  assert.notEqual(challengeKey("x"), challengeKey("y"));
});
