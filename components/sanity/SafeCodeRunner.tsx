"use client";

import { useMemo } from "react";
import type { CodeEmbed } from "@/lib/sanity/types";

type Props = {
  embed: CodeEmbed;
  className?: string;
};

/**
 * Renders HTML/CSS/JS inside a sandboxed iframe.
 * fullPage: edge-to-edge viewport height, no chrome.
 * If `html` is a full document (&lt;!DOCTYPE / &lt;html), use it as srcDoc as-is.
 */
export function SafeCodeRunner({ embed, className = "" }: Props) {
  const srcDoc = useMemo(() => buildSrcDoc(embed), [embed]);
  const minHeight = embed.minHeight ?? 480;
  const fullPage = Boolean(embed.fullPage);

  if (!embed.html && !embed.css && !embed.javascript) {
    return null;
  }

  if (fullPage) {
    return (
      <iframe
        title={embed.title || "Sandboxed demo"}
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
        className={`block w-full border-0 ${className}`}
        style={{ height: "100dvh", minHeight: minHeight || "100dvh" }}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ${className}`}
    >
      {embed.title ? (
        <div className="border-b border-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {embed.title}
        </div>
      ) : null}
      <iframe
        title={embed.title || "Sandboxed demo"}
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-forms"
        className="block w-full border-0"
        style={{ minHeight }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function buildSrcDoc(embed: CodeEmbed): string {
  const raw = embed.html?.trim() || "";
  if (/^<!DOCTYPE html/i.test(raw) || /^<html[\s>]/i.test(raw)) {
    return raw;
  }

  const css = embed.css?.trim() || "";
  const js = embed.javascript?.trim() || "";

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
    ${css}
  </style>
</head>
<body>
  ${raw}
  ${js ? `<script>\n${js}\n<\/script>` : ""}
</body>
</html>`;
}
