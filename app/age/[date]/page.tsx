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

type FunFactMetric = {
  label: string;
  value: string;
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

  const funFacts = getFunFactMetrics(date);
  const lifeProgress = getLifeProgress(snapshot);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
            Shareable age page
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Age stats for {date}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A public LifeSpan snapshot with exact age, life progress, birthday
            countdown, milestones, and estimated fun facts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            detail={`${snapshot.months} months, ${snapshot.days} days`}
            isActive
            label="Age"
            suffix="years"
            targetValue={snapshot.years}
          />
          <StatCard
            detail="Days alive"
            isActive
            label="Days alive"
            targetValue={snapshot.totalDays}
          />
          <StatCard
            detail="Hours alive"
            isActive
            label="Hours alive"
            targetValue={snapshot.totalHours}
          />
        </div>

        <div className="space-y-6">
          <LifeProgress
            isActive
            percentageComplete={lifeProgress.percentageComplete}
            percentageRemaining={lifeProgress.percentageRemaining}
          />

          <BirthdayCountdown birthDate={date} />

          <MilestoneTimeline birthDate={date} />

          <ShareActions path={`/age/${date}`} />

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Fun Facts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {funFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-slate-700/30 bg-slate-800/20 p-4"
                >
                  <p className="text-sm text-slate-400">{fact.label}</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
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

function getFunFactMetrics(date: string): FunFactMetric[] {
  const facts = calculateFunFacts(date);

  if (!facts.isValid) {
    return [];
  }

  return [
    {
      label: "Estimated heartbeats",
      value: formatNumber(facts.estimatedHeartbeats),
    },
    {
      label: "Estimated breaths",
      value: formatNumber(facts.estimatedBreaths),
    },
    {
      label: "Estimated sleep hours",
      value: formatNumber(facts.estimatedSleepHours),
    },
    {
      label: "Birth weekday",
      value: facts.birthWeekday,
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