# PickWise — Amazon Associates content hub

A scalable, SEO-first affiliate site built with **Astro** (static HTML) + **React islands**
for interactivity. Replaces the old single comparison one-pager. Add articles by dropping
`.mdx` files into `src/content/articles/` — the homepage, category pages, sitemap and
routing update automatically.

## Run it

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # static site into ./dist  (this is what Netlify deploys)
```

Deploy: push to Git and connect to Netlify (config already in `netlify.toml`), or drag the
`dist/` folder into Netlify. Works on Vercel/Cloudflare Pages too.

## Before you go live (edit `src/data/site.js`)

- `SITE.url` — your real domain (used for canonical URLs, OG tags, sitemap).
- `SITE.affiliateTag` — your Amazon Associates tag (e.g. `yourtag-20`). **Every**
  affiliate link is tagged with this automatically, so you never hardcode tags in articles.
- `SITE.name`, `tagline`, `author`.
- `CATEGORIES` — add/remove rubrics. Each needs a unique `slug`.
- Add `/public/og-default.jpg` (1200×630) for social sharing.

## Three article templates

Set `type:` in the frontmatter. Schema is enforced in `src/content.config.ts`.

1. **`review`** — single-product deep dive (pros/cons, verdict, star rating).
2. **`comparison`** — sortable side-by-side table (the interactive React island).
3. **`listicle`** — numbered "top 10" roundup.

`amazon:` accepts a bare **ASIN** (e.g. `B07FDJMC9Q`) or a full Amazon URL — either way it's
converted to a clean, affiliate-tagged link at build time.

## Add a new article

```bash
npm run new -- review my-air-fryer kitchen
npm run new -- comparison best-blenders-2026 kitchen
npm run new -- listicle 10-desk-gadgets tech
```

This scaffolds a ready-to-fill `.mdx` file with the correct frontmatter. Set `featured: true`
to surface it on the homepage.

## Structure

```
src/
  data/site.js          # ← global config: domain, affiliate tag, categories
  content.config.ts     # article schema (3 types) — enforced at build
  content/articles/     # ← your articles live here (*.mdx)
  layouts/              # BaseLayout (head/SEO), ArticleLayout (chrome + related)
  components/           # BuyButton, Stars, Disclosure, ComparisonTable island, cards…
  pages/                # homepage, /articles/[slug], /category/[category], 404, disclosure
public/                 # favicon, og images (robots.txt is generated at build)
```

## Compliance built in

- FTC/Amazon **affiliate disclosure** renders above the first link on every article, plus a
  standalone `/disclosure` page and footer notice.
- All affiliate links use `rel="sponsored nofollow noopener"` and `target="_blank"`.
- Keep price as a **tier** (`$`, `$$`, `$$$`) rather than a hardcoded dollar amount — Amazon's
  terms prohibit displaying scraped/stale prices.
