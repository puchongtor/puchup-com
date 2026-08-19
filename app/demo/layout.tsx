import { Fraunces, Noto_Sans_Thai } from "next/font/google";
import "./showroom.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-showroom-display",
  display: "swap",
});

const sans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-showroom-sans",
  display: "swap",
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable}`}>{children}</div>;
}
