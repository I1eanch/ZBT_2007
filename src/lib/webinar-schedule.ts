export interface WebinarSchedule {
  readonly startDate: string;
  readonly dateRange: string;
  readonly dateRangeWithTime: string;
  readonly days: readonly WebinarDay[];
}

export interface WebinarDay {
  readonly date: string;
  readonly dateWithTime: string;
}

interface MoscowDateTime {
  readonly date: string;
  readonly weekday: string;
  readonly hour: number;
}

const moscowTimeZone = 'Europe/Moscow';
const cutoverHour = 16;
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const russianMonths = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

const moscowFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: moscowTimeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
  hour: '2-digit',
  hourCycle: 'h23',
});

function parseIsoDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  return date;
}


function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getMoscowDateTime(now: Date): MoscowDateTime {
  const values = Object.fromEntries(
    moscowFormatter.formatToParts(now)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    weekday: values.weekday,
    hour: Number(values.hour),
  };
}

function formatDate(date: Date): string {
  return `${date.getUTCDate()} ${russianMonths[date.getUTCMonth()]}`;
}

function formatDateRange(firstDay: Date, lastDay: Date): string {
  if (firstDay.getUTCMonth() === lastDay.getUTCMonth()) {
    return `${firstDay.getUTCDate()}–${lastDay.getUTCDate()} ${russianMonths[firstDay.getUTCMonth()]}`;
  }

  return `${formatDate(firstDay)} – ${formatDate(lastDay)}`;
}

export function getTargetWebinarStartDate(now = new Date()): string {
  if (Number.isNaN(now.getTime())) {
    throw new Error('Invalid current time');
  }

  const moscow = getMoscowDateTime(now);
  const currentDate = parseIsoDate(moscow.date);
  const weekdayIndex = weekdays.indexOf(moscow.weekday as (typeof weekdays)[number]);

  if (weekdayIndex < 0) {
    throw new Error(`Unknown Moscow weekday: ${moscow.weekday}`);
  }

  if (moscow.weekday === 'Mon' && moscow.hour < cutoverHour) {
    return moscow.date;
  }

  const daysUntilNextMonday = 7 - weekdayIndex;
  return addDays(currentDate, daysUntilNextMonday).toISOString().slice(0, 10);
}

export function buildWebinarSchedule(startDate: string, startTime: string): WebinarSchedule {
  const firstDay = parseIsoDate(startDate);
  const days = [firstDay, addDays(firstDay, 1), addDays(firstDay, 2)];
  const dateRange = formatDateRange(firstDay, days[2]);

  return {
    startDate,
    dateRange,
    dateRangeWithTime: `${dateRange} · ${startTime} МСК`,
    days: days.map((date) => {
      const formattedDate = formatDate(date);
      return {
        date: formattedDate,
        dateWithTime: `${formattedDate}, ${startTime} МСК`,
      };
    }),
  };
}
