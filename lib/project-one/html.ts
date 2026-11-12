import "server-only";
import { existsSync, readFileSync } from "fs";
import path from "path";
import {
  DEMO_THEME_FILES,
  PROJECT_ONE_PAGES,
  canonicalDemoSlug,
  type ProjectOnePageKey,
} from "@/lib/project-one/slugs";
import {
  buildDemoJsonLd,
  demoSeoDescription,
  demoSeoTitle,
  getDemoSeo,
} from "@/lib/project-one/seo";
import { buildProjectOneSiteFooterHtml } from "@/lib/project-one/site-footer-html";
import { site } from "@/lib/site";

export {
  DEMO_THEME_FILES,
  DEMO_SLUG_ALIASES,
  PROJECT_ONE_PAGES,
  allDemoSlugs,
  canonicalDemoSlug,
  hasDemoTheme,
  type ProjectOnePageKey,
} from "@/lib/project-one/slugs";

const ROOT = path.join(process.cwd(), "content", "project-one");

function readUtf8(full: string): string | null {
  if (!existsSync(full)) return null;
  return readFileSync(full, "utf8");
}

type RewriteOptions = {
  /** Theme slug — enables sticky demo ribbon + in-document SEO */
  demoSlug?: string;
  /** Inject scrollable site-nav footer (same links as homepage, Project ONE palette) */
  siteFooter?: "marketing" | "demo";
};

function stripLegacyDemoBars(html: string): string {
  // Drop old thin top notices so we don't stack two banners
  return html.replace(
    /(<body[^>]*>)(\s*)([\s\S]{0,2500})/i,
    (full, bodyTag: string, ws: string, headChunk: string) => {
      const cleaned = headChunk.replace(
        /<div[^>]*>[\s\S]*?(?:PUCHUP[\s\S]{0,200}?(?:DEMO|ตัวอย่าง)|TOP BAR[\s\S]{0,80}?DEMO)[\s\S]*?<\/div>\s*/i,
        "",
      );
      return `${bodyTag}${ws}${cleaned}`;
    },
  );
}

function injectDemoSeoHead(html: string, slug: string): string {
  const profile = getDemoSeo(slug);
  if (!profile) return html;
  const canonical = canonicalDemoSlug(slug);
  const path = `/ProjectONE/${canonical}/`;
  const url = new URL(path, site.url).toString();
  const title = demoSeoTitle(profile);
  const description = demoSeoDescription(profile);
  const keywords = profile.keywords.join(", ");
  const jsonLd = buildDemoJsonLd(slug);

  const tags = `
<title>${title}</title>
<meta name="description" content="${description.replace(/"/g, "&quot;")}">
<meta name="keywords" content="${keywords.replace(/"/g, "&quot;")}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="th_TH">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title.replace(/"/g, "&quot;")}">
<meta property="og:description" content="${description.replace(/"/g, "&quot;")}">
<meta property="og:site_name" content="PuchUp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}">
<meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
`;

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/gi, "");
  out = out.replace(/<meta\s+name=["']description["'][^>]*>/gi, "");
  out = out.replace(/<meta\s+name=["']keywords["'][^>]*>/gi, "");
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
  out = out.replace(/<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<head([^>]*)>/i, `<head$1>${tags}`);
  return out;
}

/**
 * Rewrite Gemini static HTML so it works under Next static export:
 * - images → /images/project-one/
 * - *.html links → /ProjectONE/.../
 * - keep tel:/LINE/maps absolute as-is (conversion CTAs)
 * - theme pages: sticky demo ribbon + local SEO head tags
 */
export function rewriteProjectOneHtml(html: string, options: RewriteOptions = {}): string {
  let out = html;

  if (options.demoSlug) {
    out = injectDemoSeoHead(out, options.demoSlug);
  }

  // Ensure srcDoc iframe resolves /assets against site origin
  if (!/<base\s/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, '<head$1><base href="/" />');
  }

  // Hash-only links + <base href="/"> would resolve to /#section (leave the page).
  // Keep in-page scroll inside the srcDoc document instead.
  out = out.replace(
    /href=(["'])(#[A-Za-z][\w:-]*)\1/gi,
    (_m, q: string, hash: string) =>
      `href=${q}${hash}${q} onclick="event.preventDefault();document.querySelector('${hash}')?.scrollIntoView({behavior:'smooth',block:'start'});"`,
  );

  // Asset paths
  out = out.replace(/(src|href)=(["'])\.\/images\//gi, "$1=$2/images/project-one/");
  out = out.replace(/(src|href)=(["'])images\//gi, "$1=$2/images/project-one/");
  out = out.replace(/(src|href)=(["'])\.\/logo\./gi, "$1=$2/images/project-one/logo.");

  // Marketing pages
  out = out.replace(/href=(["'])index\.html(#[^"']*)?\1/gi, "href=$1/ProjectONE/$2$1");
  out = out.replace(/href=(["'])demo\.html(#[^"']*)?\1/gi, "href=$1/ProjectONE/demo/$2$1");
  out = out.replace(
    /href=(["'])google-business-profile\.html(#[^"']*)?\1/gi,
    "href=$1/ProjectONE/google/$2$1",
  );

  // Store demos: restaurant.html → /ProjectONE/restaurant/
  for (const slug of Object.keys(DEMO_THEME_FILES)) {
    const file = `${slug}.html`;
    const re = new RegExp(
      `href=(["'])${file.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(#[^"']*)?\\1`,
      "gi",
    );
    out = out.replace(re, `href=$1/ProjectONE/${slug}/$2$1`);
  }

  // JS catalog in demo.html uses file: 'restaurant.html'
  out = out.replace(
    /file:\s*'([a-z0-9-]+)\.html'/gi,
    (_m, base: string) => {
      const slug = canonicalDemoSlug(base);
      return `file: '/ProjectONE/${slug}/'`;
    },
  );
  out = out.replace(
    /file:\s*"([a-z0-9-]+)\.html"/gi,
    (_m, base: string) => {
      const slug = canonicalDemoSlug(base);
      return `file: "/ProjectONE/${slug}/"`;
    },
  );

  // img paths inside JS strings
  out = out.replace(/'\.\/images\//g, "'/images/project-one/");
  out = out.replace(/"\.\/images\//g, '"/images/project-one/');

  // Showroom cards built in JS — break out of ThemeDocument iframe
  out = out.replace(
    /href="\$\{item\.file\}"/g,
    'href="${item.file}" target="_top"',
  );

  // In-app routes must navigate the top window (not nest iframes)
  out = out.replace(
    /href=(["'])(\/ProjectONE\/[^"']*)\1(?![^>]*target=)/gi,
    'href=$1$2$1 target="_top"',
  );

  if (options.demoSlug) {
    // Parent React chrome owns the sticky banner — strip thin legacy bars
    out = stripLegacyDemoBars(out);
  }

  if (options.siteFooter) {
    // Drop prototype footers, then append scrollable site-nav footer
    out = out.replace(/<footer\b[\s\S]*?<\/footer>/gi, "");
    const footer = buildProjectOneSiteFooterHtml(options.siteFooter);
    if (/<\/body>/i.test(out)) {
      out = out.replace(/<\/body>/i, `${footer}</body>`);
    } else {
      out += footer;
    }
  }

  return out;
}

export function loadProjectOnePage(page: ProjectOnePageKey): string | null {
  const file = PROJECT_ONE_PAGES[page];
  const full = path.join(ROOT, "pages", file);
  const raw = readUtf8(full);
  return raw ? rewriteProjectOneHtml(raw, { siteFooter: "marketing" }) : null;
}

export function loadDemoTheme(slug: string): string | null {
  const canonical = canonicalDemoSlug(slug);
  const file = DEMO_THEME_FILES[canonical];
  if (!file) return null;
  const full = path.join(ROOT, "themes", file);
  const raw = readUtf8(full);
  return raw
    ? rewriteProjectOneHtml(raw, { demoSlug: canonical, siteFooter: "demo" })
    : null;
}
