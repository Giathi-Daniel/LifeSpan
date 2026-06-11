import { calculateDaysAlive, type CalculationFailure, type DateInput } from "./age";

export type MilestoneAge = 18 | 21 | 25 | 30 | 40 | 50 | 60 | 70;

export type MilestoneStatus = "Passed" | "Upcoming" | "Future";

export type Milestone = {
  age: MilestoneAge;
  dateReached: string;
  status: MilestoneStatus;
};

export type MilestoneTimelineResult =
  | {
      isValid: true;
      birthDate: string;
      referenceDate: string;
      milestones: Milestone[];
    }
  | CalculationFailure;

const milestoneAges: MilestoneAge[] = [18, 21, 25, 30, 40, 50, 60, 70];

export function calculateMilestones(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): MilestoneTimelineResult {
  const daysAlive = calculateDaysAlive(birthDateInput, referenceDateInput);

  if (!daysAlive.isValid) {
    return daysAlive;
  }

  const birthDate = parseIsoDate(daysAlive.birthDate);
  const referenceDate = parseIsoDate(daysAlive.referenceDate);
  const reachedDates = milestoneAges.map((age) => ({
    age,
    date: addYearsClamped(birthDate, age),
  }));
  const upcomingIndex = reachedDates.findIndex(
    (milestone) => milestone.date.time > referenceDate.time,
  );

  return {
    isValid: true,
    birthDate: daysAlive.birthDate,
    referenceDate: daysAlive.referenceDate,
    milestones: reachedDates.map((milestone, index) => ({
      age: milestone.age,
      dateReached: milestone.date.isoDate,
      status: getMilestoneStatus(
        milestone.date.time,
        referenceDate.time,
        index,
        upcomingIndex,
      ),
    })),
  };
}

function getMilestoneStatus(
  milestoneTime: number,
  referenceTime: number,
  index: number,
  upcomingIndex: number,
): MilestoneStatus {
  if (milestoneTime <= referenceTime) {
    return "Passed";
  }

  if (index === upcomingIndex) {
    return "Upcoming";
  }

  return "Future";
}

function addYearsClamped(
  date: { year: number; month: number; day: number },
  years: number,
): { time: number; isoDate: string } {
  const targetYear = date.year + years;
  const targetDay = Math.min(date.day, getDaysInMonth(targetYear, date.month));
  const time = Date.UTC(targetYear, date.month - 1, targetDay);

  return {
    time,
    isoDate: formatIsoDate(targetYear, date.month, targetDay),
  };
}

function parseIsoDate(isoDate: string): {
  year: number;
  month: number;
  day: number;
  time: number;
} {
  const [year, month, day] = isoDate.split("-").map(Number);

  return {
    year,
    month,
    day,
    time: Date.UTC(year, month - 1, day),
  };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatIsoDate(year: number, month: number, day: number): string {
  return [
    year.toString().padStart(4, "0"),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}
