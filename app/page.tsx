export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-emerald-glow">
            LifeSpan
          </p>
          <h1 className="text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">
            Your time, made visible.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            A premium, modern foundation for a focused life timeline
            experience.
          </p>
          <div className="mt-9 h-1 w-24 rounded-full bg-emerald-bright shadow-glow" />
        </div>
      </section>
    </main>
  );
}
