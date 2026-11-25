export const caseImageRoot = "/images/demos/case-studies";
export function caseStudyImage(asset: string, slug: string) {
  const version = asset === "pest" ? "-v2" : "";
  return `${caseImageRoot}/${asset}/${slug}${version}.webp`;
}
