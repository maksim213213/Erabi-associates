# Product images — how they work here

Local images live in **`public/img/products/`** and are referenced from an article's
frontmatter with a root-relative path:

```yaml
image: "/img/products/cosrx-snail-96-essence.webp"
```

`public/` is served at the site root, so `public/img/products/x.webp` → `/img/products/x.webp`.

## Specs

| Use | Field | Size | Format |
|-----|-------|------|--------|
| Product thumbnail | `image:` on each product/step | ~600×600 square | `.webp` (or `.jpg`) |
| Article hero / OG | `heroImage:` | 1200×630 | `.jpg`/`.webp` |
| Pinterest pin | `pinImage:` | 1000×1500 vertical | `.jpg`/`.png` |

Keep thumbnails under ~80 KB — run them through squoosh.app or `sharp` before committing.

## Where images may legally come from

Amazon **forbids** copying/hotlinking product images from Amazon pages. Compliant sources,
best first:

1. **Affiliate network feed (the clean license).** Once you join **Awin or ShareASale**
   for YesStyle, the product feed includes images you're licensed to display. This is
   also required for the YesStyle buy-buttons — so it solves links *and* images at once.
2. **Amazon Product Advertising API** — licensed Amazon images, but only unlocked after
   your first qualifying sales.
3. **Official brand pages** (editorial/review use) — cosrx.com, anua.com,
   beautyofjoseon.com. Grab in a browser (their sites block bots). Confirm each brand's
   affiliate/press terms.
4. **Your own photos** — zero risk, best SEO/Pinterest performance.

## Sourcing checklist for the 5 products already in articles

Save each with the exact filename below into `public/img/products/`, then the paths get
wired into the two articles.

| Save as | Product | Official source page |
|---------|---------|----------------------|
| `cosrx-low-ph-cleanser.webp` | COSRX Low pH Good Morning Cleanser | cosrx.com/products/low-ph-good-morning-gel-cleanser |
| `anua-heartleaf-77-toner.webp` | Anua Heartleaf 77 Toner | anua.com/products/heartleaf-77-soothing-toner |
| `cosrx-snail-96-essence.webp` | COSRX Advanced Snail 96 Essence | cosrx.com/products/advanced-snail-96-mucin-power-essence |
| `beauty-of-joseon-glow-deep-serum.webp` | Beauty of Joseon Glow Deep Serum | beautyofjoseon.com/products/glow-deep-serum-rice-alpha-arbutin |
| `beauty-of-joseon-relief-sun.webp` | Beauty of Joseon Relief Sun SPF50+ | beautyofjoseon.com (Relief Sun page) |

Until real images land, the articles use styled `placehold.co` placeholders (safe, no
copyright). The site renders fine without them.
