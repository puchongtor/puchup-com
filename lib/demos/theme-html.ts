/**
 * Compatibility shim — Project ONE themes now live in lib/project-one/html.ts
 */
export {
  hasDemoTheme as hasLiveTheme,
  loadDemoTheme as loadThemeHtml,
  rewriteProjectOneHtml as rewriteThemeHtml,
  canonicalDemoSlug,
} from "@/lib/project-one/html";
