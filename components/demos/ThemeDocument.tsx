"use client";

import { useEffect, useRef } from "react";

type Props = {
  title: string;
  srcDoc: string;
};

/**
 * Full-document theme (Tailwind CDN + vanilla JS) isolated in an iframe
 * so the Next.js tree never hydrates the prototype markup.
 *
 * Sandboxed iframes often block target=_top navigation — we bridge
 * in-app Project ONE links to the parent window on user click.
 */
export function ThemeDocument({ title, srcDoc }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const frame = iframe;

    function bind() {
      const doc = frame.contentDocument;
      if (!doc) return;

      const onClick = (event: MouseEvent) => {
        const target = event.target as Element | null;
        const anchor = target?.closest?.("a");
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
          return;
        }
        if (/^https?:\/\//i.test(href) && !href.includes("puchup.com")) {
          return;
        }

        // Keep LINE / external absolute links as normal (new tab / default)
        if (anchor.target === "_blank") return;

        // In-app Project ONE routes must leave the iframe
        const url = href.startsWith("http")
          ? new URL(href)
          : new URL(href, window.location.origin);
        const next = `${url.pathname}${url.search}${url.hash}`;

        // In-app / same-site routes leave the iframe (incl. home + product pages)
        const sameSite =
          url.origin === window.location.origin ||
          url.hostname.replace(/^www\./, "") === "puchup.com";
        if (
          sameSite &&
          (url.pathname === "/" ||
            url.pathname.startsWith("/ProjectONE") ||
            url.pathname.startsWith("/demo") ||
            url.pathname.startsWith("/sale") ||
            url.pathname.startsWith("/contact") ||
            url.pathname.startsWith("/showcase") ||
            url.pathname.startsWith("/about") ||
            url.pathname.startsWith("/products") ||
            url.pathname.startsWith("/corporate") ||
            url.pathname.startsWith("/shopguide") ||
            url.pathname.startsWith("/partner") ||
            url.pathname.startsWith("/opscraft") ||
            url.pathname.endsWith(".html"))
        ) {
          event.preventDefault();
          event.stopPropagation();
          window.location.assign(next);
        }
      };

      doc.addEventListener("click", onClick, true);
      return () => doc.removeEventListener("click", onClick, true);
    }

    let cleanup: (() => void) | undefined;
    const onLoad = () => {
      cleanup?.();
      cleanup = bind();
    };

    iframe.addEventListener("load", onLoad);
    // srcDoc may already be ready
    cleanup = bind();

    return () => {
      iframe.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, [srcDoc]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={srcDoc}
      className="block h-full min-h-dvh w-full border-0"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
    />
  );
}
