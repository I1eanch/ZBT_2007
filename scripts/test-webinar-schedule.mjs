import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildWebinarSchedule, getTargetWebinarStartDate } from '../src/lib/webinar-schedule.ts';

const at = (value) => new Date(value);

assert.equal(getTargetWebinarStartDate(at('2026-07-20T12:59:59.000Z')), '2026-07-20');
assert.equal(getTargetWebinarStartDate(at('2026-07-20T13:00:00.000Z')), '2026-07-27');
assert.equal(getTargetWebinarStartDate(at('2026-07-21T12:00:00.000Z')), '2026-07-27');
assert.equal(getTargetWebinarStartDate(at('2026-07-26T12:00:00.000Z')), '2026-07-27');
assert.equal(getTargetWebinarStartDate(at('2026-12-28T13:00:00.000Z')), '2027-01-04');

assert.deepEqual(buildWebinarSchedule('2026-07-27', '18:00'), {
  startDate: '2026-07-27',
  dateRange: '27–29 июля',
  dateRangeWithTime: '27–29 июля · 18:00 МСК',
  days: [
    { date: '27 июля', dateWithTime: '27 июля, 18:00 МСК' },
    { date: '28 июля', dateWithTime: '28 июля, 18:00 МСК' },
    { date: '29 июля', dateWithTime: '29 июля, 18:00 МСК' },
  ],
});
assert.equal(buildWebinarSchedule('2026-06-30', '18:00').dateRange, '30 июня – 2 июля');
assert.equal(buildWebinarSchedule('2026-12-30', '18:00').dateRange, '30 декабря – 1 января');

const temporaryDirectory = await mkdtemp(join(tmpdir(), 'webinar-schedule-'));
const temporarySchedulePath = join(temporaryDirectory, 'webinar-schedule.json');
await writeFile(temporarySchedulePath, '{\n  "startDate": "2026-07-20",\n  "startTime": "18:00",\n  "timeZone": "Europe/Moscow"\n}\n');

try {
  const environment = {
    ...process.env,
    WEBINAR_SCHEDULE_FILE: temporarySchedulePath,
    WEBINAR_SCHEDULE_NOW: '2026-07-21T12:00:00.000Z',
  };

  const firstRun = execFileSync(process.execPath, ['--experimental-strip-types', 'scripts/update-webinar-schedule.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: environment,
  });
  assert.match(firstRun, /updated: 2026-07-20 → 2026-07-27/);
  assert.equal(JSON.parse(await readFile(temporarySchedulePath, 'utf8')).startDate, '2026-07-27');

  const secondRun = execFileSync(process.execPath, ['--experimental-strip-types', 'scripts/update-webinar-schedule.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: environment,
  });
  assert.match(secondRun, /unchanged: 2026-07-27/);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log('webinar schedule tests passed');
