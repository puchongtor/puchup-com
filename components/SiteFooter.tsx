import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "./Logo";
import { catalogProducts, navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-0 bg-navy text-base/90">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:px-8 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-md">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src={brandAssets.horizontalDark}
                alt="PuchUp — Level up your business & life"
                width={640}
                height={214}
                className="h-[5.75rem] w-auto max-w-[min(100%,22rem)] object-contain object-left md:h-[6.75rem] md:max-w-[26rem]"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-base/60">
              {site.tagline}
              <br />
              เว็บไซต์และระบบดิจิทัลที่ช่วยธุรกิจทำงานง่ายขึ้น
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-[11px] uppercase text-base/40">Menu</span>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-base/70 hover:text-base">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:col-span-2">
              <span className="eyebrow text-[11px] uppercase text-base/40">Products</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {catalogProducts.map((p) => (
                  <Link key={p.id} href={p.href} className="text-base/70 hover:text-base">
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-base/10 pt-6 text-xs text-base/40 sm:flex-row">
          <span>© {site.year} PuchUp</span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
