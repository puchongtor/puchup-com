import Link from "next/link";
import { BrandWordmark, LogoMark } from "./Logo";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-base/90">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-xs">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" light />
              <BrandWordmark light />
            </Link>
            <p className="text-sm leading-relaxed text-base/60">
              PuchUp สร้างระบบผู้ช่วยธุรกิจ
              <br />
              เว็บไซต์และระบบดิจิทัลที่ช่วยให้ธุรกิจทำงานง่ายขึ้น
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-[11px] uppercase text-base/40">Site</span>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-base/70 hover:text-base">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-[11px] uppercase text-base/40">Company</span>
              <Link href="/about/" className="text-base/70 hover:text-base">
                About
              </Link>
              <Link href="/contact/" className="text-base/70 hover:text-base">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-base/10 pt-6 text-xs text-base/40 sm:flex-row">
          <span>© {site.year} PuchUp. Demo #00 — เว็บไซต์นี้คือหลักฐานของสิ่งที่ PuchUp สร้างได้</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
