import { spawnSync } from "child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";

export type RemoveBgResult = {
  bytes: Buffer;
  method: "rembg-cli" | "remove-bg-api" | "none";
  error?: string;
};

/**
 * Attempt background removal.
 * Prefers local `rembg` CLI (pip install rembg[cli]), then remove.bg API.
 */
export async function removeBackground(bytes: Buffer): Promise<RemoveBgResult> {
  const rembg = tryRembgCli(bytes);
  if (rembg) return rembg;

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (apiKey) {
    try {
      const out = await callRemoveBgApi(bytes, apiKey);
      return { bytes: out, method: "remove-bg-api" };
    } catch (e) {
      return {
        bytes,
        method: "none",
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return {
    bytes,
    method: "none",
    error:
      "No background-removal tool available. Install rembg (`pip install rembg[cli]`) or set REMOVE_BG_API_KEY.",
  };
}

function tryRembgCli(bytes: Buffer): RemoveBgResult | null {
  const dir = mkdtempSync(path.join(tmpdir(), "puchup-rembg-"));
  const input = path.join(dir, "in.png");
  const output = path.join(dir, "out.png");
  try {
    writeFileSync(input, bytes);
    const result = spawnSync("rembg", ["i", input, output], {
      encoding: "utf8",
      timeout: 120_000,
    });
    if (result.status !== 0) {
      return null;
    }
    const out = readFileSync(output);
    return { bytes: out, method: "rembg-cli" };
  } catch {
    return null;
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

async function callRemoveBgApi(bytes: Buffer, apiKey: string): Promise<Buffer> {
  const form = new FormData();
  form.append("size", "auto");
  form.append(
    "image_file",
    new Blob([new Uint8Array(bytes)], { type: "image/png" }),
    "image.png",
  );

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`remove.bg HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}
