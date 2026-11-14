import { defineConfig, devices } from "@playwright/test";

const rawBaseUrl = process.env.PERFORMANCE_BASE_URL;

if (!rawBaseUrl) {
  throw new Error(
    "PERFORMANCE_BASE_URL is required, for example https://staging.example.com",
  );
}

const baseUrl = new URL(rawBaseUrl);
const isLoopback = ["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname);

if (baseUrl.protocol !== "https:" && !isLoopback) {
  throw new Error("Performance checks require HTTPS except on loopback hosts");
}

if (baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) {
  throw new Error(
    "PERFORMANCE_BASE_URL must not contain credentials, a query, or a fragment",
  );
}

export default defineConfig({
  testDir: "tests/performance",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: baseUrl.toString(),
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
