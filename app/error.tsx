"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="font-display text-5xl font-bold text-white">
        Something went wrong
      </p>
      <p className="max-w-md text-white/50">
        The vault hit a snag loading this page. Give it another shot.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-linear-to-r from-accent-soft to-accent px-8 py-3 font-bold shadow-lg shadow-accent/25 transition hover:shadow-accent/40 hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
