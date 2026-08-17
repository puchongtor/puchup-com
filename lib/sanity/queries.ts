/** GROQ query fragments — plain strings (no next-sanity import needed). */
const seoFields = /* groq */ `seo{
  metaTitle,
  metaDescription,
  noIndex,
  ogImage
}`;

const imageFields = /* groq */ `{
  ...,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  }
}`;

export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo${imageFields},
  mainNav[]{ label, href, openInNewTab },
  footerNav[]{ label, href, openInNewTab },
  footerText,
  socialLinks[]{ platform, url, label },
  contactEmail,
  ${seoFields}
}`;

export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  sections[]{
    _key,
    _type,
    ...,
    image${imageFields},
    body[]{
      ...,
      _type == "image" => ${imageFields}
    },
    items[]{
      ...,
      image${imageFields}
    },
    ctas[]{ label, href, style }
  },
  ${seoFields}
}`;

export const demoSiteBySubdomainQuery = /* groq */ `*[_type == "demoSite" && subdomain.current == $subdomain && published != false][0]{
  _id,
  title,
  "subdomain": subdomain.current,
  brandDetails{
    name,
    description,
    logo${imageFields},
    theme,
    menuLinks[]{ label, href, openInNewTab }
  },
  codeEmbed{
    title,
    html,
    css,
    javascript,
    componentPayload,
    minHeight,
    fullPage
  },
  imagePrompts[]{
    _key,
    slotName,
    promptText,
    aspectRatio,
    imageUpload${imageFields}
  },
  body[]{
    ...,
    _type == "image" => ${imageFields}
  },
  ${seoFields}
}`;

export const demoSiteSubdomainsQuery = /* groq */ `*[_type == "demoSite" && published != false && defined(subdomain.current)].subdomain.current`;
