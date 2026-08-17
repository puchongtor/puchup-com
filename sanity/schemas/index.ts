import { brandDetails } from "./objects/brandDetails";
import { codeEmbed } from "./objects/codeEmbed";
import { ctaButton } from "./objects/ctaButton";
import { demoShowcaseGrid } from "./objects/demoShowcaseGrid";
import { heroSection } from "./objects/heroSection";
import { imagePrompt } from "./objects/imagePrompt";
import { navLink } from "./objects/navLink";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";
import { demoSite } from "./documents/demoSite";
import { page } from "./documents/page";
import { siteSettings } from "./documents/siteSettings";

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  demoSite,
  // Objects
  navLink,
  socialLink,
  seo,
  ctaButton,
  richText,
  heroSection,
  demoShowcaseGrid,
  brandDetails,
  codeEmbed,
  imagePrompt,
];
