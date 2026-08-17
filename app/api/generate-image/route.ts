import { NextRequest, NextResponse } from "next/server";
import { generateOrGetCached, writeCachedImage } from "@/lib/imagen/generate";
import { removeBackground } from "@/lib/imagen/remove-bg";
import { pngHasTransparency } from "@/lib/imagen/transparency";
import type { AspectRatio } from "@/lib/project-one/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  prompt?: string;
  aspectRatio?: AspectRatio;
  slotId?: string;
  requireTransparency?: boolean;
  force?: boolean;
};

/**
 * POST /api/generate-image
 * Body: { prompt, aspectRatio, slotId, requireTransparency?, force? }
 * Server-only Imagen call + file cache under public/images/generated/
 */
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, slotId } = body;
  if (!prompt || !slotId) {
    return NextResponse.json(
      { error: "prompt and slotId are required" },
      { status: 400 },
    );
  }

  const aspectRatio = body.aspectRatio || "1:1";

  try {
    let result = await generateOrGetCached(
      { prompt, aspectRatio, slotId },
      { force: body.force },
    );

    let hasTransparency = pngHasTransparency(result.bytes);
    let transparencyNote: string | undefined;

    if (body.requireTransparency && !hasTransparency) {
      const removed = await removeBackground(result.bytes);
      if (removed.method === "none") {
        return NextResponse.json(
          {
            error: "Generated image has no transparency",
            detail: removed.error,
            slotId,
            imageUrl: result.imageUrl,
            hasTransparency: false,
            cached: result.cached,
          },
          { status: 422 },
        );
      }
      writeCachedImage(slotId, removed.bytes);
      result = {
        ...result,
        bytes: removed.bytes,
        imageUrl: result.imageUrl,
        cached: false,
      };
      hasTransparency = pngHasTransparency(result.bytes);
      if (!hasTransparency) {
        return NextResponse.json(
          {
            error: "Background removal ran but output still has no transparency",
            slotId,
            method: removed.method,
            hasTransparency: false,
          },
          { status: 422 },
        );
      }
      transparencyNote = `Background removed via ${removed.method}`;
    }

    return NextResponse.json({
      slotId,
      imageUrl: result.imageUrl,
      cached: result.cached,
      hasTransparency,
      transparencyNote,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message, slotId }, { status: 500 });
  }
}
