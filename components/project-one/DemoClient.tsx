"use client";

import { useCallback } from "react";
import { PrototypeShell } from "@/components/project-one/PrototypeShell";
import {
  DEMO_BODY,
  DEMO_STYLES,
} from "@/lib/project-one/content/demo-parts";
import { resolveImageSrc } from "@/lib/project-one/generated-map";
import { DEMO_CATEGORIES } from "@/lib/project-one/slots";

const BASE_URL = "/ProjectONE/";

export default function DemoClient() {
  const onReady = useCallback((root: HTMLElement) => {
    const categories = DEMO_CATEGORIES.map((c) => ({
      ...c,
      img: resolveImageSrc(c.slotId, c.fallbackSrc),
    }));

    const quickNav = root.querySelector("#quickNav");
    const catList = root.querySelector("#catList");
    if (!quickNav || !catList) return;

    quickNav.innerHTML = categories
      .map(
        (c) =>
          `<a href="#${c.id}" class="quicknav-link rounded-full px-3.5 py-1.5 text-xs font-mono">${c.emoji} ${c.name}</a>`,
      )
      .join("");

    catList.innerHTML = categories
      .map(
        (c, i) => `
  <div id="${c.id}" class="cat-card reveal rounded-2xl bg-white border hairline p-6 md:p-8 flex flex-col md:flex-row ${
    i % 2 === 1 ? "md:flex-row-reverse" : ""
  } gap-6 md:gap-10 items-center md:items-start scroll-mt-24">
    <div class="breakout-wrap relative z-10" data-prompt="${c.prompt}" data-slot-id="${c.slotId}">
      <img src="${c.img}" alt="${c.name}">
    </div>
    <div class="flex-1 text-center md:text-left">
      <p class="font-display font-medium text-xl mb-1.5">${c.emoji} ${c.name}</p>
      <p class="text-sm text-[var(--ink-soft)] mb-5 max-w-md mx-auto md:mx-0">${c.desc}</p>
      <div class="flex flex-wrap justify-center md:justify-start gap-2">
        ${c.items
          .map(
            (it) =>
              `<a href="${BASE_URL}${it.slug}" class="biz-link">${it.name} <span aria-hidden="true">→</span></a>`,
          )
          .join("")}
      </div>
    </div>
  </div>
`,
      )
      .join("");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }, []);

  return <PrototypeShell styles={DEMO_STYLES} bodyHtml={DEMO_BODY} onReady={onReady} />;
}
