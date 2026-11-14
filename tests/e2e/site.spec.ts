import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
test("homepage, mobile navigation, layout and image placeholders", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "In the conversation" }),
  ).toBeVisible();
  await expect(page.locator("main")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.locator(".poster-grid").first().locator("article"),
  ).toHaveCount(6);
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
  }
  await page.screenshot({
    path: `/tmp/cinescope-${info.project.name}.png`,
    fullPage: true,
  });
});
test("trailer closes with Escape, restores focus and removes player", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: /Watch trailer|Play trailer/,
  });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByTitle(/trailer$/)).toBeAttached();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("iframe")).toHaveCount(0);
});
test("URL catalog controls and invalid filters", async ({ page }) => {
  await page.goto("/movies?genre=35&rating=7&sort=vote_average.desc");
  await expect(
    page.getByRole("combobox", { name: "Genre", exact: true }),
  ).toHaveValue("35");
  await expect(
    page.getByRole("combobox", { name: "Minimum score", exact: true }),
  ).toHaveValue("7");
  await expect(page.locator(".poster-card").first()).toBeVisible();
  await expect(page.locator(".poster-card img").first()).toHaveAttribute(
    "loading",
    "eager",
  );
  await page.goto("/movies?page=9999");
  await expect(
    page.getByRole("heading", { name: "Those filters aren’t valid" }),
  ).toBeVisible();
});
test("unified search supports short titles, empty results, errors and back navigation", async ({
  page,
}) => {
  await page.route("**/api/search", async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      json:
        body.query === "missing"
          ? { results: [], total_pages: 0, total_results: 0, page: 1 }
          : {
              results: [
                {
                  id: 14160,
                  title: "Up",
                  media_type: "movie",
                  release_date: "2009-01-01",
                  vote_average: 8,
                  poster_path: null,
                },
              ],
              page: 1,
              total_pages: 1,
              total_results: 1,
            },
    });
  });
  await page.goto("/search");
  await page.getByRole("searchbox").fill("Up");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Up", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=Up/);
  await expect(page.getByAltText("Up: artwork unavailable")).toBeVisible();
  await page.getByRole("searchbox").fill("missing");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matches this time" }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Up", exact: true }),
  ).toBeVisible();
});
test("account configuration absence is graceful and security headers are set", async ({
  page,
}) => {
  const response = await page.goto("/login");
  expect(response?.headers()["content-security-policy"]).toContain(
    "object-src 'none'",
  );
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(
    page.getByRole("heading", { name: "Welcome to CineScope." }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
  await page.goto("/movies/not-an-id");
  await expect(
    page.getByRole("heading", { name: "This story isn’t here." }),
  ).toBeVisible();
});

test("share metadata, app manifest and branded assets are available", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3000",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#101113",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  expect(await manifest.json()).toMatchObject({
    short_name: "CineScope",
    start_url: "/",
    display: "standalone",
    theme_color: "#101113",
  });
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBe(true);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
  const socialImage = await request.get("/opengraph-image");
  expect(socialImage.ok()).toBe(true);
  expect(socialImage.headers()["content-type"]).toContain("image/png");
});

test("catalog title searches cannot bypass unified search protection", async ({
  page,
}) => {
  await page.route("**/api/search", (route) =>
    route.fulfill({
      status: 429,
      headers: { "Retry-After": "60" },
      json: { error: "Please pause a moment before searching again." },
    }),
  );
  await page.goto("/movies?q=Up");
  await expect(page).toHaveURL(/\/search\?q=Up/);
  await expect(
    page.getByText("Please pause a moment before searching again."),
  ).toBeVisible();
});

test("search rejects cross-origin requests and malformed bodies", async ({
  request,
}) => {
  const foreign = await request.post("/api/search", {
    headers: { origin: "https://untrusted.example" },
    data: { query: "Up", page: 1 },
  });
  expect(foreign.status()).toBe(403);
  const malformed = await request.post("/api/search", {
    data: { query: "Up", page: 0 },
  });
  expect(malformed.status()).toBe(400);
  const oversized = await request.post("/api/search", {
    data: { query: "x".repeat(5000), page: 1 },
  });
  expect(oversized.status()).toBe(400);
});

for (const path of ["/", "/movies", "/search", "/login"]) {
  test(`accessible landmarks, labels and contrast: ${path}`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(
      page.getByRole("link", { name: "CineScope home", exact: true }).first(),
    ).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
