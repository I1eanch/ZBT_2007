import { expect, test } from './fixtures';

test('serves a Russian HTML document without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  expect(response?.status()).toBe(200);
  expect(errors).toEqual([]);
});
