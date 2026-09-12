import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = ["rw", "en"] as const;
const routes = [
  "",
  "/how",
  "/pricing",
  "/security",
  "/about",
  "/contact",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/legal/dpa",
  "/legal/voice-consent",
  "/data-request",
];

for (const locale of locales) {
  for (const route of routes) {
    test(`renders ${locale}${route || "/"}`, async ({ page }) => {
      const response = await page.goto(`/${locale}${route}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
}

test("fr and sw are closed", async ({ page }) => {
  expect((await page.goto("/fr"))?.status()).toBe(404);
  expect((await page.goto("/sw"))?.status()).toBe(404);
});

test("mistyped url is a real 404", async ({ page }) => {
  const response = await page.goto("/en/this-page-is-not-real");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/cannot find/i)).toBeVisible();
});

test("pricing always carries the pilot banner", async ({ page }) => {
  await page.goto("/en/pricing");
  await expect(page.getByText(/pilot prices/i)).toBeVisible();
});

test("legal documents resolve", async ({ page }) => {
  for (const href of ["/en/legal/terms", "/en/legal/privacy", "/en/legal/dpa", "/en/legal/voice-consent"]) {
    expect((await page.goto(href))?.status()).toBe(200);
  }
});

test("no-js home still has the tel path and nav", async ({ page, javaScriptEnabled }) => {
  test.skip(javaScriptEnabled, "covered by the no-js project");
  await page.goto("/en");
  await expect(page.getByRole("link", { name: /0788 782 492/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.getByRole("link", { name: "How it works" }).first().click();
  await expect(page.locator("h1")).toBeVisible();
});

test("demo third call is refused", async ({ page }) => {
  for (let i = 0; i < 3; i += 1) {
    await page.goto("/en");
    await page.locator("#we-call-you input[name=phone]").fill("788123456");
    await page.locator("#we-call-you button[type=submit]").click();
  }
  await expect(page.getByText(/two demos today|already had/i)).toBeVisible();
});

test("axe on home light", async ({ page }) => {
  await page.goto("/en");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("rw at 360 does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/rw");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 360);
  expect(overflow).toBe(false);
});
