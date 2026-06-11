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

type ResultMetric = {
  label: string;
  value: string;
  command: string;
};

type ProgressSnapshot = {
  percentageComplete: number;
  percentageRemaining: number;
};

const navigationItems = ["Timeline", "Age Engine", "Milestones", "Progress"];
const benchmarkLifespanYears = 80;
const averageDaysPerYear = 365.2425;

const moduleItems = [
  "exact-age",
  "days-alive",
  "weeks-alive",
  "months-alive",
  "hours-alive",
  "milestone-timeline",
  "birthday-countdown",
];

const emptyMetrics: ResultMetric[] = [
  { label: "Years", value: "-", command: "lifespan age --years" },
  { label: "Months", value: "-", command: "lifespan age --months" },
  { label: "Days", value: "-", command: "lifespan age --days" },
  { label: "Total days", value: "-", command: "lifespan stats --days" },
  { label: "Total weeks", value: "-", command: "lifespan stats --weeks" },
  { label: "Total months", value: "-", command: "lifespan stats --months" },
  { label: "Total hours", value: "-", command: "lifespan stats --hours" },
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
    {
      label: "Years",
      value: formatNumber(snapshot.years),
      command: "lifespan age --years",
    },
    {
      label: "Months",
      value: formatNumber(snapshot.months),
      command: "lifespan age --months",
    },
    {
      label: "Days",
      value: formatNumber(snapshot.days),
      command: "lifespan age --days",
    },
    {
      label: "Total days",
      value: formatNumber(snapshot.totalDays),
      command: "lifespan stats --days",
    },
    {
      label: "Total weeks",
      value: formatNumber(snapshot.totalWeeks),
      command: "lifespan stats --weeks",
    },
    {
      label: "Total months",
      value: formatNumber(snapshot.totalMonths),
      command: "lifespan stats --months",
    },
    {
      label: "Total hours",
      value: formatNumber(snapshot.totalHours),
      command: "lifespan stats --hours",
    },
  ];
}

function getLifeProgress(snapshot: AgeSnapshot | null): ProgressSnapshot {
  if (!snapshot || !snapshot.isValid) {
    return {
      percentageComplete: 0,
      percentageRemaining: 0,
    };
  }

  const benchmarkDays = benchmarkLifespanYears * averageDaysPerYear;
  const percentageComplete = Math.min(
    (snapshot.totalDays / benchmarkDays) * 100,
    100,
  );

  return {
    percentageComplete,
    percentageRemaining: Math.max(100 - percentageComplete, 0),
  };
}

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const today = useMemo(() => getTodayDateInputValue(), []);
  const ageSnapshot = useMemo(() => getAgeSnapshot(birthDate), [birthDate]);
  const resultMetrics = useMemo(
    () => getResultMetrics(ageSnapshot),
    [ageSnapshot],
  );
  const lifeProgress = useMemo(
    () => getLifeProgress(ageSnapshot),
    [ageSnapshot],
  );
  const hasValidResult = ageSnapshot?.isValid === true;

  return (
    <main className="min-h-screen text-white">
      <header className="border-b border-white/10 bg-[#111318]/92 px-5 py-3 backdrop-blur sm:px-8 lg:px-10">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-6"
        >
          <span className="border-2 border-[#2f7df6] px-3 py-1 text-2xl font-semibold tracking-[0.14em] text-[#2f7df6] shadow-[0_0_18px_rgba(47,125,246,0.28)]">
            LIFE
          </span>
          <div className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.08em] text-white/72 md:flex">
            {navigationItems.map((item) => (
              <span className="transition hover:text-white" key={item}>
                {item}
              </span>
            ))}
          </div>
        </nav>
      </header>

      <section
        aria-labelledby="homepage-heading"
        className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10"
      >
        <aside className="border-white/10 lg:border-r lg:pr-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-[#2f7df6]">‹</span>
            <p className="text-3xl font-semibold">LifeSpan</p>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="relative grid h-36 w-36 place-items-center rounded-full bg-[#2f7df6] shadow-[0_0_42px_rgba(47,125,246,0.38)] sm:h-44 sm:w-44">
              <span className="text-5xl font-semibold tracking-tight">LS</span>
              <span className="absolute -bottom-4 -left-3 grid h-20 w-20 place-items-center rounded-full bg-emerald-bright text-3xl font-semibold text-[#04111f] shadow-[0_18px_42px_rgba(16,185,129,0.24)]">
                %
              </span>
            </div>
            <div className="space-y-2 text-sm font-semibold">
              <p>
                <span className="rounded bg-[#281722] px-1.5 py-1 font-mono text-[#d86a9f]">
                  version: 0.2-ui
                </span>
              </p>
              <p>
                <span className="rounded bg-[#281722] px-1.5 py-1 font-mono text-[#d86a9f]">
                  mode: client
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10 border-y border-white/10 py-6">
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-[#2f7df6]">
              <span>◉ Exact Age Engine</span>
              <span>◇ Package Tracker</span>
              <span>□ Local Calculation</span>
              <span>✎ Edit Date</span>
            </div>
          </div>

          <section className="border-b border-white/10 py-6">
            <h2 className="text-2xl font-semibold">Metapackages</h2>
            <p className="mt-4 text-sm text-white/62">▣ everything</p>
          </section>

          <section className="border-b border-white/10 py-6">
            <h2 className="text-2xl font-semibold">Packages &amp; Binaries</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {moduleItems.map((item) => (
                <li className="flex items-center gap-3" key={item}>
                  <span className="text-[#2f7df6]">▧</span>
                  <span className="text-[#2f7df6]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mx-auto mt-10 flex w-fit items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/62">
            <span>Light</span>
            <span className="relative h-6 w-12 rounded-full bg-[#2f7df6] shadow-[0_0_16px_rgba(47,125,246,0.45)]">
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
            </span>
            <span>Dark</span>
          </div>
        </aside>

        <section className="lg:pl-4">
          <h1
            className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            id="homepage-heading"
          >
            Know Your Time:
          </h1>

          <div className="mt-12 border-l-4 border-[#2f7df6] pt-4">
            <div className="border-t-2 border-[#2f7df6] pl-5 pt-4">
              <h2 className="text-3xl font-semibold">lifespan-core</h2>
              <p className="mt-6 max-w-3xl font-mono text-sm font-semibold text-white/82">
                AI-free precision life statistics engine
              </p>
              <p className="mt-2 max-w-3xl text-base leading-7 text-white/68">
                Every second is a stat. Make it count with exact age totals,
                calendar-aware month handling, and leap-year-safe calculations.
              </p>
              <div className="mt-5 space-y-1 font-mono text-sm font-semibold text-white/86">
                <p>
                  Selected date:{" "}
                  <span className="rounded bg-[#281722] px-1.5 py-1 text-[#d86a9f]">
                    {birthDate || "none"}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span className="rounded bg-[#17201f] px-1.5 py-1 text-emerald-glow">
                    {hasValidResult ? "calculated" : "awaiting input"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <form
            aria-label="Birth date calculation form"
            className="mt-10 rounded-md border border-white/10 bg-[#191b21] p-4 sm:flex sm:items-end sm:gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block flex-1">
              <span className="mb-2 block text-sm font-semibold text-white/72">
                Dependencies:
              </span>
              <input
                aria-describedby="birth-date-error"
                aria-label="Date of birth"
                className="h-12 w-full rounded-sm border border-white/12 bg-[#05080c] px-4 font-mono text-base text-white outline-none transition focus:border-[#2f7df6] focus:ring-2 focus:ring-[#2f7df6]/35"
                max={today}
                name="birthDate"
                onChange={(event) => setBirthDate(event.target.value)}
                type="date"
                value={birthDate}
              />
            </label>
            <button
              className="mt-3 h-12 w-full rounded-sm bg-[#2f7df6] px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#5a98ff] focus:outline-none focus:ring-2 focus:ring-[#2f7df6] focus:ring-offset-2 focus:ring-offset-[#05080c] sm:mt-0 sm:w-auto"
              type="submit"
            >
              Calculate
            </button>
          </form>

          {ageSnapshot && !ageSnapshot.isValid ? (
            <p
              className="mt-4 rounded-sm border border-[#d86a9f]/30 bg-[#281722] px-4 py-3 font-mono text-sm leading-6 text-[#d86a9f]"
              id="birth-date-error"
            >
              error: {ageSnapshot.message}
            </p>
          ) : null}

          <section aria-labelledby="results-heading" className="mt-10">
            <h2
              className="font-mono text-xl font-semibold text-white"
              id="results-heading"
            >
              <span className="text-[#8757ff]">$</span> lifespan_stats
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <StatCard
                command="lifespan age --exact"
                detail={
                  ageSnapshot?.isValid
                    ? `${ageSnapshot.months} months, ${ageSnapshot.days} days`
                    : "Select a date"
                }
                isActive={hasValidResult}
                label="Age"
                suffix="yrs"
                targetValue={ageSnapshot?.isValid ? ageSnapshot.years : 0}
              />
              <StatCard
                command="lifespan stats --days"
                detail="Days alive"
                isActive={hasValidResult}
                label="Days alive"
                targetValue={ageSnapshot?.isValid ? ageSnapshot.totalDays : 0}
              />
              <StatCard
                command="lifespan stats --hours"
                detail="Hours alive"
                isActive={hasValidResult}
                label="Hours alive"
                targetValue={ageSnapshot?.isValid ? ageSnapshot.totalHours : 0}
              />
            </div>

            <div className="mt-3">
              <LifeProgress
                isActive={hasValidResult}
                percentageComplete={lifeProgress.percentageComplete}
                percentageRemaining={lifeProgress.percentageRemaining}
              />
            </div>

            <div className="mt-3">
              <BirthdayCountdown birthDate={birthDate} />
            </div>

            <div className="mt-3">
              <MilestoneTimeline birthDate={birthDate} />
            </div>

            <div className="terminal-panel mt-6 overflow-hidden rounded-md border border-white/12 bg-black shadow-[0_0_32px_rgba(47,125,246,0.12)]">
              <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-xs text-white/50">
                root@lifespan:~# calculate --date {birthDate || "YYYY-MM-DD"}
              </div>
              <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                {resultMetrics.map((metric) => (
                  <article className="bg-[#05080c] p-4" key={metric.label}>
                    <p className="font-mono text-xs text-white/42">
                      {metric.command}
                    </p>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-white/72">
                        {metric.label}
                      </p>
                      <p className="font-mono text-2xl font-semibold text-emerald-glow">
                        {metric.value}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
