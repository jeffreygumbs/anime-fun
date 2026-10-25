"use client";

import { fetchAnime, type Genre } from "@/app/action";
import { useFavorites } from "@/lib/favorites";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimeCard, { AnimeProp } from "./AnimeCard";

const KINDS = [
  { value: "all", label: "All" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
];

const ORDERS = [
  { value: "popularity", label: "Most popular" },
  { value: "ranked", label: "Top rated" },
  { value: "aired_on", label: "Newest" },
  { value: "name", label: "A–Z" },
];

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function SkeletonCard() {
  return (
    <div className="w-full animate-pulse">
      <div className="aspect-3/4 w-full rounded-2xl bg-elevated" />
      <div className="mt-3 h-4 w-3/4 rounded bg-elevated" />
      <div className="mt-2 h-3 w-1/2 rounded bg-elevated" />
    </div>
  );
}

interface Props {
  initial: AnimeProp[];
  initialOffline: boolean;
  genres: Genre[];
}

function AnimeGrid({ initial, initialOffline, genres }: Props) {
  const [items, setItems] = useState(initial);
  const [offline, setOffline] = useState(initialOffline);
  const [page, setPage] = useState(2);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [order, setOrder] = useState("popularity");
  const [genre, setGenre] = useState<Genre | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const fetching = useRef(false);
  const mounted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const favorites = useFavorites();
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    let cancelled = false;
    setSearching(true);
    fetchAnime(1, { query: debouncedQuery, kind, order, genre }).then(
      ({ items, offline, hasMore }) => {
        if (cancelled) return;
        setItems(items);
        setOffline(offline);
        setPage(2);
        setHasMore(hasMore);
        setSearching(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, kind, order, genre]);

  useEffect(() => {
    if (
      !inView ||
      !hasMore ||
      searching ||
      showFavorites ||
      fetching.current
    ) {
      return;
    }
    fetching.current = true;
    fetchAnime(page, { query: debouncedQuery, kind, order, genre }).then(
      ({ items, offline, hasMore: more }) => {
        setItems((prev) => {
          const seen = new Set(prev.map((item) => String(item.id)));
          return [
            ...prev,
            ...items.filter((item) => !seen.has(String(item.id))),
          ];
        });
        setOffline(offline);
        setPage((p) => p + 1);
        if (!more) setHasMore(false);
        fetching.current = false;
      }
    );
  }, [
    inView,
    hasMore,
    searching,
    showFavorites,
    page,
    debouncedQuery,
    kind,
    order,
    genre,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visible = showFavorites
    ? items.filter((item) => favorites.has(String(item.id)))
    : items;

  const chipClass = (activeState: boolean) =>
    `rounded-full px-4 py-1.5 text-xs font-bold transition ${
      activeState
        ? "bg-linear-to-r from-accent-soft to-accent text-white shadow-md shadow-accent/25"
        : "bg-surface text-white/50 hover:bg-elevated hover:text-white"
    }`;

  return (
    <div className="flex flex-col gap-6">
      {offline && (
        <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
            />
          </svg>
          The anime API is offline right now — showing sample data.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime…"
            className="w-full rounded-full border border-white/10 bg-surface py-3 pl-11 pr-16 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
          <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-white/40">
            ⌘K
          </kbd>
        </div>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          aria-label="Sort by"
          className="cursor-pointer rounded-full border border-white/10 bg-surface px-4 py-3 text-sm font-semibold text-white/70 outline-none transition focus:border-accent/60"
        >
          {ORDERS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowFavorites((v) => !v)}
          aria-pressed={showFavorites}
          className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
            showFavorites
              ? "border-accent/60 bg-accent/15 text-accent-soft"
              : "border-white/10 bg-surface text-white/60 hover:text-white"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={showFavorites ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.3 6.3a4.5 4.5 0 0 1 6.4 0L12 7.6l1.3-1.3a4.5 4.5 0 1 1 6.4 6.4l-7.7 7.7-7.7-7.7a4.5 4.5 0 0 1 0-6.4Z"
            />
          </svg>
          Favorites
        </button>

        <p className="ml-auto text-sm text-white/40">
          {searching
            ? "Searching…"
            : `${visible.length} title${visible.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => setKind(k.value)}
            className={chipClass(kind === k.value)}
          >
            {k.label}
          </button>
        ))}
        {genres.length > 0 && <span className="mx-2 h-4 w-px bg-white/10" />}
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setGenre(genre?.name === g.name ? null : g)}
            className={chipClass(genre?.name === g.name)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {visible.length === 0 && !searching ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="font-display text-xl font-bold text-white">
            Nothing found
          </p>
          <p className="text-sm text-white/50">
            {showFavorites
              ? "No favorites yet — tap the heart on any card."
              : `No anime matches “${debouncedQuery}”. Try a different search.`}
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
          {searching &&
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
        </section>
      )}

      {hasMore && !searching && !showFavorites && (
        <div ref={ref} className="flex w-full justify-center py-4">
          <Image
            src="/spinner.svg"
            alt="Loading more anime"
            width={48}
            height={48}
            className="animate-spin"
          />
        </div>
      )}
    </div>
  );
}

export default AnimeGrid;
