import { expect, test } from './fixtures';

test('renders production metadata and one motion bootstrap', async ({ page }) => {
  const motionModuleLoads: string[] = [];
  page.on('request', (request) => {
    if (/\/lib\/motion(\.\w+)?(\?|$)/.test(request.url())) {
      motionModuleLoads.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page).toHaveTitle(/Здоровье без таблеток/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /нутрициолог/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);

  // Social sharing preview: raster OG image with declared dimensions + Twitter card.
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og-image\.png$/);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/og-image\.png$/);

  // Layout is the single owner of motion. Astro externalises its framework-processed <script>,
  // so we assert the bundled bootstrap's observable effect — loading src/lib/motion exactly once —
  // rather than a marker attribute, which would force Astro `is:inline` and break bundling.
  await page.waitForLoadState('networkidle');
  expect(motionModuleLoads).toHaveLength(1);
});


test('initializes Yandex Metrika with requested counter options', async ({ page }) => {
  const metrikaRequests: string[] = [];
  await page.route('https://mc.yandex.ru/**', async (route) => {
    metrikaRequests.push(route.request().url());
    await route.abort();
  });

  await page.goto('/');
  const initCall = await page.evaluate(() => {
    const queue = (window as typeof window & { ym?: { a?: ArrayLike<unknown>[] } }).ym?.a;
    const [counterId, action, options] = Array.from(queue?.[0] ?? []);
    return {
      counterId,
      action,
      options,
      currentReferrer: document.referrer,
      currentUrl: location.href,
    };
  });

  expect(metrikaRequests).toContain('https://mc.yandex.ru/metrika/tag.js');
  expect(initCall.counterId).toBe(96074267);
  expect(initCall.action).toBe('init');
  expect(initCall.options).toEqual({
    webvisor: true,
    clickmap: true,
    referrer: initCall.currentReferrer,
    url: initCall.currentUrl,
    accurateTrackBounce: true,
    trackLinks: true,
  });
});

test('renders Yandex Metrika noscript fallback first in body', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route('https://mc.yandex.ru/**', async (route) => {
    await route.abort();
  });
  const page = await context.newPage();

  await page.goto(baseURL!);
  const fallback = page.locator('body > noscript:first-child img');
  await expect(fallback).toHaveAttribute('src', 'https://mc.yandex.ru/watch/96074267');
  await expect(fallback).toHaveAttribute('alt', '');

  await context.close();
});
