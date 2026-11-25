export function addDemoDisclosureAssets(html: string): string {
  const tags = '<link rel="stylesheet" href="/demo-disclosure.css"><script src="/demo-disclosure.js" defer></script>';
  return html.replace(/<\/head>/i, `${tags}</head>`);
}
