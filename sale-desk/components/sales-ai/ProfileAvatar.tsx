"use client";

import { profileInitials } from "@/lib/sales-ai/SaleStore";
import type { SalesProfile } from "@/lib/sales-ai/types";

type Props = {
  profile: SalesProfile;
  size?: number;
  className?: string;
  light?: boolean;
};

export function ProfileAvatar({ profile, size = 44, className = "", light }: Props) {
  const initials = profileInitials(profile);
  if (profile.avatarDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarDataUrl}
        alt={profile.fullName}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full text-sm font-bold ${className}`}
      style={{
        width: size,
        height: size,
        background: light ? "rgba(255,255,255,0.14)" : "var(--sale-navy-soft)",
        color: light ? "#fff" : "var(--sale-navy)",
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
