import { expect, test } from '@playwright/test';

test.describe('visual refinements — hero, facts, sticky CTA', () => {
  test('hero renders two successfully loaded local raster images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // Two local raster images: background + illustration
    const images = hero.locator('img[src^="/"]');
    await expect(images).toHaveCount(2);

    // Both images must report naturalWidth > 0 (successfully decoded)
    for (const img of await images.all()) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('event-fact text computes to >=15px and icon circle computes to >=40px', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fact items must expose narrow data markers (contract requirement)
    const factItems = page.locator('[data-fact-item]');
    await expect(factItems).toHaveCount(3);

    // Check computed font size on text (>=15px) and icon circle diameter (>=40px)
    for (const item of await factItems.all()) {
      const text = item.locator('[data-fact-text]');
      const icon = item.locator('[data-fact-icon]');

      await expect(text).toBeVisible();
      await expect(icon).toBeVisible();

      const textSize = await text.evaluate((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        return fs;
      });
      expect(textSize).toBeGreaterThanOrEqual(15);

      const iconSize = await icon.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      });
      expect(iconSize).toBeGreaterThanOrEqual(40);
    }
  });

  test('sticky CTA is hidden while hero intersects viewport and becomes visible after scrolling #hook into view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cta = page.locator('[data-sticky-cta]');
    const hero = page.locator('#hero');

    // Initial state: hero in view → CTA must be hidden
    await expect(hero).toBeInViewport();
    await expect(cta).toHaveAttribute('data-hidden', 'true');
    await expect(cta).toHaveCSS('visibility', 'hidden');

    // Deterministic scroll past hero (disable smooth behavior to avoid fractional edge intersection)
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const heroEl = document.querySelector('#hero') as HTMLElement;
      if (heroEl) {
        window.scrollTo(0, heroEl.offsetHeight + 2);
      }
    });
    await expect(hero).not.toBeInViewport();

    // Now CTA must be visible
    await expect(cta).toHaveAttribute('data-hidden', 'false');
    await expect(cta).toBeVisible();
  });

  test('sticky CTA becomes hidden after scrolling data-sticky-stop into view and does not obscure consent/footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const stop = page.locator('[data-sticky-stop]');
    await expect(stop).toBeVisible();

    // Scroll the consent line into view; wait for sticky state via attribute
    await stop.scrollIntoViewIfNeeded();
    const cta = page.locator('[data-sticky-cta]');
    await expect(cta).toHaveAttribute('data-hidden', 'true');

    // Observable non-obstruction: CTA is visually absent and non-interactive
    // while consent/footer line remains visible
    await expect(cta).toHaveCSS('visibility', 'hidden');
    await expect(cta).toHaveCSS('pointer-events', 'none');

    const footer = page.locator('#footer');
    await expect(footer).toBeVisible();
  });
  test('disables sticky CTA transitions under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cta = page.locator('[data-sticky-cta]');
    await expect(cta).toBeAttached();

    const transitionProperty = await cta.evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(transitionProperty).toBe('none');
  });
});
