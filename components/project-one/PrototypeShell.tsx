"use client";

import { useEffect, useRef } from "react";

type Props = {
  styles: string;
  bodyHtml: string;
  onReady?: (root: HTMLElement) => void;
};

/**
 * Renders a Tailwind-CDN prototype body without Next site chrome.
 * Loads fonts + CDN Tailwind once, then mounts exact prototype markup.
 */
export function PrototypeShell({ styles, bodyHtml, onReady }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const ensure = (selector: string, create: () => HTMLElement) => {
      if (document.querySelector(selector)) return;
      document.head.appendChild(create());
    };

    ensure('link[data-puchup-one-fonts="1"]', () => {
      const pre = document.createElement("link");
      pre.rel = "preconnect";
      pre.href = "https://fonts.googleapis.com";
      pre.setAttribute("data-puchup-one-fonts", "1");
      return pre;
    });

    ensure('link[data-puchup-one-fontcss="1"]', () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap";
      link.setAttribute("data-puchup-one-fontcss", "1");
      return link;
    });

    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    const prevFont = document.body.style.fontFamily;
    document.body.style.background = "#FCFAF5";
    document.body.style.color = "#0D182C";
    document.body.style.fontFamily = "'Noto Sans Thai','Fraunces',sans-serif";

    const run = () => {
      const root = rootRef.current;
      if (root && readyRef.current) readyRef.current(root);
    };

    if (!document.querySelector('script[data-puchup-one-tw="1"]')) {
      const s = document.createElement("script");
      s.src = "https://cdn.tailwindcss.com";
      s.setAttribute("data-puchup-one-tw", "1");
      s.onload = run;
      document.head.appendChild(s);
    } else {
      run();
    }

    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
      document.body.style.fontFamily = prevFont;
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
