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
    <article className="life-progress-panel rounded-md border border-white/12 bg-[#05080c] p-4 shadow-[0_0_28px_rgba(47,125,246,0.1)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/42">
            lifespan progress --benchmark 80y
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">
            Life Progress
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right">
          <div>
            <p className="font-mono text-2xl font-semibold text-emerald-glow">
              {isActive ? formatPercentage(percentageComplete) : "-"}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/46">
              Complete
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-[#2f7df6]">
              {isActive ? formatPercentage(percentageRemaining) : "-"}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/46">
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
        className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2f7df6] via-emerald-bright to-emerald-glow shadow-[0_0_18px_rgba(16,185,129,0.34)] transition-[width] duration-700 ease-out"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-white/58">
        Benchmark assumes an 80-year lifespan and caps progress at 100%.
      </p>
    </article>
  );
}
