import { calculateDaysAlive, type CalculationFailure, type DateInput } from "./age";

export type FunFactsResult =
  | {
      isValid: true;
      birthDate: string;
      referenceDate: string;
      estimatedHeartbeats: number;
      estimatedBreaths: number;
      estimatedSleepHours: number;
      birthWeekday: string;
      assumptions: {
        heartRateBpm: number;
        breathsPerMinute: number;
        sleepHoursPerDay: number;
      };
    }
  | CalculationFailure;

const HEART_RATE_BPM = 70;
const BREATHS_PER_MINUTE = 16;
const SLEEP_HOURS_PER_DAY = 8;
const MINUTES_PER_DAY = 24 * 60;
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function calculateFunFacts(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): FunFactsResult {
  const daysAlive = calculateDaysAlive(birthDateInput, referenceDateInput);

  if (!daysAlive.isValid) {
    return daysAlive;
  }

  return {
    isValid: true,
    birthDate: daysAlive.birthDate,
    referenceDate: daysAlive.referenceDate,
    estimatedHeartbeats: daysAlive.daysAlive * MINUTES_PER_DAY * HEART_RATE_BPM,
    estimatedBreaths:
      daysAlive.daysAlive * MINUTES_PER_DAY * BREATHS_PER_MINUTE,
    estimatedSleepHours: daysAlive.daysAlive * SLEEP_HOURS_PER_DAY,
    birthWeekday: getBirthWeekday(daysAlive.birthDate),
    assumptions: {
      heartRateBpm: HEART_RATE_BPM,
      breathsPerMinute: BREATHS_PER_MINUTE,
      sleepHoursPerDay: SLEEP_HOURS_PER_DAY,
    },
  };
}

function getBirthWeekday(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return WEEKDAYS[weekdayIndex];
}
