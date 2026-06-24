"use client";

import { useMemo, useState } from "react";
import { Nav } from "@/components/nav";
import { calculateAge, calculateDaysAlive } from "@/lib/age";

const BENCHMARK_YEARS = 80;

type YearRow = {
  age: number;
  year: number;
  status: "past" | "current" | "future";
  daysLived?: number;
  percentOfYear?: number;
};

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function buildTimeline(birthDate: string): YearRow[] | null {
  const age = calculateAge(birthDate);
  if (!age.isValid) return null;

  const birthYear = Number(birthDate.split("-")[0]);
  const today = new Date();
  const rows: YearRow[] = [];

  for (let a = 0; a <= BENCHMARK_YEARS; a++) {
    const yearStart = new Date(Date.UTC(birthYear + a, Number(birthDate.split("-")[1]) - 1, Number(birthDate.split("-")[2])));
    const yearEnd = new Date(Date.UTC(birthYear + a + 1, Number(birthDate.split("-")[1]) - 1, Number(birthDate.split("-")[2])));
    const calYear = birthYear + a;

    let status: YearRow["status"] = "future";
    let daysLived: number | undefined;
    let percentOfYear: number | undefined;

    if (yearEnd.getTime() <= today.getTime()) {
      status = "past";
      daysLived = Math.round((yearEnd.getTime() - yearStart.getTime()) / 86400000);
      percentOfYear = 100;
    } else if (yearStart.getTime() <= today.getTime()) {
      status = "current";
      daysLived = Math.round((today.getTime() - yearStart.getTime()) / 86400000);
      const totalDaysInYear = Math.round((yearEnd.getTime() - yearStart.getTime()) / 86400000);
      percentOfYear = Math.round((daysLived / totalDaysInYear) * 100);
    }

    rows.push({ age: a, year: calYear, status, daysLived, percentOfYear });
  }

  return rows;
}

function getLifeStats(birthDate: string) {
  const age = calculateAge(birthDate);
  const days = calculateDaysAlive(birthDate);
  if (!age.isValid || !days.isValid) return null;

  const totalBenchmarkDays = BENCHMARK_YEARS * 365.2425;
  const pct = Math.min((days.daysAlive / totalBenchmarkDays) * 100, 100);

  return {
    yearsLived: age.years,
    yearsRemaining: Math.max(BENCHMARK_YEARS - age.years, 0),
    percentLived: pct,
    percentRemaining: Math.max(100 - pct, 0),
    daysLived: days.daysAlive,
    daysRemaining: Math.max(Math.round(totalBenchmarkDays - days.daysAlive), 0),
  };
}

const statusColors = {
  past: "bg-emerald-500",
  current: "bg-indigo-500 animate-pulse",
  future: "bg-gray-200 dark:bg-slate-700",
};

export default function TimelinePage() {
  const [birthDate, setBirthDate] = useState("");
  const today = useMemo(() => getTodayDateInputValue(), []);
  const timeline = useMemo(() => (birthDate ? buildTimeline(birthDate) : null), [birthDate]);
  const stats = useMemo(() => (birthDate ? getLifeStats(birthDate) : null), [birthDate]);

  return (
    <main className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Nav />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Remaining Timeline
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl">
            A year-by-year view of your life benchmarked to {BENCHMARK_YEARS} years. Each block is one year.
          </p>
        </div>

        {/* Date input */}
        <div className="max-w-sm mb-10">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Date of birth
          </label>
          <input
            type="date"
            max={today}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
          />
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Years lived", value: stats.yearsLived },
              { label: "Years remaining", value: stats.yearsRemaining },
              { label: "Days lived", value: stats.daysLived.toLocaleString() },
              { label: "Days remaining", value: stats.daysRemaining.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-5">
                <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
                <p className="mt-1 text-3xl font-bold font-mono text-indigo-600 dark:text-emerald-400">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Life progress bar */}
        {stats && (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-6 mb-10">
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">
              <span>Birth</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{stats.percentLived.toFixed(1)}% lived</span>
              <span>Age {BENCHMARK_YEARS}</span>
            </div>
            <div className="h-4 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-[width] duration-700 ease-out"
                style={{ width: `${stats.percentLived}%` }}
              />
            </div>
          </div>
        )}

        {/* Year grid */}
        {!birthDate && (
          <p className="rounded-lg border border-gray-200 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-800/20 px-4 py-3 text-sm text-gray-500 dark:text-slate-300">
            Enter your date of birth to see your year-by-year timeline.
          </p>
        )}

        {timeline && (
          <>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Lived</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Current year</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-slate-700 inline-block" /> Future</span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
              {timeline.map((row) => (
                <div
                  key={row.age}
                  title={`Age ${row.age} — ${row.year}${row.status === "current" ? ` (${row.percentOfYear}% complete)` : ""}`}
                  className="group relative"
                >
                  <div className={`h-10 rounded-lg ${statusColors[row.status]} transition-transform hover:scale-110 cursor-default`}>
                    {row.status === "current" && (
                      <div
                        className="absolute inset-0 rounded-lg bg-indigo-500"
                        style={{ width: `${row.percentOfYear}%` }}
                      />
                    )}
                  </div>
                  <p className="mt-1 text-center text-[10px] text-gray-400 dark:text-slate-500">{row.age}</p>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap rounded-lg bg-gray-900 dark:bg-slate-700 px-2 py-1 text-xs text-white shadow-lg pointer-events-none">
                    Age {row.age} · {row.year}
                    {row.status === "current" ? ` · ${row.percentOfYear}%` : ""}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
