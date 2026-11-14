import { expect, test } from "@playwright/test";

test("signed-in library data is private when users switch", async ({
  page,
}, info) => {
  const suffix = info.project.name.replace(/[^a-z]/g, "");
  const firstEmail = `first-${suffix}@cinescope.test`;
  const secondEmail = `second-${suffix}@cinescope.test`;
  const password = "Emulator-only-password-42";

  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Email").fill(firstEmail);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    page.getByRole("heading", { name: "Your library" }),
  ).toBeVisible();

  await page.goto("/");
  const featuredTitle = (await page.locator(".hero h1").textContent())?.trim();
  expect(featuredTitle).toBeTruthy();
  const watchlist = page
    .locator(".hero-actions")
    .getByRole("button", { name: "Watchlist" });
  await expect(watchlist).toBeEnabled();
  await watchlist.click();
  await expect(
    page.locator('.hero-actions button[aria-pressed="true"]'),
  ).toHaveText(/Saved/);

  await page.goto("/account");
  await expect(
    page.getByRole("heading", { name: featuredTitle!, exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("link", { name: "Sign in" }).first(),
  ).toBeVisible();
  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Email").fill(secondEmail);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    page.getByRole("heading", {
      name: "A new collection starts with one story",
    }),
  ).toBeVisible();
  await expect(page.getByText(featuredTitle!, { exact: true })).toHaveCount(0);
});
