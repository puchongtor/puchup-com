import type { flagshipSites } from "@/lib/corporate-demo/collection";

const marks: Record<(typeof flagshipSites)[number], readonly [string, string, string]> = {
  "high-rise-glass-cleaning": ["#143a46", "#93e1df", "M8 28V11l10-4v21M18 13l10-4v19M8 22l20-8M5 29h25"],
  "post-construction-cleaning": ["#243e4a", "#c5ebf1", "M10 25l7-12 9 5-4 10H10zm10-10 4-8m-2 15 5 3M8 8v7m-3-4h6"],
  "landscape-design": ["#284d39", "#d7eaaa", "M8 21c0-8 8-13 20-13-1 12-6 19-14 19-3 0-6-2-6-6zm2 9 14-14M13 24v-7m5 3h7"],
  "fountain-installation": ["#234c64", "#a7e4f3", "M6 26h24M8 23c2-7 5-11 10-12 5 1 8 5 10 12M18 23V6M13 23c0-4 2-7 5-9 3 2 5 5 5 9"],
  "home-builder": ["#59392c", "#ffddac", "M5 17 18 7l13 10M9 15v14h18V15M15 29V19h6v10"],
  "home-renovation": ["#593e4c", "#ffdbd5", "M10 15v13h16V15M7 17 18 8l11 9M13 22h10m-7-4 4 4-4 4"],
  "crane-rental": ["#302219", "#ffc688", "M8 29h21M12 29V10h13l5 5H12m12 0v7m0 0c5 0 4 5 1 5-2 0-3-1-3-2M12 13l6 15M7 10h5"],
  "machinery-moving": ["#24354a", "#bedaff", "M7 10h17v13H7zM24 14h3l3 5v4h-6M8 27h20M10 23v4m15-4v4"],
  "storefront-signage": ["#532b46", "#ffd0ec", "M8 11h20v15H8zM13 8v3m10-3v3M13 21l3-6 3 6m-5-2h4m4 2v-6"],
  "solar-rooftop": ["#2b4233", "#f5dc83", "M7 27l4-11h17l3 11zM10 21h19M17 16l-2 11m7-11 2 11M10 8h5m-2.5-3v6M19 8h4"],
  "epoxy-flooring": ["#343d47", "#bed8eb", "M5 22l13-8 13 8-13 8-13-8zm0-6 13-8 13 8M13 18l13 7M10 25l13-8"],
  "waterproofing": ["#233e61", "#b9d5ff", "M6 20 18 9l12 11M12 23h12M18 17c-3 4-5 7-5 9a5 5 0 0 0 10 0c0-2-2-5-5-9z"],
  "termite-and-pest-control": ["#263d27", "#dceba5", "M18 5l11 5v9c0 6-4 10-11 13C11 29 7 25 7 19v-9zM12 16l6-5 6 5M14 15v8h8v-8m-6 4 2 2 4-4"],
};

export function DemoBrandMark({ niche }: { niche: string }) {
  const mark = (marks as Partial<Record<string, readonly [string, string, string]>>)[niche];
  if (!mark) return null;
  const [surface, stroke, path] = mark;
  return (
    <svg width="38" height="38" viewBox="0 0 36 36" aria-hidden="true" focusable="false" data-demo-brand-mark={niche} style={{ flexShrink: 0 }}>
      <rect width="36" height="36" rx="8" fill={surface} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
