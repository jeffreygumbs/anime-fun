import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-32 text-center">
      <p className="font-display bg-linear-to-r from-accent-soft to-gold bg-clip-text text-8xl font-bold text-transparent">
        404
      </p>
      <p className="font-display text-2xl font-bold text-white">
        This anime doesn&apos;t exist in the vault
      </p>
      <Link
        href="/"
        className="rounded-full bg-linear-to-r from-accent-soft to-accent px-8 py-3 font-bold shadow-lg shadow-accent/25 transition hover:shadow-accent/40 hover:brightness-110"
      >
        Back home
      </Link>
    </div>
  );
}
