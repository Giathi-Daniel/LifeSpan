"use client";

import { useMemo, useState } from "react";
import { Nav } from "@/components/nav";
import { calculateMilestones, type MilestoneStatus } from "@/lib/milestones";
import { calculateFunFacts } from "@/lib/facts";

const milestoneDescriptions: Record<number, string> = {
  18: "Legal adulthood in most countries. You can vote, sign contracts, and take full responsibility for your decisions.",
  21: "Full legal rights in the US, including alcohol. Often seen as the true start of adult independence.",
  25: "The human prefrontal cortex is now fully developed. Car insurance rates drop. Rational decisions become easier.",
  30: "A decade of adult experience. Most people feel more settled in career, relationships, and identity.",
  40: "Peak expertise. Studies show decision-making wisdom and emotional stability reach their highest around this age.",
  50: "Half a century of life. A time of reflection, often bringing a renewed sense of purpose and priorities.",
  60: "Retirement enters view. Decades of compounding experience in work, relationships, and personal growth.",
  70: "Wisdom earned. Long-term health habits and relationships pay their biggest dividends at this stage.",
};

const statusStyles: Record<MilestoneStatus, { badge: string; dot: string; card: string }> = {
  Passed: {
    badge: "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    card: "border-gray-200 dark:border-slate-700/30 bg-white dark:bg-slate-800/20",
  },
  Upcoming: {
    badge: "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500 ring-4 ring-indigo-500/20",
    card: "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5",
  },
  Future: {
    badge: "border-gray-200 dark:border-slate-600/30 bg-gray-50 dark:bg-slate-600/10 text-gray-500 dark:text-slate-400",
    dot: "bg-gray-300 dark:bg-slate-600",
    card: "border-gray-200 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-800/10",
  },
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00.000Z`)
  );
}

function getDaysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00.000Z`).getTime();
  const now = Date.now();
  return Math.max(Math.ceil((target - now) / 86400000), 0);
}

function getDaysSince(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00.000Z`).getTime();
  const now = Date.now();
  return Math.max(Math.floor((now - target) / 86400000), 0);
}

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function MilestonesPage() {
  const [birthDate, setBirthDate] = useState("");
  const today = useMemo(() => getTodayDateInputValue(), []);

  const milestoneResult = useMemo(() => (birthDate ? calculateMilestones(birthDate) : null), [birthDate]);
  const factsResult = useMemo(() => (birthDate ? calculateFunFacts(birthDate) : null), [birthDate]);

  const passed = milestoneResult?.isValid ? milestoneResult.milestones.filter((m) => m.status === "Passed").length : 0;
  const remaining = milestoneResult?.isValid ? milestoneResult.milestones.filter((m) => m.status !== "Passed").length : 0;

  return (
    <main className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Nav />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Life Milestones
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl">
            Key ages that mark significant transitions — see which you've passed, what's coming next, and what's ahead.
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

        {/* Summary stats */}
        {milestoneResult?.isValid && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Milestones passed", value: passed },
              { label: "Milestones ahead", value: remaining },
              { label: "Born on a", value: factsResult?.isValid ? factsResult.birthWeekday : "—" },
              { label: "Total milestones", value: milestoneResult.milestones.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-5">
                <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
                <p className="mt-1 text-3xl font-bold font-mono text-indigo-600 dark:text-emerald-400">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!birthDate && (
          <p className="rounded-lg border border-gray-200 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-800/20 px-4 py-3 text-sm text-gray-500 dark:text-slate-300">
            Enter your date of birth to see your personal milestone timeline.
          </p>
        )}

        {milestoneResult && !milestoneResult.isValid && (
          <p className="rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {milestoneResult.message}
          </p>
        )}

        {/* Milestones list */}
        {milestoneResult?.isValid && (
          <ol className="grid gap-4 md:grid-cols-2">
            {milestoneResult.milestones.map((milestone) => {
              const styles = statusStyles[milestone.status];
              const isPast = milestone.status === "Passed";
              const isUpcoming = milestone.status === "Upcoming";

              return (
                <li key={milestone.age} className={`rounded-2xl border p-6 transition-all ${styles.card}`}>
                  <div className="flex items-start gap-4">
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${styles.dot}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <p className="font-mono text-4xl font-bold text-gray-900 dark:text-white">
                          {milestone.age}
                          <span className="ml-2 text-base font-sans font-normal text-gray-400 dark:text-slate-500">years</span>
                        </p>
                        <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
                          {milestone.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">
                        {milestoneDescriptions[milestone.age]}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-wider font-medium">Date</p>
                          <p className="font-mono text-indigo-600 dark:text-emerald-400 font-semibold mt-0.5">
                            {formatDate(milestone.dateReached)}
                          </p>
                        </div>
                        {isPast && (
                          <div>
                            <p className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-wider font-medium">Days since</p>
                            <p className="font-mono text-gray-700 dark:text-slate-300 font-semibold mt-0.5">
                              {getDaysSince(milestone.dateReached).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {(isUpcoming || milestone.status === "Future") && (
                          <div>
                            <p className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-wider font-medium">Days away</p>
                            <p className="font-mono text-gray-700 dark:text-slate-300 font-semibold mt-0.5">
                              {getDaysUntil(milestone.dateReached).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Fun facts section */}
        {factsResult?.isValid && (
          <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Biological Estimates</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Heartbeats", value: factsResult.estimatedHeartbeats.toLocaleString(), note: `~${factsResult.assumptions.heartRateBpm} bpm` },
                { label: "Breaths taken", value: factsResult.estimatedBreaths.toLocaleString(), note: `~${factsResult.assumptions.breathsPerMinute}/min` },
                { label: "Sleep hours", value: factsResult.estimatedSleepHours.toLocaleString(), note: `~${factsResult.assumptions.sleepHoursPerDay}h/day` },
                { label: "Born on a", value: factsResult.birthWeekday, note: birthDate },
              ].map(({ label, value, note }) => (
                <div key={label} className="rounded-xl border border-gray-200 dark:border-slate-700/30 bg-white dark:bg-slate-800/20 p-4">
                  <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-indigo-600 dark:text-emerald-400">{value}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
