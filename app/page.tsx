type Benefit = {
  title: string;
  value: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    title: "Exact age",
    value: "29y 4m 12d",
    description: "A precise snapshot of elapsed time.",
  },
  {
    title: "Life progress",
    value: "36.8%",
    description: "A clear view of your long-term timeline.",
  },
  {
    title: "Milestones",
    value: "8 tracked",
    description: "Key moments surfaced at a glance.",
  },
  {
    title: "Birthday countdown",
    value: "142 days",
    description: "Know what is coming next.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 text-white sm:px-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl content-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-glow">
            LifeSpan
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
            Know Your Time
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            Every second is a stat. Make it count.
          </p>

          <form className="mt-9 max-w-xl rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-glow backdrop-blur sm:flex sm:items-end sm:gap-3">
            <label className="block flex-1">
              <span className="mb-2 block text-sm font-medium text-white/72">
                Date of birth
              </span>
              <input
                aria-label="Date of birth"
                className="h-12 w-full rounded-md border border-white/12 bg-midnight-soft px-4 text-base text-white outline-none transition placeholder:text-white/36 focus:border-emerald-bright focus:ring-2 focus:ring-emerald-bright/25"
                name="birthDate"
                type="date"
              />
            </label>
            <button
              className="mt-3 h-12 w-full rounded-md bg-emerald-bright px-5 text-sm font-semibold text-[#04111f] transition hover:bg-emerald-glow focus:outline-none focus:ring-2 focus:ring-emerald-glow focus:ring-offset-2 focus:ring-offset-midnight sm:mt-0 sm:w-auto"
              type="button"
            >
              Calculate
            </button>
          </form>
        </div>

        <section
          aria-label="LifeSpan benefits"
          className="grid gap-3 sm:grid-cols-2 lg:gap-4"
        >
          {benefits.map((benefit) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur"
              key={benefit.title}
            >
              <p className="text-sm font-medium text-white/60">{benefit.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-normal text-white">
                {benefit.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {benefit.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
