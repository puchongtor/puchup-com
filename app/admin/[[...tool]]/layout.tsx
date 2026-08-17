import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin — PuchUp",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "auto",
        overscrollBehavior: "none",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {children}
    </div>
  );
}
