"use client";

import { useMemo, useState } from "react";
import {
  calculateAge,
  calculateDaysAlive,
  calculateHoursAlive,
  calculateMonthsAlive,
  calculateWeeksAlive,
} from "@/lib/age";

type AgeSnapshot =
  | {
      isValid: true;
      years: number;
      months: number;
      days: number;
      totalDays: number;
      totalWeeks: number;
      totalMonths: number;
      totalHours: number;
    }
  | {
      isValid: false;
      message: string;
    };

type ResultMetric = {
  label: string;
  value: string;
};

const emptyMetrics: ResultMetric[] = [
  { label: "Years", value: "-" },
  { label: "Months", value: "-" },
  { label: "Days", value: "-" },
  { label: "Total days", value: "-" },
  { label: "Total weeks", value: "-" },
  { label: "Total months", value: "-" },
  { label: "Total hours", value: "-" },
];

function getTodayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function getAgeSnapshot(birthDate: string): AgeSnapshot | null {
  if (!birthDate) {
    return null;
  }

  const age = calculateAge(birthDate);
  const daysAlive = calculateDaysAlive(birthDate);
  const weeksAlive = calculateWeeksAlive(birthDate);
  const monthsAlive = calculateMonthsAlive(birthDate);
  const hoursAlive = calculateHoursAlive(birthDate);

  if (!age.isValid) {
    return {
      isValid: false,
      message: age.message,
    };
  }

  if (
    !daysAlive.isValid ||
    !weeksAlive.isValid ||
    !monthsAlive.isValid ||
    !hoursAlive.isValid
  ) {
    return {
      isValid: false,
      message: "Unable to calculate age from the selected date.",
    };
  }

  return {
    isValid: true,
    years: age.years,
    months: age.months,
    days: age.days,
    totalDays: daysAlive.daysAlive,
    totalWeeks: weeksAlive.weeksAlive,
    totalMonths: monthsAlive.monthsAlive,
    totalHours: hoursAlive.hoursAlive,
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getResultMetrics(snapshot: AgeSnapshot | null): ResultMetric[] {
  if (!snapshot || !snapshot.isValid) {
    return emptyMetrics;
  }

  return [
    { label: "Years", value: formatNumber(snapshot.years) },
    { label: "Months", value: formatNumber(snapshot.months) },
    { label: "Days", value: formatNumber(snapshot.days) },
    { label: "Total days", value: formatNumber(snapshot.totalDays) },
    { label: "Total weeks", value: formatNumber(snapshot.totalWeeks) },
    { label: "Total months", value: formatNumber(snapshot.totalMonths) },
    { label: "Total hours", value: formatNumber(snapshot.totalHours) },
  ];
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const today = useMemo(() => getTodayDateInputValue(), []);
  const ageSnapshot = useMemo(() => getAgeSnapshot(birthDate), [birthDate]);
  const resultMetrics = useMemo(
    () => getResultMetrics(ageSnapshot),
    [ageSnapshot],
  );

  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-8 lg:px-10">
      <section
        aria-labelledby="homepage-heading"
        className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl content-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
      >
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-glow">
            LifeSpan
          </p>
          <h1
            className="max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl"
            id="homepage-heading"
          >
            Know Your Time
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            Every second is a stat. Make it count.
          </p>

          <form
            aria-label="Birth date calculation form"
            className="mt-9 max-w-xl rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-glow backdrop-blur sm:flex sm:items-end sm:gap-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block flex-1">
              <span className="mb-2 block text-sm font-medium text-white/72">
                Date of birth
              </span>
              <input
                aria-describedby="birth-date-error"
                aria-label="Date of birth"
                className="h-12 w-full rounded-md border border-white/12 bg-midnight-soft px-4 text-base text-white outline-none transition placeholder:text-white/36 focus:border-emerald-bright focus:ring-2 focus:ring-emerald-bright/25"
                max={today}
                name="birthDate"
                onChange={(event) => setBirthDate(event.target.value)}
                type="date"
                value={birthDate}
              />
            </label>
            <button
              className="mt-3 h-12 w-full rounded-md bg-emerald-bright px-5 text-sm font-semibold text-[#04111f] transition hover:bg-emerald-glow focus:outline-none focus:ring-2 focus:ring-emerald-glow focus:ring-offset-2 focus:ring-offset-midnight sm:mt-0 sm:w-auto"
              type="submit"
            >
              Calculate
            </button>
          </form>

          {ageSnapshot && !ageSnapshot.isValid ? (
            <p className="mt-3 text-sm leading-6 text-emerald-glow" id="birth-date-error">
              {ageSnapshot.message}
            </p>
          ) : null}
        </div>

        <section
          aria-labelledby="results-heading"
          className="grid gap-3 sm:grid-cols-2 lg:gap-4"
        >
          <h2 className="sr-only" id="results-heading">
            Age calculation results
          </h2>
          {resultMetrics.map((metric) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur"
              key={metric.label}
            >
              <p className="text-sm font-medium text-white/60">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-normal text-white">
                {metric.value}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
