export type PortableTextValue = unknown[];

export type SanityImage = {
  _type?: "image";
  asset?: {
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width?: number; height?: number };
    };
  };
  alt?: string;
  caption?: string;
  hotspot?: unknown;
  crop?: unknown;
};

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  ogImage?: SanityImage;
};

export type NavLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type CtaButton = {
  label: string;
  href: string;
  style?: "primary" | "secondary" | "ghost";
};

export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  logo?: SanityImage;
  mainNav?: NavLink[];
  footerNav?: NavLink[];
  footerText?: string;
  socialLinks?: { platform: string; url: string; label?: string }[];
  contactEmail?: string;
  seo?: SeoFields;
};

export type HeroSection = {
  _key: string;
  _type: "heroSection";
  heading: string;
  subheading?: string;
  image?: SanityImage;
  ctas?: CtaButton[];
};

export type RichTextSection = {
  _key: string;
  _type: "richTextSection";
  heading?: string;
  body?: PortableTextValue;
};

export type DemoShowcaseItem = {
  _key?: string;
  title: string;
  subtitle?: string;
  href?: string;
  image?: SanityImage;
  promptText?: string;
};

export type DemoShowcaseGrid = {
  _key: string;
  _type: "demoShowcaseGrid";
  heading?: string;
  intro?: string;
  items?: DemoShowcaseItem[];
};

export type PageSection = HeroSection | RichTextSection | DemoShowcaseGrid;

export type CmsPage = {
  _id: string;
  title: string;
  slug: string;
  sections?: PageSection[];
  seo?: SeoFields;
};

export type ImagePromptSlot = {
  _key?: string;
  slotName: string;
  promptText: string;
  aspectRatio?: string;
  imageUpload?: SanityImage;
};

export type CodeEmbed = {
  title?: string;
  html?: string;
  css?: string;
  javascript?: string;
  componentPayload?: string;
  minHeight?: number;
  fullPage?: boolean;
};

export type DemoSite = {
  _id: string;
  title: string;
  subdomain: string;
  brandDetails: {
    name: string;
    description?: string;
    logo?: SanityImage;
    theme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    menuLinks?: NavLink[];
  };
  codeEmbed?: CodeEmbed;
  imagePrompts?: ImagePromptSlot[];
  body?: PortableTextValue;
  seo?: SeoFields;
};
