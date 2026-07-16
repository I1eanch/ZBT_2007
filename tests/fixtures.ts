import { expect, test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://mc.yandex.ru/**', async (route) => {
      await route.abort();
    });
    await use(page);
  },
});

export { expect, test };
