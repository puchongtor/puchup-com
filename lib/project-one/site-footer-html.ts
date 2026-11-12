import { catalogProducts, navLinks, site } from "@/lib/site";

/**
 * Same link structure as the main SiteFooter, but Project ONE warm palette.
 * Injected into srcDoc so it scrolls with the page (never viewport-locked).
 */
export function buildProjectOneSiteFooterHtml(variant: "marketing" | "demo" = "marketing"): string {
  const menu = navLinks
    .map(
      (l) =>
        `<a href="${l.href}" target="_top" class="po-sf-link">${escapeHtml(l.label)}</a>`,
    )
    .join("\n");

  const products = catalogProducts
    .map(
      (p) =>
        `<a href="${p.href}" target="_top" class="po-sf-link">${escapeHtml(p.name)}</a>`,
    )
    .join("\n");

  const isDemo = variant === "demo";
  const bg = isDemo ? "#0c1222" : "#0d182c";
  const muted = isDemo ? "rgba(245,244,242,0.55)" : "rgba(250,248,245,0.55)";
  const soft = isDemo ? "rgba(245,244,242,0.72)" : "rgba(250,248,245,0.75)";
  const line = isDemo ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.12)";
  const accent = isDemo ? "#f0c674" : "#FF6B35";

  return `
<style id="puchup-po-site-footer-css">
.po-site-footer{background:${bg};color:#FAF8F5;margin-top:0;font-family:'Noto Sans Thai',ui-sans-serif,system-ui,sans-serif}
.po-site-footer .po-sf-inner{max-width:72rem;margin:0 auto;padding:3.5rem 1.25rem}
@media(min-width:640px){.po-site-footer .po-sf-inner{padding-left:1.5rem;padding-right:1.5rem}}
@media(min-width:768px){.po-site-footer .po-sf-inner{padding-left:2rem;padding-right:2rem}}
.po-site-footer .po-sf-top{display:flex;flex-direction:column;justify-content:space-between;gap:2.5rem}
@media(min-width:768px){.po-site-footer .po-sf-top{flex-direction:row;align-items:flex-start}}
.po-site-footer .po-sf-brand{max-width:28rem}
.po-site-footer .po-sf-brand a{display:inline-block;text-decoration:none;line-height:0}
.po-site-footer .po-sf-brand a:hover{opacity:0.92}
.po-site-footer .po-sf-logo{height:5.75rem;width:auto;max-width:min(100%,22rem);object-fit:contain;object-position:left center;display:block}
@media(min-width:768px){.po-site-footer .po-sf-logo{height:6.75rem;max-width:26rem}}
.po-site-footer .po-sf-tag{margin-top:1.1rem;font-size:0.875rem;line-height:1.65;color:${muted}}
.po-site-footer .po-sf-cols{display:grid;grid-template-columns:1fr 1fr;gap:2rem;font-size:0.875rem}
@media(min-width:640px){.po-site-footer .po-sf-cols{grid-template-columns:1fr 2fr}}
.po-site-footer .po-sf-col{display:flex;flex-direction:column;gap:0.75rem}
.po-site-footer .po-sf-eyebrow{font-size:0.7rem;letter-spacing:0.16em;text-transform:uppercase;color:${muted};font-weight:600}
.po-site-footer .po-sf-link{color:${soft};text-decoration:none}
.po-site-footer .po-sf-link:hover{color:#FAF8F5}
.po-site-footer .po-sf-products{display:grid;grid-template-columns:1fr;gap:0.5rem}
@media(min-width:640px){.po-site-footer .po-sf-products{grid-template-columns:1fr 1fr}}
.po-site-footer .po-sf-bottom{margin-top:3rem;padding-top:1.5rem;border-top:1px solid ${line};display:flex;flex-direction:column;gap:0.5rem;font-size:0.75rem;color:${muted}}
@media(min-width:640px){.po-site-footer .po-sf-bottom{flex-direction:row;justify-content:space-between}}
</style>
<footer class="po-site-footer" data-puchup-site-footer="1">
  <div class="po-sf-inner">
    <div class="po-sf-top">
      <div class="po-sf-brand">
        <a href="/" target="_top" aria-label="PuchUp — กลับหน้าหลัก">
          <img class="po-sf-logo" src="/brand/logo-horizontal-dark.png" width="640" height="214" alt="PuchUp — Level up your business & life" />
        </a>
        <p class="po-sf-tag">${escapeHtml(site.tagline)}<br>เว็บไซต์และระบบดิจิทัลที่ช่วยธุรกิจทำงานง่ายขึ้น</p>
      </div>
      <div class="po-sf-cols">
        <div class="po-sf-col">
          <span class="po-sf-eyebrow">Menu</span>
          ${menu}
        </div>
        <div class="po-sf-col" style="grid-column:span 1">
          <span class="po-sf-eyebrow">Products</span>
          <div class="po-sf-products">${products}</div>
        </div>
      </div>
    </div>
    <div class="po-sf-bottom">
      <span>© ${site.year} PuchUp</span>
      <span>${escapeHtml(site.domain)}</span>
    </div>
  </div>
</footer>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
