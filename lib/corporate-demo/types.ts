export type CorporateNiche = {
  slug: string;
  group: number;
  title: string;
  audience: string;
  offer: string;
  services: [string, string, string];
  brief: [string, string, string];
  evidence: string;
};

export type CompanyDetails = {
  brand: string;
  headline: string;
  description: string;
  accent: string;
  ink: string;
  paper: string;
  look: "technical" | "editorial" | "portfolio" | "cinematic";
  asset: string;
  notebook: string;
  source: { label: string; url: string };
  services: [string, string, string];
  areas: [string, string, string, string, string, string];
  projects: [title: string, location: string, story: string][];
  articles: [title: string, body: string][];
  process: [title: string, detail: string][];
  checklist: string[];
};
