"use client";

import Image from "next/image";
import type { AssistantPersona } from "@/lib/sales-ai/assistant-persona";

type Props = {
  persona: AssistantPersona;
  size?: number;
};

export function AssistantFace({ persona, size = 40 }: Props) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        border: `2px solid ${persona.accent}`,
        boxShadow: `0 0 0 1px color-mix(in srgb, ${persona.accent} 30%, transparent)`,
      }}
    >
      <Image
        src={persona.avatarSrc}
        alt={`ผู้ช่วย ${persona.name}`}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
