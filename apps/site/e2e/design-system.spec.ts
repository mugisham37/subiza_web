import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = ["rw", "en"] as const;

test("showcase renders the inventory", async ({ page }) => {
  await page.setViewportSize({ width: 1080, height: 900 });
  await page.goto("/en/design-system");
  await expect(page.getByRole("heading", { name: /the system/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  await expect(page.getByText("On a call now").first()).toBeVisible();
});

test("no-js still paints the system", async ({ page, javaScriptEnabled }) => {
  test.skip(javaScriptEnabled, "covered by the no-js project");
  await page.goto("/en/design-system");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
});

test("reduced motion stops loops", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/design-system");
  const running = await page.evaluate(() => {
    return [...document.getAnimations()].filter((a) => a.playState === "running").length;
  });
  expect(running).toBe(0);
});

for (const locale of locales) {
  test(`360 ${locale} does not overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`/${locale}/design-system`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 360);
    expect(overflow).toBe(false);
  });
}

test("axe on the showcase in light", async ({ page }) => {
  await page.goto("/en/design-system");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("touch targets are at least 48px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/en/design-system");
  const small = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("a, button, input, summary")];
    return nodes
      .map((node) => {
        const box = (node as HTMLElement).getBoundingClientRect();
        return { w: box.width, h: box.height, text: node.textContent?.slice(0, 24) };
      })
      .filter((box) => box.w > 0 && box.h > 0 && (box.w < 48 || box.h < 48));
  });
  expect(small).toEqual([]);
});
