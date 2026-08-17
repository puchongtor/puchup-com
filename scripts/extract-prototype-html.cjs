const fs = require("fs");
const path = require("path");

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function extract(html) {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<script>/);
  const scriptMatch = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);
  if (!styleMatch || !bodyMatch || !scriptMatch) {
    throw new Error("Failed to parse HTML parts");
  }
  return {
    styles: styleMatch[1],
    body: bodyMatch[1],
    script: scriptMatch[1],
  };
}

const outDir = path.join("lib", "project-one", "content");
fs.mkdirSync(outDir, { recursive: true });

const one = extract(
  fs.readFileSync("content/project-one/puchup-project-one.html", "utf8"),
);
let oneBody = one.body
  .replaceAll('href="demo.html"', 'href="/ProjectONE/Demo/"')
  .replaceAll("href='demo.html'", "href='/ProjectONE/Demo/'");

// Stamp static img-slots with data-slot-id for wiring
const staticSlotMap = [
  [
    'data-prompt="Warm editorial hero photo of a cozy Bangkok café storefront at golden hour, premium lifestyle photography, soft natural light"',
    "one-website-hero",
  ],
  [
    'data-prompt="Small square logo mockup for a boutique café, minimalist icon style, warm palette"',
    "one-gbiz-logo",
  ],
  [
    'data-prompt="Warm neighbourhood street scene near a small local shop, documentary lifestyle photography"',
    "one-article-1",
  ],
  [
    'data-prompt="Founder working quietly inside a small shop, candid warm portrait, editorial tone"',
    "one-article-2",
  ],
  [
    'data-prompt="Close-up of product display and menu on a wooden table, natural window light, premium still life"',
    "one-article-3",
  ],
];
for (const [needle, slotId] of staticSlotMap) {
  oneBody = oneBody.replace(needle, `${needle} data-slot-id="${slotId}"`);
}

fs.writeFileSync(
  path.join(outDir, "project-one-parts.ts"),
  `export const PROJECT_ONE_STYLES = \`${esc(one.styles)}\`;\n\n` +
    `export const PROJECT_ONE_BODY = \`${esc(oneBody)}\`;\n\n` +
    `export const PROJECT_ONE_SCRIPT_RAW = \`${esc(one.script)}\`;\n`,
);

const demo = extract(fs.readFileSync("content/project-one/demo.html", "utf8"));
let demoBody = demo.body
  .replaceAll('href="index.html#final-cta"', 'href="/ProjectONE/#final-cta"')
  .replaceAll('href="index.html"', 'href="/ProjectONE/"');

fs.writeFileSync(
  path.join(outDir, "demo-parts.ts"),
  `export const DEMO_STYLES = \`${esc(demo.styles)}\`;\n\n` +
    `export const DEMO_BODY = \`${esc(demoBody)}\`;\n\n` +
    `export const DEMO_SCRIPT_RAW = \`${esc(demo.script)}\`;\n`,
);

console.log("Wrote project-one and demo content modules");
