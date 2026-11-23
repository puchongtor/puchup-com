"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brandAssets } from "./Logo";
import { navLinks, site, type NavLink } from "@/lib/site";

function DesktopNavItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!link.children?.length) {
    return (
      <Link
        href={link.href}
        className="whitespace-nowrap text-[13.5px] font-medium text-muted transition-colors hover:text-ink xl:text-[14.5px]"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 whitespace-nowrap text-[13.5px] font-medium text-muted transition-colors hover:text-ink xl:text-[14.5px]"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 pt-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-2 shadow-lg shadow-navy/10 backdrop-blur-md">
            <Link
              href={link.href}
              className="block rounded-xl px-3 py-2 text-[12px] font-semibold text-apurple transition hover:bg-cream/80"
              onClick={() => setOpen(false)}
            >
              ไปหน้า {link.label} →
            </Link>
            <ul className="mt-0.5 space-y-0.5">
              {link.children.map((child) => {
                const ChildLink = child.href.includes("#") ? "a" : Link;
                return (
                <li key={child.href + child.label}>
                  <ChildLink
                    href={child.href}
                    className="block rounded-xl px-3 py-2.5 transition hover:bg-cream/80"
                    onClick={() => setOpen(false)}
                  >
                    <span className="block text-[13.5px] font-semibold text-ink">{child.label}</span>
                    {child.note ? (
                      <span className="mt-0.5 block text-[12px] text-muted">{child.note}</span>
                    ) : null}
                  </ChildLink>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 md:px-8 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src={brandAssets.horizontalLight}
            alt="PuchUp — Level up your business & life"
            width={220}
            height={56}
            className="h-10 w-auto object-contain object-left sm:h-11"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => (
            <DesktopNavItem key={link.href + link.label} link={link} />
          ))}
        </nav>
        <Link
          href="/contact/"
          className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-navy px-4 py-2.5 text-[13.5px] font-semibold text-base transition-opacity hover:opacity-90 sm:inline-flex"
        >
          {site.cta.primary}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-1 border-t border-cream bg-base px-5 py-3 lg:hidden">
          {navLinks.map((link) =>
            link.children?.length ? (
              <div key={link.href + link.label} className="border-b border-cream/80 py-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2.5 text-left text-[15px] font-semibold text-ink"
                  aria-expanded={expanded === link.label}
                  onClick={() => setExpanded((v) => (v === link.label ? null : link.label))}
                >
                  {link.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className={`text-muted transition ${expanded === link.label ? "rotate-180" : ""}`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {expanded === link.label ? (
                  <div className="space-y-1 pb-3 pl-1">
                    <Link
                      href={link.href}
                      className="block rounded-lg py-2 text-[13px] font-medium text-apurple"
                      onClick={() => setOpen(false)}
                    >
                      ไปหน้า {link.label} →
                    </Link>
                    {link.children.map((child) => {
                      const ChildLink = child.href.includes("#") ? "a" : Link;
                      return (
                      <ChildLink
                        key={child.href + child.label}
                        href={child.href}
                        className="block rounded-lg py-2"
                        onClick={() => setOpen(false)}
                      >
                        <span className="block text-[14.5px] font-medium text-ink">{child.label}</span>
                        {child.note ? (
                          <span className="mt-0.5 block text-[12px] text-muted">{child.note}</span>
                        ) : null}
                      </ChildLink>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="py-2.5 text-[15px] font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            href="/contact/"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-[14px] font-semibold text-base"
            onClick={() => setOpen(false)}
          >
            {site.cta.primary}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
