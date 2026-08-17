"use client";

const STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://puchup.sanity.studio";

export default function AdminStudio() {
  return (
    <iframe
      src={STUDIO_URL}
      title="PuchUp CMS"
      className="h-dvh w-full border-0"
    />
  );
}
