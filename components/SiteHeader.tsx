"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandWordmark, LogoMark } from "./Logo";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cream/80 bg-base/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <BrandWordmark />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[14.5px] font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact/"
          className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-navy px-4 py-2.5 text-[13.5px] font-semibold text-base transition-opacity hover:opacity-90 md:inline-flex"
        >
          {site.cta.primary}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink lg:hidden"
          aria-label="เมนู"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-4 border-t border-cream bg-base px-5 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-[14px] font-semibold text-base"
            onClick={() => setOpen(false)}
          >
            {site.cta.primary}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
