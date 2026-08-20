import type { ReportFrequency } from "../../generated/prisma/enums";

const MS_PER_DAY = 86_400_000;
const REPORT_TIMEZONE = "Europe/Paris";
const DAY_STAMP_HOUR = 12;

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: REPORT_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const FREQUENCY_DAYS: Record<ReportFrequency, number> = {
  DAYS_2: 2,
  DAYS_5: 5,
  DAYS_7: 7,
  DAYS_14: 14,
  DAYS_30: 30,
};

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function calendarDay(date: Date): Date {
  const parts = DAY_FORMATTER.formatToParts(date);
  const part = (type: string) => {
    const found = parts.find((entry) => entry.type === type);
    if (!found) throw new Error(`Missing ${type} in formatted date`);
    return Number(found.value);
  };

  return new Date(
    Date.UTC(part("year"), part("month") - 1, part("day"), DAY_STAMP_HOUR),
  );
}

export function nextReportDate(base: Date, frequency: ReportFrequency): Date {
  return addDays(calendarDay(base), FREQUENCY_DAYS[frequency]);
}
