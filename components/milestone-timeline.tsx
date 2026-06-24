import { calculateMilestones, type MilestoneStatus } from "@/lib/milestones";

type MilestoneTimelineProps = {
  birthDate: string;
};

const statusClassNames: Record<MilestoneStatus, string> = {
  Passed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Upcoming: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  Future: "border-slate-600/30 bg-slate-600/10 text-slate-400",
};

const markerClassNames: Record<MilestoneStatus, string> = {
  Passed: "bg-emerald-500 shadow-lg shadow-emerald-500/30",
  Upcoming: "bg-indigo-500 shadow-lg shadow-indigo-500/30",
  Future: "bg-slate-500",
};

export function MilestoneTimeline({ birthDate }: MilestoneTimelineProps) {
  const milestoneResult = birthDate ? calculateMilestones(birthDate) : null;

  return (
    <section className="card-enter rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6 transition-all hover:bg-slate-800/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Milestone Timeline</h3>
          <p className="mt-2 text-sm text-slate-400">
            Major life milestones and their significance
          </p>
        </div>
        <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 font-mono text-sm font-medium text-indigo-300">
          {milestoneResult?.isValid ? milestoneResult.referenceDate : "Select date"}
        </span>
      </div>

      {!milestoneResult ? (
        <p className="rounded-lg border border-slate-700/30 bg-slate-800/20 px-4 py-3 text-sm text-slate-300">
          Select a date of birth to generate your milestone timeline.
        </p>
      ) : null}

      {milestoneResult && !milestoneResult.isValid ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {milestoneResult.message}
        </p>
      ) : null}

      {milestoneResult?.isValid ? (
        <ol className="grid gap-4 md:grid-cols-2">
          {milestoneResult.milestones.map((milestone) => (
            <li
              className="flex items-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/20 p-4 transition-all hover:bg-slate-800/40"
              key={milestone.age}
            >
              <span
                aria-hidden="true"
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${markerClassNames[milestone.status]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-2xl font-bold text-white">
                    {milestone.age}
                  </p>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${statusClassNames[milestone.status]}`}
                  >
                    {milestone.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  Date reached
                </p>
                <p className="mt-1 font-mono text-base text-emerald-400">
                  {formatDisplayDate(milestone.dateReached)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function formatDisplayDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00.000Z`));
}