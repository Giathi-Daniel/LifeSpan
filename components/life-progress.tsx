"use client";

import { useEffect, useState } from "react";

type LifeProgressProps = {
  percentageComplete: number;
  percentageRemaining: number;
  isActive: boolean;
};

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function LifeProgress({
  percentageComplete,
  percentageRemaining,
  isActive,
}: LifeProgressProps) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setBarWidth(0);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setBarWidth(percentageComplete);
    });

    return () => cancelAnimationFrame(frameId);
  }, [isActive, percentageComplete]);

  return (
    <article className="card-enter rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Life Progress</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Benchmark assumes an 80-year lifespan and caps progress at 100%.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {isActive ? formatPercentage(percentageComplete) : "-"}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-400 dark:text-slate-400 uppercase tracking-wider">
              Complete
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {isActive ? formatPercentage(percentageRemaining) : "-"}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-400 dark:text-slate-400 uppercase tracking-wider">
              Remaining
            </p>
          </div>
        </div>
      </div>

      <div
        aria-label={
          isActive
            ? `${formatPercentage(percentageComplete)} life progress complete`
            : "Life progress awaiting date selection"
        }
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={isActive ? Number(percentageComplete.toFixed(2)) : 0}
        className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-[width] duration-700 ease-out"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </article>
  );
}