import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Shared fields present on every article, regardless of template type.
const base = {
  title: z.string(),
  description: z.string(),
  // Keep in sync with the slugs in src/data/site.js CATEGORIES.
  category: z.enum(['home', 'kitchen', 'tech', 'fitness', 'outdoor']),
  updated: z.coerce.date(), // e.g. "July 2026" — coerced to a Date
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  heroImage: z.string().optional(),
  // Vertical 1000x1500 image tuned for Pinterest pins (optional).
  pinImage: z.string().optional(),
}

// A product as used inside listicles and single reviews.
const product = z.object({
  name: z.string(),
  image: z.string(),
  // Either a full Amazon URL or a bare ASIN — amazonLink() tags it for you.
  amazon: z.string(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().optional(),
  badge: z.string().optional(),
  price: z.enum(['$', '$$', '$$$']).optional(), // price tier only, never a hardcoded price
  bestFor: z.string().optional(),
  blurb: z.string().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
})

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.discriminatedUnion('type', [
    // ---- TEMPLATE 1: single product review ----
    z.object({
      type: z.literal('review'),
      ...base,
      rating: z.number().min(0).max(5),
      verdict: z.string(),
      product: product,
    }),
    // ---- TEMPLATE 2: side-by-side comparison table ----
    z.object({
      type: z.literal('comparison'),
      ...base,
      columns: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          sortable: z.boolean().default(false),
          type: z.enum(['text', 'number', 'rating']).default('text'),
          suffix: z.string().optional(),
        })
      ),
      // products carry the column keys as extra props → passthrough.
      products: z.array(
        product.extend({
          id: z.string(),
          highlight: z.boolean().default(false),
          order: z.number().default(0),
        }).passthrough()
      ),
    }),
    // ---- TEMPLATE 3: numbered "top 10" listicle ----
    z.object({
      type: z.literal('listicle'),
      ...base,
      items: z.array(product),
    }),
  ]),
})

export const collections = { articles }
