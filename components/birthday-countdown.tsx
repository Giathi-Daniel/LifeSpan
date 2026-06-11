"use client";

import { useEffect, useState } from "react";
import { calculateDaysAlive } from "@/lib/age";

type BirthdayCountdownProps = {
  birthDate: string;
};

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  nextBirthday: string;
  usesLeapDayFallback: boolean;
};

type CountdownState =
  | {
      status: "idle";
    }
  | {
      status: "error";
      message: string;
    }
  | {
      status: "ready";
      value: CountdownValue;
    };

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function BirthdayCountdown({ birthDate }: BirthdayCountdownProps) {
  const [countdownState, setCountdownState] = useState<CountdownState>({
    status: "idle",
  });

  useEffect(() => {
    if (!birthDate) {
      setCountdownState({ status: "idle" });
      return;
    }

    function updateCountdown() {
      const now = new Date();
      const validation = calculateDaysAlive(birthDate, now);

      if (!validation.isValid) {
        setCountdownState({
          status: "error",
          message: validation.message,
        });
        return;
      }

      const parsedBirthDate = parseIsoDate(validation.birthDate);

      if (!parsedBirthDate) {
        setCountdownState({
          status: "error",
          message: "Unable to calculate birthday countdown.",
        });
        return;
      }

      const birthday = getNextBirthday(parsedBirthDate, now);
      const remainingTime = Math.max(birthday.date.getTime() - now.getTime(), 0);

      setCountdownState({
        status: "ready",
        value: {
          days: Math.floor(remainingTime / MS_PER_DAY),
          hours: Math.floor((remainingTime % MS_PER_DAY) / MS_PER_HOUR),
          minutes: Math.floor((remainingTime % MS_PER_HOUR) / MS_PER_MINUTE),
          seconds: Math.floor((remainingTime % MS_PER_MINUTE) / MS_PER_SECOND),
          nextBirthday: formatDisplayDate(birthday.date),
          usesLeapDayFallback: birthday.usesLeapDayFallback,
        },
      });
    }

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, MS_PER_SECOND);

    return () => window.clearInterval(intervalId);
  }, [birthDate]);

  return (
    <section
      aria-labelledby="birthday-countdown-heading"
      className="birthday-countdown-panel rounded-md border border-white/12 bg-[#05080c] p-4 shadow-[0_0_28px_rgba(47,125,246,0.08)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/42">
            lifespan birthday --countdown live
          </p>
          <h3
            className="mt-3 text-lg font-semibold text-white"
            id="birthday-countdown-heading"
          >
            Birthday Countdown
          </h3>
        </div>
        <span className="w-fit rounded-sm border border-[#2f7df6]/40 bg-[#2f7df6]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#78aaff]">
          {countdownState.status === "ready"
            ? countdownState.value.nextBirthday
            : "pending"}
        </span>
      </div>

      {countdownState.status === "idle" ? (
        <p className="mt-5 rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/58">
          Select a date of birth to start the live countdown.
        </p>
      ) : null}

      {countdownState.status === "error" ? (
        <p className="mt-5 rounded-sm border border-[#d86a9f]/30 bg-[#281722] px-4 py-3 font-mono text-sm text-[#d86a9f]">
          error: {countdownState.message}
        </p>
      ) : null}

      {countdownState.status === "ready" ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CountdownUnit label="Days" value={countdownState.value.days} />
            <CountdownUnit label="Hours" value={countdownState.value.hours} />
            <CountdownUnit
              label="Minutes"
              value={countdownState.value.minutes}
            />
            <CountdownUnit
              label="Seconds"
              value={countdownState.value.seconds}
            />
          </div>
          {countdownState.value.usesLeapDayFallback ? (
            <p className="mt-4 text-sm leading-6 text-white/58">
              Leap-day birthday detected. Countdown uses Mar 1 in non-leap
              years.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-white/10 bg-[#080d14] p-4">
      <p className="font-mono text-3xl font-semibold leading-none text-emerald-glow">
        {value.toString().padStart(2, "0")}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
        {label}
      </p>
    </div>
  );
}

function getNextBirthday(
  birthDate: { month: number; day: number },
  now: Date,
): { date: Date; usesLeapDayFallback: boolean } {
  const currentYearBirthday = getBirthdayForYear(
    birthDate.month,
    birthDate.day,
    now.getFullYear(),
  );

  if (currentYearBirthday.date.getTime() > now.getTime()) {
    return currentYearBirthday;
  }

  return getBirthdayForYear(
    birthDate.month,
    birthDate.day,
    now.getFullYear() + 1,
  );
}

function getBirthdayForYear(
  month: number,
  day: number,
  year: number,
): { date: Date; usesLeapDayFallback: boolean } {
  const isLeapDayBirthday = month === 2 && day === 29;
  const usesLeapDayFallback = isLeapDayBirthday && !isLeapYear(year);

  if (usesLeapDayFallback) {
    return {
      date: new Date(year, 2, 1, 0, 0, 0, 0),
      usesLeapDayFallback,
    };
  }

  return {
    date: new Date(year, month - 1, day, 0, 0, 0, 0),
    usesLeapDayFallback,
  };
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function parseIsoDate(isoDate: string): { month: number; day: number } | null {
  const [, month, day] = isoDate.split("-").map(Number);

  if (!month || !day) {
    return null;
  }

  return { month, day };
}

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
