# Erabi — K/J-Beauty Content Plan

The site is now a **Korean & Japanese beauty** affiliate hub. Traffic strategy stays
the same: **Google** (buyer-intent search) + **Pinterest** (routines, aesthetics).

Two articles are already live as working examples:
- ✅ `korean-skincare-routine-for-beginners` (routine) — *featured*
- ✅ `cosrx-snail-mucin-vs-beauty-of-joseon-glow-serum` (comparison) — *featured*

Scaffold a new one with: `npm run new -- <review|comparison|listicle|routine> <slug> <category>`
Categories: `sunscreen` · `cleansers` · `toners` · `serums` · `moisturizers` · `routines`

---

## Tier 1 — "Money" pages (high buyer intent, write these first)

People searching these are ready to buy. Best conversion → prioritize.

| # | Working title | Type | Category | Target keyword | Products / notes |
|---|---|---|---|---|---|
| 1 | Best Korean Sunscreens for Every Skin Type (2026) | listicle | sunscreen | "best korean sunscreen" | Beauty of Joseon Relief Sun, Round Lab Birch, Skin1004, Isntree, Beauty of Joseon Aqua |
| 2 | Best Japanese Sunscreens: Anessa vs Biore vs Skin Aqua | comparison | sunscreen | "best japanese sunscreen" | Anessa Perfect UV, Biore UV Aqua Rich, Skin Aqua Tone Up |
| 3 | Best K-Beauty Snail Mucin (Not Just COSRX) | listicle | serums | "best snail mucin" | COSRX Snail 96, Mizon, Benton, Some By Mi Snail Truecica |
| 4 | Best Korean Cleansers for Oily / Acne-Prone Skin | listicle | cleansers | "best korean cleanser oily skin" | COSRX Low pH, Some By Mi AHA-BHA-PHA, Anua Heartleaf foam |
| 5 | Best Korean Moisturizers for Dry Skin | listicle | moisturizers | "best korean moisturizer dry skin" | Illiyoon Ceramide Ato, Belif Aqua Bomb, Cosrx Snail Cream |
| 6 | COSRX Snail Mucin vs Anua Heartleaf Toner | comparison | toners | "cosrx vs anua" | COSRX Snail 96 (B00PBX3L7K), Anua Heartleaf 77 (B08CMS8P67) |

## Tier 2 — Routines & skin-goal guides (Pinterest gold + email magnets)

The most *shareable* format. Each targets a skin type/goal and links a full basket.

| # | Working title | Type | Category | Target keyword | Products / notes |
|---|---|---|---|---|---|
| 7 | Korean Skincare Routine for Acne-Prone Skin | routine | routines | "korean skincare routine acne" | COSRX Low pH, Some By Mi, BHA products |
| 8 | Korean Skincare Routine for Oily Skin | routine | routines | "korean routine oily skin" | gel textures, mattifying picks |
| 9 | Anti-Aging Korean Routine (30s/40s) | routine | routines | "korean anti aging routine" | retinal, Glow Deep Serum, ginseng lines |
| 10 | Japanese Skincare Routine for Glass Skin | routine | routines | "japanese skincare routine" | Hada Labo Gokujyun, DHC oil, Anessa |
| 11 | Minimalist 4-Step Routine for Sensitive Skin | routine | routines | "minimalist korean routine" | Anua, Illiyoon, gentle SPF |

## Tier 3 — Viral / trust builders (top-of-funnel, feeds Pinterest & TikTok search)

Softer intent but high shareability and search volume. They pull people in; internal
links push them to Tier 1 money pages.

| # | Working title | Type | Category | Target keyword | Products / notes |
|---|---|---|---|---|---|
| 12 | How to Spot Fake COSRX & Beauty of Joseon on Amazon | listicle | serums | "fake cosrx amazon" | trust/safety angle → link official stores; huge search |
| 13 | K-Beauty vs J-Beauty: What's the Difference? | listicle | routines | "k beauty vs j beauty" | explainer; links to both routine pages |
| 14 | Hada Labo Gokujyun Hyaluronic Acid Lotion — Review | review | toners | "hada labo review" | single J-beauty hero (find ASIN) |
| 15 | Laneige Lip Sleeping Mask — Worth the Hype? | review | moisturizers | "laneige lip mask review" | viral gifting product (find ASIN) |

---

## Working principles

1. **One new active per article's "how to layer" advice** — keep it beginner-safe; this is YMYL (health-adjacent), so no medical claims, always a "patch-test / not medical advice" note.
2. **Every product = Amazon + YesStyle.** Set `yesstyle:` on each product (product name is enough — it falls back to a tagged YesStyle search once you add your network deep-link in `src/data/site.js`).
3. **Interlink aggressively.** Routines link to the individual product reviews/comparisons; comparisons link back to the relevant routine. Builds topical authority.
4. **Pinterest:** make 3–5 pin designs per article (set `pinImage`, 1000×1500). Fresh pins weekly beat one-and-done.
5. **Seasonality:** sunscreen content peaks spring/summer; "gift" angles (lip masks, sets) for Nov–Dec.

## Before you monetize (still required)

- Set `AFFILIATE_TAG` (real Amazon tag) and `SITE_URL` env vars — build currently warns they're placeholders.
- Join **Awin or ShareASale** for YesStyle, paste the deep-link template into `SITE.yesstyleDeepLink`.
- Amazon needs **3 qualifying sales in your first 180 days** to keep the account.
- Real product images require the Amazon Product Advertising API (placeholders are used for now — hotlinking Amazon images breaks their terms).
