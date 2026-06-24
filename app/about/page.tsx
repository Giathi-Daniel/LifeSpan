import { Nav } from "@/components/nav";
import Link from "next/link";
import type { ReactNode } from "react";

type Feature = { icon: ReactNode; title: string; description: string };

const features: Feature[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Precise Age",
    description: "Years, months, days, hours — all computed live with no rounding.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Life Progress",
    description: "A progress bar benchmarked to 80 years showing how far you've come.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: "Milestones",
    description: "Ages 18–70 with past/upcoming/future status and days until each.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Remaining Timeline",
    description: "A year-by-year grid of your life — every block is one year.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: "Birthday Countdown",
    description: "Live ticking countdown to your next birthday, leap-day safe.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: "Shareable URLs",
    description: "Every birth date gets a permanent URL with a dynamic OG image.",
  },
];

const stack = [
  { name: "Next.js 15", role: "App Router, RSC, edge-ready" },
  { name: "Tailwind CSS", role: "Utility-first, no runtime" },
  { name: "next-themes", role: "Dark/light mode, SSR-safe" },
  { name: "TypeScript", role: "All date logic, zero deps" },
  { name: "Vercel", role: "Edge functions, OG images" },
];

const apiEndpoints = [
  {
    module: "lib/age",
    functions: [
      {
        name: "calculateAge",
        signature: "calculateAge(birthDate: string | Date, referenceDate?: string | Date): AgeResult",
        description: "Returns exact age broken down into years, months, days, and total months.",
        example: `import { calculateAge } from "@/lib/age";

const result = calculateAge("1990-05-14");

if (result.isValid) {
  console.log(result.years);       // e.g. 34
  console.log(result.months);      // e.g. 7
  console.log(result.days);        // e.g. 3
  console.log(result.totalMonths); // e.g. 415
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  years: 34,
  months: 7,
  days: 3,
  totalMonths: 415
}`,
        errorShape: `{
  isValid: false,
  error: "FUTURE_DATE" | "INVALID_DATE",
  message: "Birth date cannot be in the future."
}`,
      },
      {
        name: "calculateDaysAlive",
        signature: "calculateDaysAlive(birthDate: string | Date, referenceDate?: string | Date): DaysAliveResult",
        description: "Returns the total number of days elapsed since birth.",
        example: `import { calculateDaysAlive } from "@/lib/age";

const result = calculateDaysAlive("1990-05-14");

if (result.isValid) {
  console.log(result.daysAlive); // e.g. 12666
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  daysAlive: 12666
}`,
      },
      {
        name: "calculateWeeksAlive",
        signature: "calculateWeeksAlive(birthDate: string | Date, referenceDate?: string | Date): WeeksAliveResult",
        description: "Returns total complete weeks alive and leftover days.",
        example: `import { calculateWeeksAlive } from "@/lib/age";

const result = calculateWeeksAlive("1990-05-14");

if (result.isValid) {
  console.log(result.weeksAlive);    // e.g. 1809
  console.log(result.remainingDays); // e.g. 3
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  weeksAlive: 1809,
  remainingDays: 3
}`,
      },
      {
        name: "calculateHoursAlive",
        signature: "calculateHoursAlive(birthDate: string | Date, referenceDate?: string | Date): HoursAliveResult",
        description: "Returns total hours alive (days × 24, no partial hours).",
        example: `import { calculateHoursAlive } from "@/lib/age";

const result = calculateHoursAlive("1990-05-14");

if (result.isValid) {
  console.log(result.hoursAlive); // e.g. 303984
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  hoursAlive: 303984
}`,
      },
    ],
  },
  {
    module: "lib/milestones",
    functions: [
      {
        name: "calculateMilestones",
        signature: "calculateMilestones(birthDate: string | Date, referenceDate?: string | Date): MilestoneTimelineResult",
        description: "Returns milestone dates for ages 18, 21, 25, 30, 40, 50, 60, 70 — each tagged as Passed, Upcoming, or Future.",
        example: `import { calculateMilestones } from "@/lib/milestones";

const result = calculateMilestones("1990-05-14");

if (result.isValid) {
  result.milestones.forEach((m) => {
    console.log(m.age, m.dateReached, m.status);
    // 18  "2008-05-14"  "Passed"
    // 25  "2015-05-14"  "Passed"
    // 35  "2025-05-14"  "Upcoming"
    // 40  "2030-05-14"  "Future"
  });
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  milestones: [
    { age: 18, dateReached: "2008-05-14", status: "Passed" },
    { age: 21, dateReached: "2011-05-14", status: "Passed" },
    { age: 25, dateReached: "2015-05-14", status: "Passed" },
    { age: 30, dateReached: "2020-05-14", status: "Passed" },
    { age: 40, dateReached: "2030-05-14", status: "Upcoming" },
    ...
  ]
}`,
      },
    ],
  },
  {
    module: "lib/facts",
    functions: [
      {
        name: "calculateFunFacts",
        signature: "calculateFunFacts(birthDate: string | Date, referenceDate?: string | Date): FunFactsResult",
        description: "Returns biological estimates — heartbeats, breaths, sleep hours — and the weekday you were born on.",
        example: `import { calculateFunFacts } from "@/lib/facts";

const result = calculateFunFacts("1990-05-14");

if (result.isValid) {
  console.log(result.estimatedHeartbeats); // e.g. 1,274,788,800
  console.log(result.estimatedBreaths);    // e.g. 291,149,568
  console.log(result.estimatedSleepHours); // e.g. 101,328
  console.log(result.birthWeekday);        // e.g. "Monday"
}`,
        successShape: `{
  isValid: true,
  birthDate: "1990-05-14",
  referenceDate: "2025-01-17",
  estimatedHeartbeats: 1274788800,
  estimatedBreaths: 291149568,
  estimatedSleepHours: 101328,
  birthWeekday: "Monday",
  assumptions: {
    heartRateBpm: 70,
    breathsPerMinute: 16,
    sleepHoursPerDay: 8
  }
}`,
      },
    ],
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800 p-4 text-sm text-slate-300 font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Nav />

      <section className="mx-auto max-w-4xl px-6 py-16 space-y-20">

        {/* Hero */}
        <div>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LifeSpan</h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Know Your Time</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            People Google "how many days have I been alive" millions of times a month. Every result is a 2009-era tool
            with ads, low contrast, and zero personality. LifeSpan is the answer those searches deserve — fast,
            accurate, shareable, and genuinely useful beyond a single number.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  {icon}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{title}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tech stack</h2>
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden">
            {stack.map(({ name, role }, i) => (
              <div
                key={name}
                className={`flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900/20 ${
                  i !== stack.length - 1 ? "border-b border-gray-200 dark:border-slate-700/50" : ""
                }`}
              >
                <p className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">API Reference</h2>
            <p className="text-gray-500 dark:text-slate-400">
              All calculation logic lives in <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded text-sm">lib/</code> as pure TypeScript functions — no framework dependencies, fully importable in any Node.js or edge environment.
            </p>
          </div>

          <div className="space-y-12">
            {apiEndpoints.map(({ module, functions }) => (
              <div key={module}>
                {/* Module header */}
                <div className="flex items-center gap-3 mb-6">
                  <code className="text-sm font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    {module}
                  </code>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                </div>

                <div className="space-y-8">
                  {functions.map((fn) => (
                    <div key={fn.name} className="rounded-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden">
                      {/* Function header */}
                      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700/50">
                        <p className="font-mono text-base font-bold text-gray-900 dark:text-white">{fn.name}</p>
                        <p className="mt-1 font-mono text-xs text-gray-500 dark:text-slate-400 break-all">{fn.signature}</p>
                      </div>

                      <div className="p-6 space-y-5 bg-white dark:bg-slate-900/20">
                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{fn.description}</p>

                        {/* Example */}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Example</p>
                          <CodeBlock code={fn.example} />
                        </div>

                        {/* Success response */}
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-2">Success response</p>
                          <CodeBlock code={fn.successShape} />
                        </div>

                        {/* Error response (only on calculateAge) */}
                        {"errorShape" in fn && fn.errorShape && (
                          <div>
                            <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">Error response</p>
                            <CodeBlock code={fn.errorShape} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Error handling note */}
          <div className="mt-8 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-5">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Error handling pattern</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed mb-3">
              Every function returns a discriminated union — always check <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">isValid</code> before accessing result fields. Errors carry a typed <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">error</code> code (<code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">"INVALID_DATE"</code> or <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">"FUTURE_DATE"</code>) plus a human-readable <code className="bg-amber-100 dark:bg-amber-500/20 px-1 rounded">message</code>.
            </p>
            <CodeBlock code={`const result = calculateAge(userInput);

if (!result.isValid) {
  // result.error  → "INVALID_DATE" | "FUTURE_DATE"
  // result.message → human-readable string
  showError(result.message);
  return;
}

// Safe to access result.years, result.months, etc.`} />
          </div>

          {/* Shareable URL pattern */}
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/30 p-5">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1">Shareable URL pattern</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
              Any valid ISO date maps to a permanent page with a dynamic OG image generated at the CDN edge.
            </p>
            <CodeBlock code={`// Page route
https://lifespan.app/age/1990-05-14

// Dynamic OG image (auto-generated)
https://lifespan.app/age/1990-05-14/opengraph-image`} />
          </div>
        </div>

        {/* Privacy note */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-6">
          <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Your data stays yours</h2>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
            LifeSpan stores nothing. All calculations happen entirely in your browser. Your birth date is never sent to
            any server — it only appears in the URL if you choose to share it.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pb-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center px-8 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
          >
            Calculate your age →
          </Link>
        </div>

      </section>
    </main>
  );
}
