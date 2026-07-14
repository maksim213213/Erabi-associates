#!/usr/bin/env node
// Scaffold a new article:  npm run new -- review my-slug kitchen
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { CATEGORIES } from '../src/data/site.js'

const [type, rawSlug, category = 'sunscreen'] = process.argv.slice(2)
const types = ['review', 'comparison', 'listicle', 'routine']
if (!types.includes(type) || !rawSlug) {
  console.log('Usage: npm run new -- <review|comparison|listicle|routine> <slug> [category]')
  process.exit(1)
}

// Sanitize the slug: lowercase, keep [a-z0-9-], collapse the rest to '-'.
const slug = rawSlug
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-+|-+$/g, '')
if (!slug) {
  console.error(`Slug "${rawSlug}" contains no usable characters (need a-z, 0-9 or -).`)
  process.exit(1)
}
if (slug !== rawSlug) console.log(`Slug sanitized: "${rawSlug}" → "${slug}"`)

const categorySlugs = CATEGORIES.map((c) => c.slug)
if (!categorySlugs.includes(category)) {
  console.error(
    `Unknown category "${category}". Valid categories: ${categorySlugs.join(', ')}\n` +
    '(defined in src/data/site.js CATEGORIES)'
  )
  process.exit(1)
}

const dir = 'src/content/articles'
const file = `${dir}/${slug}.mdx`
if (existsSync(file)) { console.error(`${file} already exists`); process.exit(1) }

const common = `category: ${category}\nupdated: "${new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}"\nfeatured: false`

const templates = {
  review: `---
type: review
title: "TITLE"
description: "One-line summary for search + social."
${common}
rating: 4.5
verdict: "Your one-paragraph bottom line."
product:
  name: "Product name"
  image: "https://placehold.co/360x360"
  amazon: "ASIN_OR_URL"
  rating: 4.5
  reviews: 1000
  price: "$$"
  pros: ["Pro one", "Pro two"]
  cons: ["Con one"]
---

Intro paragraph.

## Who it's for
`,
  comparison: `---
type: comparison
title: "TITLE"
description: "One-line summary for search + social."
${common}
columns:
  - { key: "price", label: "Price", sortable: true, type: "text" }
  - { key: "rating", label: "Rating", sortable: true, type: "rating" }
  - { key: "bestFor", label: "Best for", sortable: false, type: "text" }
products:
  - id: "item-1"
    name: "Item 1"
    image: "https://placehold.co/200x200"
    amazon: "ASIN_OR_URL"
    order: 1
    highlight: true
    badge: "Best overall"
    price: "$$"
    rating: 4.7
    reviews: 1000
    bestFor: "Most people"
    blurb: "Why it wins."
---

Intro paragraph.

## Quick take
`,
  listicle: `---
type: listicle
title: "TITLE"
description: "One-line summary for search + social."
${common}
items:
  - name: "Item 1"
    image: "https://placehold.co/400x400"
    amazon: "ASIN_OR_URL"
    rating: 4.6
    reviews: 1000
    bestFor: "Something"
    blurb: "Why it's great."
---

Intro paragraph.

## How we picked
`,
  routine: `---
type: routine
title: "TITLE"
description: "One-line summary for search + social."
${common}
steps:
  - step: "Step 1 · Cleanser"
    when: "AM/PM"
    name: "Product name"
    image: "https://placehold.co/400x400"
    amazon: "ASIN_OR_URL"
    yesstyle: "Product name (YesStyle search) or full YesStyle URL"
    rating: 4.6
    reviews: 1000
    bestFor: "All skin types"
    blurb: "What this step does and why this product."
---

Intro paragraph.

## How to build this routine
`,
}

await mkdir(dir, { recursive: true })
await writeFile(file, templates[type])
console.log(`Created ${file}`)
