import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Anime Vault",
  description: "Your favorite anime, all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-ink font-sans text-white antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
