import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { loadEnvFiles } from "@/lib/imagen/load-env";
import type { AspectRatio } from "@/lib/project-one/slots";

/**
 * Imagen (:predict) models were shut down Aug 2026.
 * Use Gemini native image models via generateContent instead.
 * Override with GEMINI_IMAGE_MODEL if needed.
 */
loadEnvFiles();

const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

function imageApiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

export type GenerateImageInput = {
  prompt: string;
  aspectRatio?: AspectRatio;
  slotId: string;
};

export type GenerateImageResult = {
  slotId: string;
  imageUrl: string;
  cached: boolean;
  bytes: Buffer;
  mimeType: string;
};

function getApiKey(): string {
  loadEnvFiles();
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "Missing GEMINI_API_KEY (or GOOGLE_API_KEY). Add it to .env.local then re-run npm run generate:images",
    );
  }
  return key;
}

export function cacheDir(): string {
  return path.join(process.cwd(), "public", "images", "generated");
}

export function cacheFilePath(slotId: string): string {
  return path.join(cacheDir(), `${slotId}.png`);
}

export function publicUrlForSlot(slotId: string): string {
  return `/images/generated/${slotId}.png`;
}

export function promptHash(prompt: string, aspectRatio: string): string {
  return createHash("sha256").update(`${aspectRatio}::${prompt}`).digest("hex").slice(0, 16);
}

export function readCachedImage(slotId: string): Buffer | null {
  const file = cacheFilePath(slotId);
  if (!existsSync(file)) return null;
  return readFileSync(file);
}

export function writeCachedImage(slotId: string, bytes: Buffer): string {
  mkdirSync(cacheDir(), { recursive: true });
  const file = cacheFilePath(slotId);
  writeFileSync(file, bytes);
  return publicUrlForSlot(slotId);
}

type InlineData = {
  mimeType?: string;
  mime_type?: string;
  data?: string;
};

type ContentPart = {
  text?: string;
  inlineData?: InlineData;
  inline_data?: InlineData;
};

type GenerateContentResponse = {
  candidates?: Array<{
    content?: { parts?: ContentPart[] };
  }>;
  error?: { message?: string };
};

function extractImageFromResponse(
  json: GenerateContentResponse,
): { bytes: Buffer; mimeType: string } {
  const parts = json.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    const b64 = inline?.data;
    if (!b64) continue;
    return {
      bytes: Buffer.from(b64, "base64"),
      mimeType: inline.mimeType || inline.mime_type || "image/png",
    };
  }
  throw new Error(
    `Gemini image model returned no image bytes (model=${IMAGE_MODEL}). ` +
      `Response snippet: ${JSON.stringify(json).slice(0, 400)}`,
  );
}

/**
 * Build generationConfig for Gemini image generateContent (v1beta).
 * Use imageConfig.aspectRatio with colon strings ("4:3") — not responseFormat
 * enums (ASPECT_RATIO_*), which v1beta rejects for ImageResponseFormat.
 */
export function buildImageGenerationConfig(aspectRatio: AspectRatio) {
  return {
    responseModalities: ["TEXT", "IMAGE"] as const,
    imageConfig: {
      aspectRatio,
    },
  };
}

/**
 * Generate an image via Gemini native image model (Nano Banana / Flash Image).
 * Server-side only — never call from the browser with the API key.
 */
export async function callImagen(params: {
  prompt: string;
  aspectRatio: AspectRatio;
}): Promise<{ bytes: Buffer; mimeType: string }> {
  const apiKey = getApiKey();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const res = await fetch(imageApiUrl(IMAGE_MODEL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: params.prompt }],
          },
        ],
        generationConfig: buildImageGenerationConfig(params.aspectRatio),
      }),
      signal: controller.signal,
    });

    const json = (await res.json()) as GenerateContentResponse;
    if (!res.ok) {
      throw new Error(
        json.error?.message ||
          `Gemini image HTTP ${res.status}: ${JSON.stringify(json).slice(0, 400)}`,
      );
    }

    return extractImageFromResponse(json);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate (or return cached) image for a slot.
 * Does not run background removal — caller handles that for cutouts.
 */
export async function generateOrGetCached(
  input: GenerateImageInput,
  options?: { force?: boolean },
): Promise<GenerateImageResult> {
  const aspectRatio = input.aspectRatio || "1:1";
  const existing = !options?.force ? readCachedImage(input.slotId) : null;
  if (existing) {
    return {
      slotId: input.slotId,
      imageUrl: publicUrlForSlot(input.slotId),
      cached: true,
      bytes: existing,
      mimeType: "image/png",
    };
  }

  const { bytes, mimeType } = await callImagen({
    prompt: input.prompt,
    aspectRatio,
  });

  const imageUrl = writeCachedImage(input.slotId, bytes);
  return {
    slotId: input.slotId,
    imageUrl,
    cached: false,
    bytes,
    mimeType,
  };
}

export { IMAGE_MODEL };
