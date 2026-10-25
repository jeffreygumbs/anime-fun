import AnimeGrid from "@/components/AnimeGrid";
import Hero from "@/components/Hero";
import { fetchAnime, fetchGenres } from "./action";

async function Home() {
  const [{ items, offline }, genres] = await Promise.all([
    fetchAnime(1),
    fetchGenres(),
  ]);
  return (
    <>
      <Hero />
      <section
        id="explore"
        className="flex scroll-mt-24 flex-col gap-10 px-6 py-16 sm:px-10"
      >
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-accent-soft">
            <span className="inline-block h-px w-8 bg-accent-soft" />
            The Vault
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore Anime
          </h2>
        </div>
        <AnimeGrid initial={items} initialOffline={offline} genres={genres} />
      </section>
    </>
  );
}

export default Home;
