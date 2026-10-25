import Image from "next/image";
import ScrollProgress from "./ScrollProgress";

const links = [
  { label: "Catalog", href: "#explore" },
  { label: "Top Rated", href: "#explore" },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <ScrollProgress />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <a href="#" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Anime Vault logo" width={36} height={34} />
          <span className="font-display text-xl font-bold tracking-tight">
            Anime<span className="text-accent-soft">Vault</span>
          </span>
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hidden text-sm font-semibold text-white/70 transition hover:text-white sm:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#explore"
            className="rounded-full bg-linear-to-r from-accent-soft to-accent px-5 py-2 text-sm font-bold shadow-lg shadow-accent/25 transition hover:shadow-accent/40 hover:brightness-110"
          >
            Browse
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
