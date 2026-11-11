import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rateLimitScript } from "../../src/lib/requestProtection.ts";
const exec = promisify(execFile);
test("real Redis: simultaneous clients share limits, blocked requests do not partially count, and keys expire", async () => {
  const dir = await mkdtemp(join(tmpdir(), "cinescope-limits-"));
  const port = "16379";
  const server = spawn(
    process.env.REDIS_SERVER_BIN || "redis-server",
    [
      "--port",
      port,
      "--bind",
      "127.0.0.1",
      "--save",
      "",
      "--appendonly",
      "no",
      "--dir",
      dir,
    ],
    { stdio: "ignore" },
  );
  let startError;
  server.on("error", (e) => {
    startError = e;
  });
  const cli = (...args) =>
    exec(process.env.REDIS_CLI_BIN || "redis-cli", ["-p", port, ...args]).then(
      (r) => r.stdout.trim(),
    );
  try {
    let ready = false;
    for (let n = 0; n < 50; n++) {
      if (startError) throw startError;
      try {
        if ((await cli("PING")) === "PONG") {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    assert.ok(ready, "Redis must start");
    const script = join(dir, "limit.lua");
    await writeFile(script, rateLimitScript);
    const run = (key, max, ttl) =>
      cli("--eval", script, key, ",", String(max), String(ttl));
    const results = await Promise.all(
      Array.from({ length: 50 }, () => run("{test}:concurrent", 10, 10000)),
    );
    assert.equal(results.filter((x) => x === "0").length, 10);
    assert.equal(await cli("GET", "{test}:concurrent"), "10");
    await run("{test}:hour", 1, 10000);
    assert.ok(
      Number(
        await cli(
          "--eval",
          script,
          "{test}:minute",
          "{test}:hour",
          ",",
          "1",
          "1000",
          "1",
          "10000",
        ),
      ) > 0,
    );
    assert.equal(await cli("EXISTS", "{test}:minute"), "0");
    await run("{test}:expiry", 1, 100);
    assert.ok(Number(await run("{test}:expiry", 1, 100)) > 0);
    await new Promise((r) => setTimeout(r, 130));
    assert.equal(await run("{test}:expiry", 1, 100), "0");
  } finally {
    server.kill("SIGTERM");
    await new Promise((resolve) => {
      if (server.exitCode !== null) resolve();
      else server.once("exit", resolve);
    });
    await rm(dir, { recursive: true, force: true });
  }
});
