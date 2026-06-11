import { calculateMilestones, type MilestoneStatus } from "@/lib/milestones";

type MilestoneTimelineProps = {
  birthDate: string;
};

const statusClassNames: Record<MilestoneStatus, string> = {
  Passed: "border-emerald-bright/40 bg-emerald-bright/10 text-emerald-glow",
  Upcoming: "border-[#2f7df6]/50 bg-[#2f7df6]/12 text-[#78aaff]",
  Future: "border-white/12 bg-white/[0.035] text-white/52",
};

const markerClassNames: Record<MilestoneStatus, string> = {
  Passed: "bg-emerald-bright shadow-[0_0_18px_rgba(16,185,129,0.38)]",
  Upcoming: "bg-[#2f7df6] shadow-[0_0_18px_rgba(47,125,246,0.48)]",
  Future: "bg-white/28",
};

export function MilestoneTimeline({ birthDate }: MilestoneTimelineProps) {
  const milestoneResult = birthDate ? calculateMilestones(birthDate) : null;

  return (
    <section
      aria-labelledby="milestone-heading"
      className="milestone-panel rounded-md border border-white/12 bg-[#05080c] p-4 shadow-[0_0_28px_rgba(47,125,246,0.08)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/42">
            lifespan milestones --ages 18,21,25,30,40,50,60,70
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white" id="milestone-heading">
            Milestone Timeline
          </h3>
        </div>
        <span className="w-fit rounded-sm border border-[#2f7df6]/40 bg-[#2f7df6]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#78aaff]">
          {milestoneResult?.isValid ? milestoneResult.referenceDate : "pending"}
        </span>
      </div>

      {!milestoneResult ? (
        <p className="mt-5 rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/58">
          Select a date of birth to generate your milestone timeline.
        </p>
      ) : null}

      {milestoneResult && !milestoneResult.isValid ? (
        <p className="mt-5 rounded-sm border border-[#d86a9f]/30 bg-[#281722] px-4 py-3 font-mono text-sm text-[#d86a9f]">
          error: {milestoneResult.message}
        </p>
      ) : null}

      {milestoneResult?.isValid ? (
        <ol className="relative mt-6 grid gap-3 md:grid-cols-2">
          {milestoneResult.milestones.map((milestone) => (
            <li
              className="relative overflow-hidden rounded-sm border border-white/10 bg-[#080d14] p-4"
              key={milestone.age}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${markerClassNames[milestone.status]}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-2xl font-semibold text-white">
                      {milestone.age}
                    </p>
                    <span
                      className={`rounded-sm border px-2 py-1 text-xs font-semibold ${statusClassNames[milestone.status]}`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white/62">
                    Date reached
                  </p>
                  <p className="mt-1 font-mono text-base text-emerald-glow">
                    {formatDisplayDate(milestone.dateReached)}
                  </p>
                </div>
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
