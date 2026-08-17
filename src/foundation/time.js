import { MONTH_NAMES } from "./constants.js";

export function createCalendar(year, month) {
  const m = ((month - 1) % 12) + 1;
  return { year: Math.floor(year), month: m };
}

export function formatMonthYear(calendar) {
  const name = MONTH_NAMES[calendar.month - 1] ?? "???";
  return name + " " + calendar.year;
}

export function computeAge(birth, calendar) {
  let years = calendar.year - birth.year;
  if (calendar.month < birth.month) years -= 1;
  return Math.max(0, years);
}

export function advanceMonth(calendar) {
  let { year, month } = calendar;
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  return { year, month };
}

export function monthsBetween(from, to) {
  return (to.year - from.year) * 12 + (to.month - from.month);
}
