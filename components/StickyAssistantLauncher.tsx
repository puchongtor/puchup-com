"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyAssistantLauncher() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const hero = document.querySelector<HTMLElement>("[data-hero-navy]");
      if (!hero) return;
      setShow(hero.getBoundingClientRect().bottom < 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/#assistant"
      className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-[13.5px] font-semibold text-base shadow-xl transition hover:opacity-90"
    >
      <span className="grad-ring flex h-7 w-7 items-center justify-center rounded-full text-[11px] text-white">
        P
      </span>
      เปิด Assistant
    </Link>
  );
}
