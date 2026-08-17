"use client";

import { useCallback, useMemo } from "react";
import { PrototypeShell } from "@/components/project-one/PrototypeShell";
import {
  PROJECT_ONE_BODY,
  PROJECT_ONE_STYLES,
} from "@/lib/project-one/content/project-one-parts";
import { resolveImageSrc } from "@/lib/project-one/generated-map";
import { ALL_IMAGE_SLOTS, PROJECT_ONE_DEMOS } from "@/lib/project-one/slots";

function applySlotImage(el: Element) {
  const slotId = (el as HTMLElement).dataset.slotId;
  const prompt = (el as HTMLElement).dataset.prompt;
  const img = el.querySelector("img");
  if (!img) return;
  if (slotId) {
    const fallback = img.getAttribute("src") || "";
    img.src = resolveImageSrc(slotId, fallback);
  }
  if (prompt) {
    console.log("[imagen prompt ready]", prompt);
  }
}

/** Swap known slot img srcs in static HTML before mount. */
function bodyWithGeneratedSrcs(html: string): string {
  let out = html;
  for (const slot of ALL_IMAGE_SLOTS.filter((s) => s.page === "project-one")) {
    const url = resolveImageSrc(slot.slotId, slot.fallbackSrc);
    if (url === slot.fallbackSrc) continue;
    out = out.replace(slot.fallbackSrc, url);
  }
  return out;
}

export default function ProjectOneClient() {
  const bodyHtml = useMemo(() => bodyWithGeneratedSrcs(PROJECT_ONE_BODY), []);

  const onReady = useCallback((root: HTMLElement) => {
    root.querySelectorAll(".img-slot").forEach(applySlotImage);

    const demos = PROJECT_ONE_DEMOS.map((d) => ({ ...d }));
    const demoGrid = root.querySelector("#demoGrid");
    if (!demoGrid) return;

    function renderDemos(filter: string) {
      if (!demoGrid) return;
      demoGrid.innerHTML = demos
        .filter((d) => filter === "all" || d.cat === filter)
        .map(
          (d) => `
      <div class="rounded-xl overflow-hidden border hairline bg-white group">
        <div class="img-slot aspect-[4/3]" data-prompt="${d.prompt}" data-slot-id="${d.slotId}">
          <img src="${resolveImageSrc(d.slotId, d.fallbackSrc)}" alt="${d.name}">
          <span class="img-tag">imagen: ${d.cat}</span>
        </div>
        <div class="p-5 flex items-center justify-between">
          <div>
            <p class="font-display font-medium">${d.name}</p>
            <p class="text-xs text-[var(--ink-faint)] font-mono mt-0.5">${d.type}</p>
          </div>
          <a href="#" class="text-sm font-medium text-[var(--purple)] whitespace-nowrap ml-3">View ONE</a>
        </div>
      </div>
    `,
        )
        .join("");
      demoGrid.querySelectorAll(".img-slot").forEach(applySlotImage);
    }

    renderDemos("all");

    root.querySelectorAll("#filterTabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        root.querySelectorAll("#filterTabs button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderDemos((btn as HTMLElement).dataset.filter || "all");
      });
    });

    root.querySelectorAll("[data-gtab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        root.querySelectorAll("[data-gtab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        root.querySelectorAll(".gpanel").forEach((p) => p.classList.add("hidden"));
        const panel = root.querySelector("#panel-" + (btn as HTMLElement).dataset.gtab);
        panel?.classList.remove("hidden");
      });
    });

    const faqs = [
      {
        q: "One Page ต่างจาก Landing Page อย่างไร?",
        a: 'Project ONE ไม่ได้ถูกออกแบบเพื่อขายสินค้าหรือแคมเปญเพียงอย่างเดียว แต่ถูกออกแบบให้เป็น "บ้านออนไลน์" ของธุรกิจ โดยรวมข้อมูลสำคัญทั้งหมดไว้ในประสบการณ์เดียว',
      },
      { q: "สามารถเพิ่มหน้าในอนาคตได้ไหม?", a: "ได้" },
      { q: "รองรับ Google Business ไหม?", a: "ได้" },
      { q: "เพิ่มบทความได้ไหม?", a: "ได้" },
      { q: "เพิ่มระบบจองได้ไหม?", a: "ได้" },
      { q: "เชื่อม LINE ได้ไหม?", a: "ได้" },
      { q: "ธุรกิจไม่มีระบบออนไลน์เลยทำได้ไหม?", a: "ได้" },
    ];

    const faqList = root.querySelector("#faqList");
    if (faqList) {
      faqList.innerHTML = faqs
        .map(
          (f, i) => `
  <div class="border hairline rounded-xl bg-white overflow-hidden">
    <button class="faq-q w-full text-left px-5 py-4 flex items-center justify-between gap-4" data-idx="${i}">
      <span class="font-medium">${f.q}</span>
      <span class="faq-icon text-[var(--ink-faint)] font-mono transition-transform">+</span>
    </button>
    <div class="faq-a hidden px-5 pb-4 text-[var(--ink-soft)] text-sm">${f.a}</div>
  </div>
`,
        )
        .join("");

      faqList.querySelectorAll(".faq-q").forEach((btn) => {
        btn.addEventListener("click", () => {
          const ans = btn.nextElementSibling as HTMLElement | null;
          const icon = btn.querySelector(".faq-icon");
          if (!ans || !icon) return;
          const open = !ans.classList.contains("hidden");
          faqList.querySelectorAll(".faq-a").forEach((a) => a.classList.add("hidden"));
          faqList.querySelectorAll(".faq-icon").forEach((i) => {
            i.textContent = "+";
          });
          if (!open) {
            ans.classList.remove("hidden");
            icon.textContent = "–";
          }
        });
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const nav = root.querySelector("#mainnav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add("shadow-sm");
      else nav.classList.remove("shadow-sm");
    };
    window.addEventListener("scroll", onScroll);
  }, []);

  return (
    <PrototypeShell styles={PROJECT_ONE_STYLES} bodyHtml={bodyHtml} onReady={onReady} />
  );
}
