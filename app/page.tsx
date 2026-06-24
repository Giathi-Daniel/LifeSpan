"use client";

import { useMemo, useState } from "react";
import {
  calculateAge,
  calculateDaysAlive,
  calculateHoursAlive,
  calculateMonthsAlive,
  calculateWeeksAlive,
} from "@/lib/age";
import { BirthdayCountdown } from "@/components/birthday-countdown";
import { LifeProgress } from "@/components/life-progress";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { Nav } from "@/components/nav";
import { ShareActions } from "@/components/share-actions";
import { StatCard } from "@/components/stat-card";

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

type ResultMetric = { label: string; value: string };

const benchmarkLifespanYears = 80;
const averageDaysPerYear = 365.2425;

const emptyMetrics: ResultMetric[] = [
  { label: "Years", value: "-" },
  { label: "Months", value: "-" },
  { label: "Days", value: "-" },
  { label: "Total Days", value: "-" },
  { label: "Total Weeks", value: "-" },
  { label: "Total Months", value: "-" },
  { label: "Total Hours", value: "-" },
];

function getTodayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function getAgeSnapshot(birthDate: string): AgeSnapshot | null {
  if (!birthDate) return null;

  const age = calculateAge(birthDate);
  const daysAlive = calculateDaysAlive(birthDate);
  const weeksAlive = calculateWeeksAlive(birthDate);
  const monthsAlive = calculateMonthsAlive(birthDate);
  const hoursAlive = calculateHoursAlive(birthDate);

  if (!age.isValid) return { isValid: false, message: age.message };

  if (
    !daysAlive.isValid ||
    !weeksAlive.isValid ||
    !monthsAlive.isValid ||
    !hoursAlive.isValid
  ) {
    return { isValid: false, message: "Unable to calculate age from the selected date." };
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
  if (!snapshot || !snapshot.isValid) return emptyMetrics;
  return [
    { label: "Years", value: formatNumber(snapshot.years) },
    { label: "Months", value: formatNumber(snapshot.months) },
    { label: "Days", value: formatNumber(snapshot.days) },
    { label: "Total Days", value: formatNumber(snapshot.totalDays) },
    { label: "Total Weeks", value: formatNumber(snapshot.totalWeeks) },
    { label: "Total Months", value: formatNumber(snapshot.totalMonths) },
    { label: "Total Hours", value: formatNumber(snapshot.totalHours) },
  ];
}

function getLifeProgress(snapshot: AgeSnapshot | null) {
  if (!snapshot || !snapshot.isValid) return { percentageComplete: 0, percentageRemaining: 0 };
  const benchmarkDays = benchmarkLifespanYears * averageDaysPerYear;
  const percentageComplete = Math.min((snapshot.totalDays / benchmarkDays) * 100, 100);
  return { percentageComplete, percentageRemaining: Math.max(100 - percentageComplete, 0) };
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const today = useMemo(() => getTodayDateInputValue(), []);
  const ageSnapshot = useMemo(() => getAgeSnapshot(birthDate), [birthDate]);
  const resultMetrics = useMemo(() => getResultMetrics(ageSnapshot), [ageSnapshot]);
  const lifeProgress = useMemo(() => getLifeProgress(ageSnapshot), [ageSnapshot]);
  const hasValidResult = ageSnapshot?.isValid === true;

  return (
    <main className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Nav />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Know Your Time
          </h1>
          <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
            Discover your exact age in years, months, days, and beyond. Every second matters.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form
            aria-label="Birth date calculation form"
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1">
              <label className="block">
                <span className="sr-only">Date of birth</span>
                <input
                  aria-describedby={ageSnapshot && !ageSnapshot.isValid ? "birth-date-error" : undefined}
                  aria-label="Date of birth"
                  aria-invalid={ageSnapshot && !ageSnapshot.isValid ? true : undefined}
                  className="w-full h-14 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-5 font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  max={today}
                  name="birthDate"
                  onChange={(e) => setBirthDate(e.target.value)}
                  type="date"
                  value={birthDate}
                />
              </label>
            </div>
            <button
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold tracking-wide transition-all hover:from-indigo-500 hover:to-indigo-400 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              type="submit"
            >
              Calculate
            </button>
          </form>

          {ageSnapshot && !ageSnapshot.isValid ? (
            <p
              className="mt-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400 text-sm"
              id="birth-date-error"
              role="alert"
            >
              {ageSnapshot.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            detail={ageSnapshot?.isValid ? `${ageSnapshot.months} months, ${ageSnapshot.days} days` : "Select a date"}
            isActive={hasValidResult}
            label="Age"
            suffix="years"
            targetValue={ageSnapshot?.isValid ? ageSnapshot.years : 0}
          />
          <StatCard
            detail="Days alive"
            isActive={hasValidResult}
            label="Days"
            targetValue={ageSnapshot?.isValid ? ageSnapshot.totalDays : 0}
          />
          <StatCard
            detail="Hours alive"
            isActive={hasValidResult}
            label="Hours"
            targetValue={ageSnapshot?.isValid ? ageSnapshot.totalHours : 0}
          />
        </div>

        <div className="space-y-6">
          <LifeProgress
            isActive={hasValidResult}
            percentageComplete={lifeProgress.percentageComplete}
            percentageRemaining={lifeProgress.percentageRemaining}
          />

          <BirthdayCountdown birthDate={birthDate} />

          <MilestoneTimeline birthDate={birthDate} />

          {hasValidResult ? <ShareActions path={`/age/${birthDate}`} /> : null}

          <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detailed Statistics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-gray-200 dark:border-slate-700/30 bg-white dark:bg-slate-800/20 p-4 transition-all hover:border-indigo-200 dark:hover:bg-slate-800/40"
                >
                  <p className="text-sm text-gray-500 dark:text-slate-400">{metric.label}</p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-emerald-400">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
