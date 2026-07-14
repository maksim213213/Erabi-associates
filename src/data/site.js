// ============================================================
//  GLOBAL SITE CONFIG — edit these before you deploy.
// ============================================================
export const SITE = {
  name: 'PickWise',
  tagline: 'Honest K-beauty & J-beauty reviews, routines & comparisons',
  // Your live domain. Used for sitemap, canonical URLs and OG tags.
  // Falls back to the Netlify-provided site URL when SITE_URL isn't set.
  url: process.env.SITE_URL || process.env.URL || 'https://your-site.netlify.app',
  // Your Amazon Associates tracking id (e.g. yourtag-20).
  // Every affiliate link is tagged with this automatically.
  // Set the AFFILIATE_TAG environment variable to your real tag.
  affiliateTag: process.env.AFFILIATE_TAG || 'yourtag-20',
  // --- Secondary affiliate: YesStyle (K/J-beauty shoppers convert better here,
  //     and it pays up to ~10% vs Amazon's ~3-4% on beauty). YesStyle runs
  //     through affiliate NETWORKS (Awin / ShareASale), NOT a simple ?tag= param,
  //     so paste your network's deep-link TEMPLATE here and put {url} where the
  //     destination product URL belongs (it gets URL-encoded for you).
  //       Awin example: https://www.awin1.com/cread.php?awinmid=XXXX&awinaffid=YYYY&ued={url}
  //     Leave empty and YesStyle buttons stay hidden until you've joined a network.
  yesstyleDeepLink: process.env.YESSTYLE_DEEPLINK || '',
  author: 'The PickWise Team',
  // Default social share image (1200x630) placed in /public.
  defaultOgImage: '/og-default.jpg',
}

// ============================================================
//  CATEGORIES / RUBRICS — add or remove freely.
//  slug must be URL-safe and unique. icon is any emoji.
// ============================================================
export const CATEGORIES = [
  { slug: 'sunscreen',    name: 'Sunscreen',            icon: '☀️', blurb: 'Korean & Japanese SPF that actually feels good to wear every day.' },
  { slug: 'cleansers',    name: 'Cleansers',            icon: '🫧', blurb: 'Oil cleansers, low-pH gels and the double-cleanse essentials.' },
  { slug: 'toners',       name: 'Toners & Essences',    icon: '💧', blurb: 'Hydrating toners and essences for the glass-skin base.' },
  { slug: 'serums',       name: 'Serums & Ampoules',    icon: '🧪', blurb: 'Targeted actives for glow, texture and dark spots.' },
  { slug: 'moisturizers', name: 'Moisturizers & Masks', icon: '🧴', blurb: 'Barrier creams, gels and sheet masks to seal it all in.' },
  { slug: 'routines',     name: 'Routines & Guides',    icon: '📋', blurb: 'Step-by-step routines by skin type and skin goal.' },
]

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug)

// ============================================================
//  Build a compliant, tagged Amazon URL from an ASIN or full URL.
//  rel is applied in the BuyButton component.
// ============================================================
export function amazonLink(input) {
  if (!input) return '#'
  // If an ASIN (10 alphanumerics) was given, build a clean product URL.
  const isAsin = /^[A-Z0-9]{10}$/i.test(input.trim())
  let url = input.trim()
  if (isAsin) url = `https://www.amazon.com/dp/${url.toUpperCase()}`
  // Add scheme if the author pasted a bare "www.amazon.com/..." link.
  else if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  try {
    const u = new URL(url)
    // amzn.to short links already carry their own embedded tag — leave as-is.
    if (u.hostname === 'amzn.to') {
      console.warn(`amazonLink: leaving short link untouched (embedded tag): ${url}`)
      return url
    }
    // Only tag real Amazon storefront hosts.
    if (u.hostname.includes('amazon.')) u.searchParams.set('tag', SITE.affiliateTag)
    return u.toString()
  } catch {
    // Last-resort: never ship an untagged affiliate link.
    if (!url.includes('amazon.')) return url
    return url + (url.includes('?') ? '&' : '?') + 'tag=' + SITE.affiliateTag
  }
}

// ============================================================
//  Build a YesStyle affiliate link via your network deep-link
//  template (SITE.yesstyleDeepLink).
//    • Pass a full YesStyle product URL to deep-link a specific item.
//    • Pass a product name to fall back to a YesStyle search for it.
//  Returns null when YesStyle isn't configured yet, so the button
//  simply doesn't render (no dead/untracked links ever ship).
// ============================================================
export function yesstyleLink(input) {
  if (!input || !SITE.yesstyleDeepLink) return null
  let dest
  if (/yesstyle\./i.test(input)) {
    dest = /^https?:\/\//i.test(input) ? input : `https://${input}`
  } else {
    dest = `https://www.yesstyle.com/en/search.html?q=${encodeURIComponent(input)}`
  }
  return SITE.yesstyleDeepLink.includes('{url}')
    ? SITE.yesstyleDeepLink.replace('{url}', encodeURIComponent(dest))
    : SITE.yesstyleDeepLink + encodeURIComponent(dest)
}
