"use client";

import { useState } from "react";

type Props = {
  promptText: string;
  slotName?: string;
  aspectRatio?: string;
  className?: string;
};

const ASPECT: Record<string, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:4": "aspect-[3/4]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

export function ImagePromptFallback({
  promptText,
  slotName,
  aspectRatio = "16:9",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`flex flex-col justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 ${ASPECT[aspectRatio] ?? "aspect-video"} ${className}`}
    >
      <div className="min-h-0 flex-1 overflow-hidden">
        {slotName ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            {slotName}
          </p>
        ) : null}
        <p className="line-clamp-6 text-sm leading-relaxed text-slate-600">
          {promptText}
        </p>
      </div>
      <button
        type="button"
        onClick={copyPrompt}
        className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100"
      >
        {copied ? "Copied" : "Copy Prompt"}
      </button>
    </div>
  );
}
