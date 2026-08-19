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
  favicon${imageFields},
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
    plans[]{
      name,
      price,
      blurb,
      features,
      ctaLabel,
      ctaHref,
      highlighted
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

const projectOneDemoFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  businessType,
  published,
  architectureStack,
  hero{
    heading,
    tagline,
    image${imageFields},
    imageUrl
  },
  menuOrServices[]{
    _key,
    name,
    description,
    price,
    category,
    image${imageFields},
    imageUrl
  },
  reviews[]{
    _key,
    rating,
    quote,
    author,
    context
  },
  locationInfo{
    address,
    hours[]{ days, time },
    phone,
    mapsUrl,
    mapsEmbedUrl
  },
  gallery[]{
    _key,
    image${imageFields},
    imageUrl,
    alt,
    caption
  },
  ${seoFields}
`;

export const projectOneDemoBySlugQuery = /* groq */ `*[_type == "projectOneDemo" && slug.current == $slug && published != false][0]{
  ${projectOneDemoFields}
}`;

export const projectOneDemoLinksQuery = /* groq */ `*[_type == "projectOneDemo" && defined(slug.current)]{
  title,
  "slug": slug.current,
  businessType,
  published,
  architectureStack,
  "heroImageUrl": coalesce(hero.image.asset->url, hero.imageUrl)
}`;

export const projectOneDemoSlugsQuery = /* groq */ `*[_type == "projectOneDemo" && published != false && defined(slug.current)].slug.current`;

