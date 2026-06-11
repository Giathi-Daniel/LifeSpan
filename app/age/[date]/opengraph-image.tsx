import { ImageResponse } from "next/og";
import { calculateAge, calculateDaysAlive } from "@/lib/age";

type OpenGraphImageProps = {
  params: Promise<{
    date: string;
  }>;
};

type BirthdayCountdown = {
  days: number;
  hours: number;
  minutes: number;
};

export const alt = "LifeSpan age summary";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { date } = await params;
  const age = datePattern.test(date) ? calculateAge(date) : null;
  const daysAlive = datePattern.test(date) ? calculateDaysAlive(date) : null;
  const countdown = datePattern.test(date) ? getBirthdayCountdown(date) : null;
  const isValid = age?.isValid && daysAlive?.isValid && countdown;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #05080c 0%, #07111d 48%, #020408 100%)",
          color: "#ffffff",
          fontFamily: "Inter, Arial, sans-serif",
          padding: 56,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(47,125,246,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(47,125,246,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -140,
            width: 430,
            height: 430,
            borderRadius: 999,
            background: "rgba(47,125,246,0.18)",
            filter: "blur(6px)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: "6px solid #2f7df6",
            paddingLeft: 34,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  width: 132,
                  border: "3px solid #2f7df6",
                  color: "#2f7df6",
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: 5,
                  padding: "6px 12px",
                  boxShadow: "0 0 24px rgba(47,125,246,0.32)",
                }}
              >
                LIFE
              </div>
              <div
                style={{
                  color: "#34d399",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Know Your Time
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 44,
                border: "1px solid rgba(216,106,159,0.36)",
                background: "#281722",
                color: "#d86a9f",
                fontSize: 24,
                fontFamily: "monospace",
                padding: "0 14px",
              }}
            >
              {date}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 74,
                lineHeight: 0.95,
                fontWeight: 800,
                letterSpacing: -2,
              }}
            >
              {isValid ? `${age.years} years old` : "Invalid date"}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 820,
                color: "rgba(255,255,255,0.72)",
                fontSize: 28,
                lineHeight: 1.35,
              }}
            >
              {isValid
                ? `${age.months} months and ${age.days} days into the current year of life.`
                : "Use a valid YYYY-MM-DD birth date to generate a shareable LifeSpan card."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
            }}
          >
            <MetricCard
              label="Days alive"
              value={isValid ? formatNumber(daysAlive.daysAlive) : "-"}
            />
            <MetricCard
              label="Next birthday"
              value={
                isValid
                  ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
                  : "-"
              }
            />
            <MetricCard label="Brand" value="LifeSpan" />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "#05080c",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: 24,
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.54)",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#34d399",
          fontSize: 38,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function getBirthdayCountdown(date: string): BirthdayCountdown | null {
  const [, month, day] = date.split("-").map(Number);

  if (!month || !day) {
    return null;
  }

  const now = new Date();
  const birthday = getNextBirthday({ month, day }, now);
  const remainingMs = Math.max(birthday.getTime() - now.getTime(), 0);
  const totalMinutes = Math.floor(remainingMs / (60 * 1000));

  return {
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
  };
}

function getNextBirthday(
  birthDate: { month: number; day: number },
  now: Date,
): Date {
  const currentYearBirthday = getBirthdayForYear(
    birthDate.month,
    birthDate.day,
    now.getFullYear(),
  );

  if (currentYearBirthday.getTime() > now.getTime()) {
    return currentYearBirthday;
  }

  return getBirthdayForYear(
    birthDate.month,
    birthDate.day,
    now.getFullYear() + 1,
  );
}

function getBirthdayForYear(month: number, day: number, year: number): Date {
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 2, 1, 0, 0, 0, 0);
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
