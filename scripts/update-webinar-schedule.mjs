import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getTargetWebinarStartDate } from '../src/lib/webinar-schedule.ts';

const schedulePath = process.env.WEBINAR_SCHEDULE_FILE
  ?? fileURLToPath(new URL('../src/content/webinar-schedule.json', import.meta.url));
const now = process.env.WEBINAR_SCHEDULE_NOW ? new Date(process.env.WEBINAR_SCHEDULE_NOW) : new Date();

if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid WEBINAR_SCHEDULE_NOW: ${process.env.WEBINAR_SCHEDULE_NOW}`);
}

const schedule = JSON.parse(await readFile(schedulePath, 'utf8'));
if (typeof schedule.startDate !== 'string' || typeof schedule.startTime !== 'string' || typeof schedule.timeZone !== 'string') {
  throw new Error(`Invalid webinar schedule: ${schedulePath}`);
}

const startDate = getTargetWebinarStartDate(now);
if (schedule.startDate === startDate) {
  console.log(`webinar schedule unchanged: ${startDate}`);
} else {
  await writeFile(schedulePath, `${JSON.stringify({ ...schedule, startDate }, null, 2)}\n`);
  console.log(`webinar schedule updated: ${schedule.startDate} → ${startDate}`);
}
