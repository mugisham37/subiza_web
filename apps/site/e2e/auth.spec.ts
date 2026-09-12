import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("start and signin render the same phone door", async ({ page }) => {
  await page.goto("/en/start");
  await expect(page.getByRole("heading", { name: /phone number/i })).toBeVisible();
  await expect(page.getByText("1 / 5")).toHaveCount(0);
  await page.goto("/en/signin");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.locator("input[name=phone]")).toBeVisible();
});

test("known and unknown numbers both reach the code screen", async ({ page }) => {
  await page.goto("/en/start");
  await page.locator("input[name=phone]").fill("788 000 111");
  await page.getByRole("button", { name: /send me a code/i }).click();
  await expect(page.getByRole("heading", { name: /enter the code/i })).toBeVisible();
  await expect(page.getByText(/salon/i)).toHaveCount(0);

  await page.goto("/en/start");
  await page.locator("input[name=phone]").fill("788 123 456");
  await page.getByRole("button", { name: /send me a code/i }).click();
  await expect(page.getByRole("heading", { name: /enter the code/i })).toBeVisible();
  await expect(page.getByText(/salon/i)).toHaveCount(0);
});

test("foreign numbers are refused before a code is sent", async ({ page }) => {
  await page.goto("/en/start");
  await page.locator("input[name=phone]").fill("202 555 0100");
  await page.getByRole("button", { name: /send me a code/i }).click();
  await expect(page.getByText(/rwandan/i)).toBeVisible();
});

test("chooser does not name a business before a verified code", async ({ page }) => {
  await page.goto("/en/start");
  await page.locator("input[name=phone]").fill("788 000 111");
  await page.getByRole("button", { name: /send me a code/i }).click();
  await expect(page.getByRole("heading", { name: /enter the code/i })).toBeVisible();
  await page.goto("/en/start/choose");
  await expect(page.getByText(/salon|ubwiza|clinic/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /phone number|enter the code/i })).toBeVisible();
});

test("recovery hub is reachable without signing in", async ({ page }) => {
  await page.goto("/en/recover");
  await expect(page.getByRole("heading", { name: /can't get a code/i })).toBeVisible();
  await page.getByRole("link", { name: /this wasn't me/i }).click();
  await expect(page.getByRole("heading", { name: /person handles/i })).toBeVisible();
});

test("auth screens have a single h1 and no axe violations", async ({ page }) => {
  for (const path of ["/en/start", "/en/signin", "/en/recover"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("kinyarwanda auth fits 360", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/rw/start");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});

test("no-js still posts the phone field", async ({ page, javaScriptEnabled }) => {
  test.skip(javaScriptEnabled, "covered by the no-js project");
  await page.goto("/en/start");
  await expect(page.locator("input[name=phone]")).toBeVisible();
  await expect(page.locator("input[name=code]")).toHaveCount(0);
  await page.locator("input[name=phone]").fill("788 123 456");
  await page.getByRole("button", { name: /send me a code/i }).click();
  await expect(page.locator("input[name=code]")).toBeVisible();
});
