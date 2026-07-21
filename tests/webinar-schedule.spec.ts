import webinarConfig from '../src/content/webinar-schedule.json';
import { buildWebinarSchedule } from '../src/lib/webinar-schedule';
import { expect, test } from './fixtures';

const webinarSchedule = buildWebinarSchedule(webinarConfig.startDate, webinarConfig.startTime);

test('renders every webinar date from the canonical schedule', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#hero')).toContainText(`Бесплатный марафон · ${webinarSchedule.dateRange}`);
  await expect(page.locator('#hero [data-fact-text]')).toContainText(webinarSchedule.dateRangeWithTime);

  const programDays = page.locator('#program [data-program-day]');
  for (const [index, day] of webinarSchedule.days.entries()) {
    await expect(programDays.nth(index)).toContainText(day.dateWithTime);
  }

  await expect(page.locator('#registration')).toContainText(`${webinarSchedule.dateRangeWithTime} · Бесплатно`);
  await expect(page.locator('[data-registration-modal]')).toContainText(`${webinarSchedule.dateRangeWithTime} · Бесплатно`);
});
