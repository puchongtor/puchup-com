import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import { sanityFetch } from "@/lib/sanity/client";
import { imageUrl } from "@/lib/sanity/image";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/lib/sanity/types";
import { site } from "@/lib/site";
import "./globals.css";

const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-thai",
  display: "swap",
});

const ibmSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-sans",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
    revalidate: 3600,
  });

  const favicon = imageUrl(settings?.favicon, 64) || "/favicon.svg";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: settings?.seo?.metaTitle || `${site.name} — ${site.tagline}`,
      template: `%s — ${settings?.siteName || site.name}`,
    },
    description: settings?.seo?.metaDescription || site.description,
    icons: { icon: favicon },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="th"
      className={`${ibmThai.variable} ${ibmSans.variable} ${ibmMono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
