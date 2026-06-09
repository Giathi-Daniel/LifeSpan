export type DateInput = Date | string;

export type AgeValidationError = "INVALID_DATE" | "FUTURE_DATE";

export type CalculationSuccess<T extends Record<string, number>> = {
  isValid: true;
  birthDate: string;
  referenceDate: string;
} & T;

export type CalculationFailure = {
  isValid: false;
  error: AgeValidationError;
  message: string;
};

export type AgeResult =
  | CalculationSuccess<{
      years: number;
      months: number;
      days: number;
      totalMonths: number;
    }>
  | CalculationFailure;

export type DaysAliveResult =
  | CalculationSuccess<{
      daysAlive: number;
    }>
  | CalculationFailure;

export type WeeksAliveResult =
  | CalculationSuccess<{
      weeksAlive: number;
      remainingDays: number;
    }>
  | CalculationFailure;

export type MonthsAliveResult =
  | CalculationSuccess<{
      monthsAlive: number;
      remainingDays: number;
    }>
  | CalculationFailure;

export type HoursAliveResult =
  | CalculationSuccess<{
      hoursAlive: number;
    }>
  | CalculationFailure;

type NormalizedDate = {
  year: number;
  month: number;
  day: number;
  time: number;
  isoDate: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function calculateAge(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): AgeResult {
  const validation = validateDateInputs(birthDateInput, referenceDateInput);

  if (!validation.isValid) {
    return validation;
  }

  const { birthDate, referenceDate } = validation;
  let years = referenceDate.year - birthDate.year;
  let months = referenceDate.month - birthDate.month;
  let days = referenceDate.day - birthDate.day;

  if (days < 0) {
    months -= 1;
    days += getDaysInMonth(referenceDate.year, referenceDate.month - 1);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    isValid: true,
    birthDate: birthDate.isoDate,
    referenceDate: referenceDate.isoDate,
    years,
    months,
    days,
    totalMonths: years * 12 + months,
  };
}

export function calculateDaysAlive(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): DaysAliveResult {
  const validation = validateDateInputs(birthDateInput, referenceDateInput);

  if (!validation.isValid) {
    return validation;
  }

  const { birthDate, referenceDate } = validation;

  return {
    isValid: true,
    birthDate: birthDate.isoDate,
    referenceDate: referenceDate.isoDate,
    daysAlive: getElapsedDays(birthDate, referenceDate),
  };
}

export function calculateWeeksAlive(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): WeeksAliveResult {
  const daysResult = calculateDaysAlive(birthDateInput, referenceDateInput);

  if (!daysResult.isValid) {
    return daysResult;
  }

  return {
    isValid: true,
    birthDate: daysResult.birthDate,
    referenceDate: daysResult.referenceDate,
    weeksAlive: Math.floor(daysResult.daysAlive / 7),
    remainingDays: daysResult.daysAlive % 7,
  };
}

export function calculateMonthsAlive(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): MonthsAliveResult {
  const validation = validateDateInputs(birthDateInput, referenceDateInput);

  if (!validation.isValid) {
    return validation;
  }

  const { birthDate, referenceDate } = validation;
  let monthsAlive =
    (referenceDate.year - birthDate.year) * 12 +
    (referenceDate.month - birthDate.month);
  let remainingDays = referenceDate.day - birthDate.day;

  if (remainingDays < 0) {
    monthsAlive -= 1;
    remainingDays += getDaysInMonth(referenceDate.year, referenceDate.month - 1);
  }

  return {
    isValid: true,
    birthDate: birthDate.isoDate,
    referenceDate: referenceDate.isoDate,
    monthsAlive,
    remainingDays,
  };
}

export function calculateHoursAlive(
  birthDateInput: DateInput,
  referenceDateInput: DateInput = new Date(),
): HoursAliveResult {
  const daysResult = calculateDaysAlive(birthDateInput, referenceDateInput);

  if (!daysResult.isValid) {
    return daysResult;
  }

  return {
    isValid: true,
    birthDate: daysResult.birthDate,
    referenceDate: daysResult.referenceDate,
    hoursAlive: daysResult.daysAlive * 24,
  };
}

function validateDateInputs(
  birthDateInput: DateInput,
  referenceDateInput: DateInput,
):
  | {
      isValid: true;
      birthDate: NormalizedDate;
      referenceDate: NormalizedDate;
    }
  | CalculationFailure {
  const birthDate = normalizeDateInput(birthDateInput);
  const referenceDate = normalizeDateInput(referenceDateInput);

  if (!birthDate || !referenceDate) {
    return {
      isValid: false,
      error: "INVALID_DATE",
      message: "A valid date is required.",
    };
  }

  if (birthDate.time > referenceDate.time) {
    return {
      isValid: false,
      error: "FUTURE_DATE",
      message: "Birth date cannot be in the future.",
    };
  }

  return {
    isValid: true,
    birthDate,
    referenceDate,
  };
}

function normalizeDateInput(input: DateInput): NormalizedDate | null {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      return null;
    }

    return createNormalizedDate(
      input.getUTCFullYear(),
      input.getUTCMonth() + 1,
      input.getUTCDate(),
    );
  }

  const trimmedInput = input.trim();
  const match = ISO_DATE_PATTERN.exec(trimmedInput);

  if (match) {
    return createNormalizedDate(
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
    );
  }

  const parsedDate = new Date(trimmedInput);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return createNormalizedDate(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth() + 1,
    parsedDate.getUTCDate(),
  );
}

function createNormalizedDate(
  year: number,
  month: number,
  day: number,
): NormalizedDate | null {
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  const isValidCalendarDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidCalendarDate) {
    return null;
  }

  return {
    year,
    month,
    day,
    time,
    isoDate: formatIsoDate(year, month, day),
  };
}

function getElapsedDays(
  birthDate: NormalizedDate,
  referenceDate: NormalizedDate,
): number {
  return Math.floor((referenceDate.time - birthDate.time) / MS_PER_DAY);
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
