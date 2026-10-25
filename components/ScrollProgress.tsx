"use client";

import { useEffect, useState } from "react";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-accent-soft via-accent to-gold"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

export default ScrollProgress;
