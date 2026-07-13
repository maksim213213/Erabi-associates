import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { SITE, amazonLink } from './src/data/site.js'

// ------------------------------------------------------------
// Placeholder guard: never let placeholder config reach production.
// Fails the build on Netlify; only warns for local `npm run build`.
// ------------------------------------------------------------
const placeholders = []
if (SITE.affiliateTag === 'yourtag-20') placeholders.push('SITE.affiliateTag is still "yourtag-20"')
if (SITE.url.includes('your-site')) placeholders.push(`SITE.url is still "${SITE.url}"`)
if (placeholders.length > 0) {
  const msg =
    `Placeholder config detected in src/data/site.js:\n  - ${placeholders.join('\n  - ')}\n` +
    'Set your real Amazon Associates tag and domain before deploying.'
  if (process.env.NETLIFY) {
    throw new Error(msg)
  }
  console.warn('\n' + '!'.repeat(64) + `\n!!  WARNING\n!!  ${msg.split('\n').join('\n!!  ')}\n` + '!'.repeat(64) + '\n')
}

// ------------------------------------------------------------
// Rehype plugin: any raw <a> pointing at Amazon inside MDX bodies
// gets the affiliate tag plus the same rel/target treatment as
// BuyButton — authors can paste plain links without leaking clicks.
// ------------------------------------------------------------
function rehypeAmazonLinks() {
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href
      if (typeof href === 'string' && href.includes('amazon.')) {
        node.properties.href = amazonLink(href)
        node.properties.rel = ['sponsored', 'nofollow', 'noopener', 'noreferrer']
        node.properties.target = '_blank'
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  return (tree) => visit(tree)
}

// Set SITE.url in src/data/site.js to your real domain before deploying.
export default defineConfig({
  site: SITE.url,
  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
  markdown: { rehypePlugins: [rehypeAmazonLinks] },
})
