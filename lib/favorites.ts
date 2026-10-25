"use client";

import { useSyncExternalStore } from "react";

const KEY = "anime-vault:favorites";
const EMPTY: ReadonlySet<string> = new Set();

let favorites = new Set<string>();
const listeners = new Set<() => void>();
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) favorites = new Set(JSON.parse(raw) as string[]);
  } catch {
    favorites = new Set();
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...favorites]));
  } catch {
    // storage unavailable — favorites stay in memory
  }
}

export function toggleFavorite(id: string | number) {
  hydrate();
  const key = String(id);
  if (favorites.has(key)) {
    favorites.delete(key);
  } else {
    favorites.add(key);
  }
  favorites = new Set(favorites);
  persist();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ReadonlySet<string> {
  hydrate();
  return favorites;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
