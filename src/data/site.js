// ============================================================
//  GLOBAL SITE CONFIG — edit these before you deploy.
// ============================================================
export const SITE = {
  name: 'PickWise',
  tagline: 'Honest Amazon buying guides, reviews & comparisons',
  // Your live domain. Used for sitemap, canonical URLs and OG tags.
  // Falls back to the Netlify-provided site URL when SITE_URL isn't set.
  url: process.env.SITE_URL || process.env.URL || 'https://your-site.netlify.app',
  // Your Amazon Associates tracking id (e.g. yourtag-20).
  // Every affiliate link is tagged with this automatically.
  // Set the AFFILIATE_TAG environment variable to your real tag.
  affiliateTag: process.env.AFFILIATE_TAG || 'yourtag-20',
  author: 'The PickWise Team',
  // Default social share image (1200x630) placed in /public.
  defaultOgImage: '/og-default.jpg',
}

// ============================================================
//  CATEGORIES / RUBRICS — add or remove freely.
//  slug must be URL-safe and unique. icon is any emoji.
// ============================================================
export const CATEGORIES = [
  { slug: 'home',    name: 'Home & Living',   icon: '🏠', blurb: 'Gadgets and decor that upgrade any room.' },
  { slug: 'kitchen', name: 'Kitchen',         icon: '🍳', blurb: 'Appliances and tools for better cooking.' },
  { slug: 'tech',    name: 'Tech & Gadgets',  icon: '💻', blurb: 'The devices worth your money this year.' },
  { slug: 'fitness', name: 'Fitness',         icon: '🏋️', blurb: 'Gear to train smarter at home or the gym.' },
  { slug: 'outdoor', name: 'Outdoor & Auto',  icon: '🚗', blurb: 'Travel, car and outdoor essentials.' },
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
