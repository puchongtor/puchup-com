import type { ReactNode } from "react";
import { DemoBanner } from "./DemoBanner";

const bannerColors: Record<string, string> = {
  restaurant: "#35261c", cafe: "#38281e", bakery: "#463122", customcake: "#522c39", pizzeria: "#48291f",
  dental: "#16373b", aesthetic: "#3a2925", "rebalance-physio": "#173a31", optometry: "#173144", tcmclinic: "#253a29",
  hotel: "#302019", massagespa: "#3c3125", petstore: "#3b3024", petcare: "#493628", airservice: "#163248",
  curtain: "#3a3027", autogarage: "#242e3d", carwash: "#142c42", windowtint: "#152c37", bicycle: "#233a2b",
  accounting: "#18283e", artstudio: "#442e25", florist: "#382c34", stone: "#302b23", printing: "#263149",
  phonerepair: "#19283d", laundry: "#153745", pilates: "#112a2b", muaythaigym: "#401f23",
};

export function ProjectOneDemoChrome({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-[#FCFAF5]">
      <DemoBanner background={bannerColors[slug]} />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
