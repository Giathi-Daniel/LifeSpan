"use client";

import { useEffect, useMemo, useState } from "react";

type StatCardProps = {
  label: string;
  targetValue: number;
  detail: string;
  suffix?: string;
  isActive: boolean;
};

const animationDuration = 720;

export function StatCard({
  label,
  targetValue,
  detail,
  suffix = "",
  isActive,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(0);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDisplayValue(targetValue);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    function updateCounter(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(targetValue * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCounter);
      }
    }

    frameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(frameId);
  }, [isActive, targetValue]);

  return (
    <article className="card-enter rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6 transition-all hover:bg-slate-800/40">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="mt-2">
        <p
          aria-live="polite"
          className="font-mono text-4xl font-bold leading-none text-emerald-400 sm:text-5xl"
        >
          {isActive ? numberFormatter.format(displayValue) : "-"}
          {isActive && suffix ? (
            <span className="ml-2 text-lg text-slate-400">{suffix}</span>
          ) : null}
        </p>
        <p className="mt-3 text-sm text-slate-300">{detail}</p>
      </div>
    </article>
  );
}