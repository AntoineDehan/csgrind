import type { ReportFrequency } from "../../generated/prisma/enums";

const MS_PER_DAY = 86_400_000;

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
