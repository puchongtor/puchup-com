import { existsSync, readFileSync } from "fs";
import path from "path";
import { canonicalDemoSlug } from "@/lib/demos/showroom-catalog";

/** Canonical slug → HTML filename in content/project-one/themes */
const THEME_FILES: Record<string, string> = {
  baankhaokhom: "restaurant.html",
  baanfundee: "baanfundee.html",
  "baan-bangkok": "baan-bangkok.html",
  "paw-and-co": "paw-and-co.html",
  "petal-stem-florist": "petal-stem-florist.html",
  projectone: "projectone.html",
};

export function hasLiveTheme(slug: string): boolean {
  return Boolean(THEME_FILES[canonicalDemoSlug(slug)]);
}

export function loadThemeHtml(slug: string): string | null {
  const canonical = canonicalDemoSlug(slug);
  const file = THEME_FILES[canonical];
  if (!file) return null;
  const full = path.join(process.cwd(), "content", "project-one", "themes", file);
  if (!existsSync(full)) return null;
  return rewriteThemeHtml(readFileSync(full, "utf8"), canonical);
}

/**
 * Point Unsplash URLs at public/images/demos/[slug]/photo-{id}.webp
 * so generated WebP can drop in. Missing files fall back to Unsplash at runtime.
 */
export function rewriteThemeHtml(html: string, slug: string): string {
  let out = html;

  out = out.replace(/href="demo\.html"/g, 'href="/demo/"');
  out = out.replace(/href="index\.html[^"]*"/g, 'href="/ProjectONE/"');
  out = out.replace(/href="restaurant\.html"/g, 'href="/ProjectONE/baankhaokhom/"');
  out = out.replace(/href="projectone\.html"/g, 'href="/ProjectONE/"');

  out = out.replace(
    /https:\/\/images\.unsplash\.com\/photo-([a-z0-9-]+)(\?[^"'\\\s]*)?/gi,
    `/images/demos/${slug}/photo-$1.webp`,
  );

  const fallbackScript = `
<script>
(function () {
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG") return;
    var src = img.getAttribute("src") || "";
    var m = src.match(/\\/images\\/demos\\/[^/]+\\/(photo-[^/.]+)\\.(webp|png)$/i);
    if (!m || img.getAttribute("data-demo-fallback") === "1") return;
    img.setAttribute("data-demo-fallback", "1");
    img.src = "https://images.unsplash.com/" + m[1] + "?auto=format&fit=crop&w=1200&q=80";
  }, true);
})();
</script>`;

  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${fallbackScript}</body>`);
  } else {
    out += fallbackScript;
  }

  return out;
}
