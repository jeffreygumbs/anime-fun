import Image from "next/image";

const socials = [
  { name: "TikTok", src: "/tiktok.svg" },
  { name: "Instagram", src: "/instagram.svg" },
  { name: "Twitter", src: "/twitter.svg" },
];

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/50">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Anime Vault logo" width={34} height={32} />
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold">
              Anime<span className="text-accent-soft">Vault</span>
            </span>
            <span className="text-xs text-white/40">
              © 2023 — Your favorite anime, all in one place.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {socials.map((social) => (
            <a
              key={social.name}
              href="#"
              aria-label={social.name}
              className="opacity-60 transition hover:scale-110 hover:opacity-100"
            >
              <Image
                src={social.src}
                alt={social.name}
                width={18}
                height={18}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
