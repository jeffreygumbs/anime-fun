import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { MotionDiv } from "./MotionDiv";

export interface AnimeProp {
  id: string | number;
  name: string;
  image: {
    original: string;
  };
  kind: string;
  episodes: number;
  episodes_aired: number;
  score: string;
}

interface Prop {
  anime: AnimeProp;
  index: number;
}

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function AnimeCard({ anime, index }: Prop) {
  const imageUrl = anime.image.original.startsWith("http")
    ? anime.image.original
    : `https://shikimori.one${anime.image.original}`;
  const title = anime.name.replace(/_/g, " ");
  const kind = anime.kind.replace(/_/g, " ");
  const episodeCount = anime.episodes || anime.episodes_aired;

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: (index % 8) * 0.06,
        ease: "easeOut",
        duration: 0.45,
      }}
      whileHover={{ y: -6 }}
      className="group w-full"
    >
      <Link
        href={`/anime/${anime.id}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-2xl"
      >
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 group-hover:ring-white/25">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-transparent to-ink/10 opacity-70 transition duration-500 group-hover:opacity-90" />

          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/90 backdrop-blur-md">
            {kind}
          </div>

          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 backdrop-blur-md">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-3.5 text-gold"
            >
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
            </svg>
            <span className="text-xs font-bold text-gold">{anime.score}</span>
          </div>

          <FavoriteButton
            id={anime.id}
            className="absolute bottom-3 right-3 size-9"
          />

          <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 pr-10 text-xs font-semibold text-white/80 opacity-0 transition duration-500 group-hover:opacity-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9v6M12 9v6M17 9v6" />
            </svg>
            {episodeCount ? `${episodeCount} episodes` : "TBA"}
          </div>
        </div>

        <div className="flex flex-col gap-1 px-1 pt-3">
          <h2 className="line-clamp-1 font-display text-lg font-bold capitalize text-white transition group-hover:text-accent-soft">
            {title}
          </h2>
          <p className="text-sm text-white/40">
            {episodeCount ? `${episodeCount} episodes` : "TBA"} · {kind}
          </p>
        </div>
      </Link>
    </MotionDiv>
  );
}

export default AnimeCard;
