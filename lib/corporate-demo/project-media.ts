export const caseImageRoot = "/images/demos/case-studies";

export function caseStudyImage(asset: string, slug: string) {
  return `${caseImageRoot}/${asset}/${slug}.webp`;
}
