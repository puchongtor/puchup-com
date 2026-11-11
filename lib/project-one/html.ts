import "server-only";
import { existsSync, readFileSync } from "fs";
import path from "path";
import {
  DEMO_THEME_FILES,
  PROJECT_ONE_PAGES,
  canonicalDemoSlug,
  type ProjectOnePageKey,
} from "@/lib/project-one/slugs";

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

/**
 * Rewrite Gemini static HTML so it works under Next static export:
 * - images → /images/project-one/
 * - *.html links → /ProjectONE/.../
 * - keep tel:/LINE/maps absolute as-is (conversion CTAs)
 */
export function rewriteProjectOneHtml(html: string): string {
  let out = html;

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

  return out;
}

export function loadProjectOnePage(page: ProjectOnePageKey): string | null {
  const file = PROJECT_ONE_PAGES[page];
  const full = path.join(ROOT, "pages", file);
  const raw = readUtf8(full);
  return raw ? rewriteProjectOneHtml(raw) : null;
}

export function loadDemoTheme(slug: string): string | null {
  const canonical = canonicalDemoSlug(slug);
  const file = DEMO_THEME_FILES[canonical];
  if (!file) return null;
  const full = path.join(ROOT, "themes", file);
  const raw = readUtf8(full);
  return raw ? rewriteProjectOneHtml(raw) : null;
}
