import { spawn } from "node:child_process";
import { connect } from "node:net";

const children = new Set();
let stopping = false;

function start(command, args, env = process.env) {
  const child = spawn(command, args, {
    detached: true,
    env,
    stdio: "inherit",
  });
  children.add(child);
  return child;
}

function waitForExit(child) {
  return new Promise((resolve) => {
    child.once("exit", (code, signal) => {
      children.delete(child);
      resolve(code ?? (signal ? 1 : 0));
    });
  });
}

function waitForPort(port, timeoutMs = 60_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = connect({ host: "127.0.0.1", port });
      socket.once("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - started >= timeoutMs)
          reject(new Error(`Timed out waiting for loopback port ${port}.`));
        else setTimeout(check, 200);
      });
    };
    check();
  });
}

async function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch (error) {
      if (!(
        error instanceof Error &&
        "code" in error &&
        error.code === "ESRCH"
      ))
        throw error;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 750));
  process.exit(code);
}

process.once("SIGINT", () => void shutdown(130));
process.once("SIGTERM", () => void shutdown(143));

try {
  start("pnpm", [
    "exec",
    "firebase",
    "emulators:start",
    "--only",
    "auth,firestore",
    "--project",
    "demo-cinescope",
  ]);
  await Promise.all([waitForPort(9099), waitForPort(8085)]);

  const applicationEnvironment = {
    ...process.env,
    NEXT_PUBLIC_FIREBASE_API_KEY: "demo-api-key",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-cinescope.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-cinescope",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:demo",
    NEXT_PUBLIC_FIREBASE_EMULATORS: "1",
    SITE_URL: "http://127.0.0.1:3002",
    BROWSE_RATE_LIMIT_PER_MINUTE: "300",
    BROWSE_RATE_LIMIT_PER_HOUR: "3000",
  };
  start(
    "pnpm",
    ["dev", "--hostname", "127.0.0.1", "--port", "3002"],
    applicationEnvironment,
  );
  await waitForPort(3002);

  const tests = start("pnpm", [
    "exec",
    "playwright",
    "test",
    "--config",
    "playwright.auth.config.ts",
  ]);
  await shutdown(await waitForExit(tests));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  await shutdown(1);
}
