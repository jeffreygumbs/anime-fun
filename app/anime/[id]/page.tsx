import { fetchAnimeById } from "@/app/action";
import FavoriteButton from "@/components/FavoriteButton";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const imageUrl = (original: string) =>
  original.startsWith("http")
    ? original
    : `https://shikimori.one${original}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anime = await fetchAnimeById(id);
  return {
    title: anime
      ? `${anime.name.replace(/_/g, " ")} — Anime Vault`
      : "Anime Vault",
  };
}

export default async function AnimePage({ params }: Props) {
  const { id } = await params;
  const anime = await fetchAnimeById(id);
  if (!anime) notFound();

  const title = anime.name.replace(/_/g, " ");
  const poster = imageUrl(anime.image.original);
  const episodeCount = anime.episodes || anime.episodes_aired;
  const year = anime.aired_on ? new Date(anime.aired_on).getFullYear() : null;
  const kind = anime.kind.replace(/_/g, " ");
  const backdrop = anime.banner
    ? imageUrl(anime.banner)
    : poster;

  return (
    <article className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={backdrop}
          alt=""
          fill
          aria-hidden
          className={
            anime.banner
              ? "object-cover opacity-30"
              : "scale-110 object-cover opacity-20 blur-3xl"
          }
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink/40 via-ink/80 to-ink" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:px-10">
        <Link
          href="/#explore"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
          >
            <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" />
          </svg>
          Back to the vault
        </Link>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="relative aspect-3/4 w-full max-w-xs shrink-0 self-start overflow-hidden rounded-2xl bg-elevated ring-1 ring-white/15">
            {anime.image.original && (
              <Image
                src={poster}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80 backdrop-blur">
                {kind}
              </span>
              {anime.status && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80 backdrop-blur">
                  {anime.status}
                </span>
              )}
              {year && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
                  {year}
                </span>
              )}
              {anime.rating && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
                  {anime.rating}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold capitalize leading-tight tracking-tight sm:text-6xl">
              {title}
            </h1>
            {anime.japanese && (
              <p className="-mt-4 font-display text-lg text-white/40">
                {anime.japanese}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 text-gold"
                >
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
                </svg>
                <span className="font-display text-2xl font-bold text-gold">
                  {anime.score}
                </span>
                <span className="text-sm text-white/40">/ 10</span>
              </span>
              <span className="text-white/60">
                {episodeCount
                  ? `${episodeCount} episode${episodeCount === 1 ? "" : "s"}`
                  : "TBA"}
              </span>
              <FavoriteButton id={anime.id} className="size-11" />
              {anime.trailerUrl && (
                <a
                  href={anime.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white/80 transition hover:border-accent-soft hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                  Watch trailer
                </a>
              )}
            </div>

            {anime.description ? (
              <p className="max-w-2xl leading-relaxed text-white/60">
                {anime.description}
              </p>
            ) : (
              <p className="max-w-2xl leading-relaxed text-white/40">
                No synopsis available for this title yet.
              </p>
            )}

            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/60"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
