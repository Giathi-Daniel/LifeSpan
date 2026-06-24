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
    <section className="card-enter rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6 transition-all hover:bg-slate-800/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Birthday Countdown</h3>
          <p className="mt-2 text-sm text-slate-400">
            Time until your next birthday
          </p>
        </div>
        <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 font-mono text-sm font-medium text-indigo-300">
          {countdownState.status === "ready"
            ? countdownState.value.nextBirthday
            : "Select date"}
        </span>
      </div>

      {countdownState.status === "idle" ? (
        <p className="mt-6 rounded-lg border border-slate-700/30 bg-slate-800/20 px-4 py-3 text-sm text-slate-300">
          Select a date of birth to start the live countdown.
        </p>
      ) : null}

      {countdownState.status === "error" ? (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {countdownState.message}
        </p>
      ) : null}

      {countdownState.status === "ready" ? (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <p className="mt-4 text-sm text-slate-300">
              Leap-day birthday detected. Countdown uses Mar 1 in non-leap years.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-700/30 bg-slate-800/20 p-4 text-center">
      <p className="font-mono text-3xl font-bold leading-none text-emerald-400">
        {value.toString().padStart(2, "0")}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
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