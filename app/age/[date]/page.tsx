import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BirthdayCountdown } from "@/components/birthday-countdown";
import { LifeProgress } from "@/components/life-progress";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { ShareActions } from "@/components/share-actions";
import { StatCard } from "@/components/stat-card";
import {
  calculateAge,
  calculateDaysAlive,
  calculateHoursAlive,
  calculateMonthsAlive,
  calculateWeeksAlive,
} from "@/lib/age";
import { calculateFunFacts } from "@/lib/facts";
import { getAbsoluteUrl, siteConfig } from "@/lib/site";

type AgePageProps = {
  params: Promise<{
    date: string;
  }>;
};

type AgeSnapshot = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
};

type ResultMetric = {
  label: string;
  value: string;
  command: string;
};

type FunFactMetric = {
  label: string;
  value: string;
  command: string;
};

const benchmarkLifespanYears = 80;
const averageDaysPerYear = 365.2425;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function generateMetadata({
  params,
}: AgePageProps): Promise<Metadata> {
  const { date } = await params;
  const snapshot = getAgeSnapshot(date);
  const canonicalUrl = getAbsoluteUrl(`/age/${date}`);

  if (!snapshot) {
    return {
      title: "Invalid Age Page | LifeSpan",
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${snapshot.years} Years Old | LifeSpan`,
    description: `Explore age stats for ${date}: exact age, days alive, hours alive, life progress, milestones, birthday countdown, and fun facts.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${snapshot.years} Years Old | LifeSpan`,
      description: `Shareable LifeSpan age page for ${date}.`,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: `${canonicalUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `LifeSpan age stats for ${date}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${snapshot.years} Years Old | LifeSpan`,
      description: `Shareable LifeSpan age page for ${date}.`,
      images: [`${canonicalUrl}/opengraph-image`],
    },
  };
}

export default async function AgePage({ params }: AgePageProps) {
  const { date } = await params;
  const snapshot = getAgeSnapshot(date);

  if (!snapshot) {
    notFound();
  }

  const resultMetrics = getResultMetrics(snapshot);
  const funFacts = getFunFactMetrics(date);
  const lifeProgress = getLifeProgress(snapshot);

  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="border-l-4 border-[#2f7df6] pt-4">
          <div className="border-t-2 border-[#2f7df6] pl-5 pt-4">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-[#2f7df6]">
              Shareable age page
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Age stats for {date}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/68">
              A public LifeSpan snapshot with exact age, life progress,
              birthday countdown, milestones, and estimated fun facts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 font-mono text-sm font-semibold">
              <span className="rounded bg-[#281722] px-1.5 py-1 text-[#d86a9f]">
                date: {date}
              </span>
              <span className="rounded bg-[#17201f] px-1.5 py-1 text-emerald-glow">
                status: valid
              </span>
            </div>
          </div>
        </div>

        <section aria-labelledby="share-results-heading" className="mt-10">
          <h2
            className="font-mono text-xl font-semibold text-white"
            id="share-results-heading"
          >
            <span className="text-[#8757ff]">$</span> lifespan_share
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <StatCard
              command="lifespan age --exact"
              detail={`${snapshot.months} months, ${snapshot.days} days`}
              isActive
              label="Age"
              suffix="yrs"
              targetValue={snapshot.years}
            />
            <StatCard
              command="lifespan stats --days"
              detail="Days alive"
              isActive
              label="Days alive"
              targetValue={snapshot.totalDays}
            />
            <StatCard
              command="lifespan stats --hours"
              detail="Hours alive"
              isActive
              label="Hours alive"
              targetValue={snapshot.totalHours}
            />
          </div>

          <div className="mt-3">
            <LifeProgress
              isActive
              percentageComplete={lifeProgress.percentageComplete}
              percentageRemaining={lifeProgress.percentageRemaining}
            />
          </div>

          <div className="mt-3">
            <BirthdayCountdown birthDate={date} />
          </div>

          <div className="mt-3">
            <ShareActions path={`/age/${date}`} />
          </div>

          <div className="mt-3">
            <MilestoneTimeline birthDate={date} />
          </div>

          <div className="terminal-panel mt-6 overflow-hidden rounded-md border border-white/12 bg-black shadow-[0_0_32px_rgba(47,125,246,0.12)]">
            <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-xs text-white/50">
              root@lifespan:~# calculate --date {date}
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

          <section
            aria-labelledby="fun-facts-heading"
            className="terminal-panel mt-6 overflow-hidden rounded-md border border-white/12 bg-black shadow-[0_0_32px_rgba(47,125,246,0.12)]"
          >
            <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <h2
                className="font-mono text-sm font-semibold text-white/72"
                id="fun-facts-heading"
              >
                root@lifespan:~# facts --date {date}
              </h2>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {funFacts.map((fact) => (
                <article className="bg-[#05080c] p-4" key={fact.label}>
                  <p className="font-mono text-xs text-white/42">
                    {fact.command}
                  </p>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-white/72">
                      {fact.label}
                    </p>
                    <p className="text-right font-mono text-xl font-semibold text-emerald-glow">
                      {fact.value}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function getAgeSnapshot(date: string): AgeSnapshot | null {
  if (!datePattern.test(date)) {
    return null;
  }

  const age = calculateAge(date);
  const daysAlive = calculateDaysAlive(date);
  const weeksAlive = calculateWeeksAlive(date);
  const monthsAlive = calculateMonthsAlive(date);
  const hoursAlive = calculateHoursAlive(date);

  if (
    !age.isValid ||
    !daysAlive.isValid ||
    !weeksAlive.isValid ||
    !monthsAlive.isValid ||
    !hoursAlive.isValid
  ) {
    return null;
  }

  return {
    years: age.years,
    months: age.months,
    days: age.days,
    totalDays: daysAlive.daysAlive,
    totalWeeks: weeksAlive.weeksAlive,
    totalMonths: monthsAlive.monthsAlive,
    totalHours: hoursAlive.hoursAlive,
  };
}

function getResultMetrics(snapshot: AgeSnapshot): ResultMetric[] {
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

function getFunFactMetrics(date: string): FunFactMetric[] {
  const facts = calculateFunFacts(date);

  if (!facts.isValid) {
    return [];
  }

  return [
    {
      label: "Estimated heartbeats",
      value: formatNumber(facts.estimatedHeartbeats),
      command: "lifespan facts --heartbeats",
    },
    {
      label: "Estimated breaths",
      value: formatNumber(facts.estimatedBreaths),
      command: "lifespan facts --breaths",
    },
    {
      label: "Estimated sleep hours",
      value: formatNumber(facts.estimatedSleepHours),
      command: "lifespan facts --sleep",
    },
    {
      label: "Birth weekday",
      value: facts.birthWeekday,
      command: "lifespan facts --weekday",
    },
  ];
}

function getLifeProgress(snapshot: AgeSnapshot): {
  percentageComplete: number;
  percentageRemaining: number;
} {
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
