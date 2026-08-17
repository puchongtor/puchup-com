/**
 * Batch-generate all Project ONE + Demo Library images via Gemini image API.
 * (Imagen shut down — default gemini-2.5-flash-image; override with GEMINI_IMAGE_MODEL)
 *
 * Usage:
 *   npm run generate:images
 *   npm run generate:images -- --force
 *   npm run generate:images -- --slot=demo-cat-food
 *
 * Reads GEMINI_API_KEY from .env.local / .env automatically.
 * Aspect ratio is sent as imageConfig.aspectRatio ("1:1", "4:3", "16:9", …).
 *
 * Optional:
 *   GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
 *   REMOVE_BG_API_KEY=...
 */
import { existsSync, writeFileSync } from "fs";
import path from "path";
import { loadEnvFiles } from "../lib/imagen/load-env";
import {
  generateOrGetCached,
  IMAGE_MODEL,
  writeCachedImage,
} from "../lib/imagen/generate";
import { removeBackground } from "../lib/imagen/remove-bg";
import { pngHasTransparency } from "../lib/imagen/transparency";
import { ALL_IMAGE_SLOTS } from "../lib/project-one/slots";

loadEnvFiles();

const force = process.argv.includes("--force");
const slotArg = process.argv.find((a) => a.startsWith("--slot="));
const onlySlot = slotArg?.slice("--slot=".length);

type ReportRow = {
  slotId: string;
  ok: boolean;
  cached?: boolean;
  imageUrl?: string;
  hasTransparency?: boolean;
  error?: string;
  note?: string;
};

function isQuotaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("quota") ||
    m.includes("rate limit") ||
    m.includes("resource_exhausted") ||
    m.includes("exceeded your current quota")
  );
}

function isHardFreeTierZero(message: string): boolean {
  return /free_tier.*limit:\s*0/i.test(message) || /limit:\s*0,\s*model:/i.test(message);
}

function retryDelayMs(message: string): number | null {
  const m = message.match(/retry in\s+([\d.]+)\s*s/i);
  if (!m) return null;
  return Math.ceil(parseFloat(m[1]) * 1000) + 500;
}

function printQuotaHelp(error: string) {
  console.error("\n=== Gemini quota / billing ===");
  console.error(error.split("\n")[0]);
  console.error(`
Model ${IMAGE_MODEL} has no usable free-tier quota for this key (often limit: 0).

Options:
  1. Enable billing / paid plan for this API key:
     https://ai.dev/rate-limit
     https://aistudio.google.com/apikey
  2. Try a model that still has free quota, in .env.local:
     GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
     then: npm run generate:images
  3. Or enable billing and use gemini-3.1-flash-image.

Pages keep picsum fallback until images are generated successfully.
`);
}

async function processSlot(slot: (typeof ALL_IMAGE_SLOTS)[number]): Promise<ReportRow> {
  try {
    let result = await generateOrGetCached(
      {
        prompt: slot.prompt,
        aspectRatio: slot.aspectRatio,
        slotId: slot.slotId,
      },
      { force },
    );

    let hasTransparency = pngHasTransparency(result.bytes);
    let note: string | undefined;

    if (slot.requireTransparency && !hasTransparency) {
      console.log(`  → no alpha on ${slot.slotId}, running background removal…`);
      const removed = await removeBackground(result.bytes);
      if (removed.method === "none") {
        return {
          slotId: slot.slotId,
          ok: false,
          imageUrl: result.imageUrl,
          hasTransparency: false,
          error:
            removed.error ||
            "Imagen output has no transparency and no rembg/remove.bg available",
          note: "KEEPING generated opaque file; page will still fall back to picsum unless you fix transparency",
        };
      }
      writeCachedImage(slot.slotId, removed.bytes);
      result = { ...result, bytes: removed.bytes, cached: false };
      hasTransparency = pngHasTransparency(result.bytes);
      note = `bg removed via ${removed.method}`;
      if (!hasTransparency) {
        return {
          slotId: slot.slotId,
          ok: false,
          imageUrl: result.imageUrl,
          hasTransparency: false,
          error: "Background removal completed but PNG still has no transparency",
          note,
        };
      }
    }

    return {
      slotId: slot.slotId,
      ok: true,
      cached: result.cached,
      imageUrl: result.imageUrl,
      hasTransparency,
      note,
    };
  } catch (e) {
    return {
      slotId: slot.slotId,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function main() {
  const slots = onlySlot
    ? ALL_IMAGE_SLOTS.filter((s) => s.slotId === onlySlot)
    : ALL_IMAGE_SLOTS;

  if (slots.length === 0) {
    console.error(`No slots matched ${onlySlot}`);
    process.exit(1);
  }

  console.log(
    `Generating ${slots.length} image(s) with ${IMAGE_MODEL}${force ? " (force)" : ""}…`,
  );
  const report: ReportRow[] = [];
  const successMap: Record<string, string> = {};

  // Keep previously successful entries if map exists
  const mapPath = path.join("lib", "project-one", "generated-map.ts");

  for (const slot of slots) {
    process.stdout.write(`• ${slot.slotId} … `);
    let row = await processSlot(slot);

    // Soft rate-limit: wait once and retry this slot
    if (!row.ok && row.error && isQuotaError(row.error) && !isHardFreeTierZero(row.error)) {
      const wait = retryDelayMs(row.error) ?? 10_000;
      console.log(`rate-limited, waiting ${Math.round(wait / 1000)}s…`);
      await new Promise((r) => setTimeout(r, wait));
      process.stdout.write(`  retry ${slot.slotId} … `);
      row = await processSlot(slot);
    }

    report.push(row);
    if (row.ok && row.imageUrl) {
      successMap[slot.slotId] = row.imageUrl;
      console.log(row.cached ? "cached" : "generated", row.note || "");
    } else {
      console.log("FAILED:", row.error);
      const file = path.join("public", "images", "generated", `${slot.slotId}.png`);
      if (existsSync(file) && !slot.requireTransparency) {
        successMap[slot.slotId] = `/images/generated/${slot.slotId}.png`;
      }

      // Hard quota (free_tier limit: 0): stop — remaining calls will fail the same way
      if (row.error && isQuotaError(row.error) && isHardFreeTierZero(row.error)) {
        printQuotaHelp(row.error);
        break;
      }
    }
  }

  // Merge: for slots we didn't touch, preserve file-based URLs
  for (const slot of ALL_IMAGE_SLOTS) {
    if (successMap[slot.slotId]) continue;
    const file = path.join("public", "images", "generated", `${slot.slotId}.png`);
    if (!existsSync(file)) continue;
    if (slot.requireTransparency) {
      const { readFileSync } = await import("fs");
      const bytes = readFileSync(file);
      if (!pngHasTransparency(bytes)) continue;
    }
    successMap[slot.slotId] = `/images/generated/${slot.slotId}.png`;
  }

  const mapSource =
    `/** Auto-generated by scripts/generate-all-images.ts — do not edit by hand */\n` +
    `export type GeneratedMap = Record<string, string>;\n\n` +
    `const generatedMap: GeneratedMap = ${JSON.stringify(successMap, null, 2)};\n\n` +
    `export default generatedMap;\n\n` +
    `export function resolveImageSrc(slotId: string, fallbackSrc: string): string {\n` +
    `  return generatedMap[slotId] || fallbackSrc;\n` +
    `}\n`;

  writeFileSync(mapPath, mapSource, "utf8");
  console.log(`\nWrote ${mapPath} (${Object.keys(successMap).length} urls)`);

  const failed = report.filter((r) => !r.ok);
  const transparencyFails = failed.filter(
    (r) => r.error?.toLowerCase().includes("transparency") || r.hasTransparency === false,
  );

  if (transparencyFails.length) {
    console.log("\n=== TRANSPARENCY ISSUES (not assuming cutouts are OK) ===");
    for (const f of transparencyFails) {
      console.log(`- ${f.slotId}: ${f.error}`);
    }
  }

  if (failed.length) {
    console.log(`\n${failed.length} slot(s) failed — pages keep picsum fallback for those.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll slots OK.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
