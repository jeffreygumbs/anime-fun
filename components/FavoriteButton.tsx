"use client";

import { toggleFavorite, useFavorites } from "@/lib/favorites";

interface Props {
  id: string | number;
  className?: string;
}

function FavoriteButton({ id, className = "" }: Props) {
  const favorites = useFavorites();
  const active = favorites.has(String(id));

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      className={`flex items-center justify-center rounded-full backdrop-blur-md transition active:scale-90 ${
        active
          ? "bg-accent/80 text-white"
          : "bg-black/50 text-white/70 hover:text-accent-soft"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
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
    </button>
  );
}

export default FavoriteButton;
