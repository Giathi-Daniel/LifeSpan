"use client";

import { useEffect, useMemo, useState } from "react";

type StatCardProps = {
  label: string;
  targetValue: number;
  command: string;
  detail: string;
  suffix?: string;
  isActive: boolean;
};

const animationDuration = 720;

export function StatCard({
  label,
  targetValue,
  command,
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
    <article className="stat-card-reveal rounded-md border border-white/12 bg-[#05080c] p-4 shadow-[0_0_24px_rgba(47,125,246,0.08)]">
      <p className="font-mono text-xs text-white/42">{command}</p>
      <div className="mt-4">
        <p className="text-sm font-semibold text-white/64">{label}</p>
        <p
          aria-live="polite"
          className="mt-2 font-mono text-4xl font-semibold leading-none text-emerald-glow sm:text-5xl"
        >
          {isActive ? numberFormatter.format(displayValue) : "-"}
          {isActive && suffix ? (
            <span className="ml-2 text-base text-white/52">{suffix}</span>
          ) : null}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f7df6]">
          {detail}
        </p>
      </div>
    </article>
  );
}
