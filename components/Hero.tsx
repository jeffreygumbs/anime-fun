import Image from "next/image";

const stats = [
  { value: "10k+", label: "Episodes cataloged" },
  { value: "9.2", label: "Top community score" },
  { value: "100%", label: "Free to explore" },
];

function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-hero-art bg-cover bg-center opacity-70 [mask-image:linear-gradient(100deg,transparent,black_38%,black_80%,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-ink/10"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent"
      />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 animate-glow rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 animate-glow rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-24 pt-16 sm:px-10 lg:min-h-[82vh] lg:flex-row lg:pt-20">
        <div className="flex flex-1 flex-col items-start gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent-soft" />
            Curated Anime Vault
          </span>

          <h1 className="font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Dive into the{" "}
            <span className="bg-linear-to-r from-accent-soft via-accent to-gold bg-clip-text text-transparent">
              best
            </span>{" "}
            of anime
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-white/60">
            Legendary series, community scores, and episode counts — all in one
            place. Scroll down and find your next obsession.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#explore"
              className="rounded-full bg-linear-to-r from-accent-soft to-accent px-8 py-3.5 font-bold shadow-xl shadow-accent/30 transition hover:scale-[1.03] hover:shadow-accent/50"
            >
              Explore the vault
            </a>
            <a
              href="#explore"
              className="rounded-full border border-white/15 px-8 py-3.5 font-bold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Top rated
            </a>
          </div>

          <dl className="flex gap-10 border-t border-white/10 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl font-bold text-white">
                  {stat.value}
                </dd>
                <dd className="text-sm text-white/50">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-0 m-auto size-3/4 animate-glow rounded-full bg-accent/20 blur-3xl" />
          <Image
            src="/anime.png"
            alt="Luffy artwork"
            width={1276}
            height={1164}
            priority
            className="relative mx-auto w-full max-w-lg animate-float drop-shadow-[0_35px_60px_rgba(238,30,56,0.35)]"
          />
        </div>
      </div>

      <a
        href="#explore"
        aria-label="Scroll to explore"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition hover:text-white sm:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
          Scroll
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4 animate-bounce"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" />
        </svg>
      </a>
    </header>
  );
}

export default Hero;
