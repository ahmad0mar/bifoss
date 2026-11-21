# Optimisation plan

Performance and weight work for the BIFOSS site, in the order it should be done. Read with `UI-IMPROVEMENT-PLAN.md`: items marked **Phase 5** are already in that plan; the rest are extra.

**Honesty note.** No production build could run while writing this (no network in the sandbox), so there is **no measured JS or CSS baseline** here. Numbers below are marked *measured* (taken from real files or test conversions) or *to measure* (you must record them). Do step 0 before any change, or you cannot prove an improvement.

## 0. Measure first (30 minutes)

1. `npm install`, `npm run build`, and write the size of every file in `dist/assets/` into `CHANGELOG-PHASE-5.md` as the "before" figure.
2. Add `rollup-plugin-visualizer` as a dev dependency and open its treemap once, to see what is big. Remove it afterwards if you like.
3. Run Lighthouse (mobile, simulated throttling) on `/`, `/events` and `/about`. Record Performance, LCP, CLS and total blocking time.
4. Test on a real mid-range Android phone over mobile data. Many members will visit from a phone, and Lighthouse is only a rough guide.

Targets (from the plan): Lighthouse mobile Performance 90+, Accessibility 100, Best Practices 95+; JS smaller than after Phase 4.

## 1. Images (biggest known win, almost no risk)

*Measured from the files in `public/images/brand/`:*

| File | Size now | Where it is used |
|---|---|---|
| `bifoss-wordmark-sm.png` | 144,110 bytes (937 px wide) | navbar logo, shown about 115 px wide; splash |
| `bifoss-wordmark.png` | 456,778 bytes (1874 px wide) | `srcSet` 2x candidate |
| `bifoss-logo-full.png` | 553,425 bytes (2172 x 724) | `og:image` and `twitter:image` only |

*Test conversions (measured):* the wordmark resized to 240 px wide is 17,649 bytes as optimised PNG and 8,714 bytes as WebP; at 480 px it is 50,330 PNG and 19,906 WebP. A 1200 x 630 social image is about 40,888 bytes as JPEG.

Do:
- [ ] Replace the navbar and splash logo with a 240 px and 480 px pair (WebP with PNG fallback, or an SVG if the logo can be redrawn as vector, which would be smaller still). The navbar logo is about 115 px wide, so the current 144 KB file is roughly eight times what it needs. Keep `width` and `height` attributes.
- [ ] Make a proper `og:image` at 1200 x 630 (JPEG, under 100 KB). The current one is 3:1, so social previews crop it, and 553 KB is heavy for a crawler.
- [ ] Delete `bifoss-wordmark.png` and the 1874 px `srcSet` entry once the pair above exists.
- [ ] Rule for contributors, in the README: images added to `public/images/events|blog|team|projects` are at most 1600 px wide, WebP or JPEG, under 200 KB, always with `alt`. Team photos can be 400 px. Phase 5 already makes `SmartImage` lazy with explicit `width` and `height`.
- [ ] Optional: a `scripts/optimise-images.js` using `sharp` that resizes and converts everything in `public/images` on demand, so non-developers drop in a photo and run one command.

## 2. JavaScript

- [ ] **Phase 5:** delete `three`, `@react-three/fiber`, `@react-three/drei`, `canvas-confetti`, and the files that use them. This is the largest known removal, and Home no longer imports any of it. *To measure* the saving: compare `dist/assets` before and after.
- [ ] **Phase 5:** delete `SplashScreen`, `ScrambleText`, `RevealText`, `useTypewriter`, `useConfetti`.
- [ ] After Phase 5, `framer-motion` is only needed for the page fade, the mobile menu and the accordion. Check whether the page fade can be a small CSS transition and the rest CSS or Radix. If `framer-motion` can go entirely, remove it (*to measure*: usually a noticeable share of a small site's JS). Do this only if the motion still looks right; if it needs more than an hour, skip it.
- [ ] Pages are already lazy-loaded in `App.jsx`. Keep that. `react-markdown` is only used on `EventDetail` and `BlogDetail`, so it already stays out of the Home chunk; confirm in the treemap.
- [ ] The liquid glass tab bar draws with raw WebGL. Load it after first paint (`requestIdleCallback`, with a plain styled tab bar as the first render and the fallback when WebGL is missing or the visitor prefers reduced motion). This keeps it off the critical path without removing it.
- [ ] Only if the treemap shows one oversized vendor chunk: `build.rollupOptions.output.manualChunks` for `react`, `react-dom`, `react-router-dom`, so they cache across deploys. Do not do this before you have measured.

## 3. Fonts

- [ ] **Phase 5:** self-host only the weights used (Bricolage 700, Plex Sans 400 and 600, Plex Mono 400; already the case) and add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the two used on first paint (Bricolage 700 for the headline, Plex Sans 400 for body). Check the hashed file names in `dist/` after a build.
- [ ] Confirm `font-display: swap` (the `@fontsource` CSS sets it) and that the fallback stack in `--font-sans` and `--font-display` has similar metrics, to avoid a visible jump. `font-medium` (500) and `font-bold` on Plex Sans fall back to 400 and 600, so avoid adding new weights.
- [ ] Plex Mono 400 loads on every page but is only needed on Home and blog posts. Leave it unless the font numbers say otherwise (it is small).

## 4. CSS

- [ ] **Phase 5:** delete `cursor-blink`, `word-fade-up`, `.word-reveal`, `.link-animated` if unused, and any other dead keyframes. Marquee CSS was already removed in Phase 4.
- [ ] Tailwind already removes unused utilities from the build. Check the built CSS size in step 0; there is nothing else to do unless it is unexpectedly large.

## 5. Runtime and layout stability

- [ ] **Phase 5:** exactly one non-user-triggered animation on Home (the terminal). Check with `document.getAnimations()` in the console; the Phase 4 test page showed none infinite.
- [ ] LCP element on Home is the h1 text (no hero image), so after fonts are preloaded it should be fast. Record LCP in step 0 and after.
- [ ] Cumulative layout shift: the terminal panel keeps the same height from the first frame (286 px at desktop width in the harness), the logo has width and height, and Phase 5 adds them to `SmartImage`. Re-check CLS after the font change.

## 6. Hosting and caching

- [ ] **Vercel:** add to `vercel.json` a `headers` rule giving `/assets/(.*)` `Cache-Control: public, max-age=31536000, immutable` (Vite file names include a hash). Keep `index.html` uncached or short-lived.
- [ ] **GitHub Pages:** you cannot set headers; it already serves with short caching. Nothing to do, but note it, so nobody chases it.
- [ ] Put the domain behind Cloudflare's free plan only if traffic ever justifies it. Not needed for a club site.
- [ ] The `404.html` and `_redirects` SPA fallback must keep working after any build change (it is in the Phase 6 QA list).

## 7. Keep it fast (once, then forget)

- [ ] Add a size budget to the hand-off routine: after `npm run build`, the largest JS file stays under a number you set from the Phase 5 "after" figure plus 10 percent. A one-line script in `scripts/` is enough.
- [ ] Re-run Lighthouse after adding the first real photos, the first blog post and the real team list. Content, not code, is what slows a club site down.

## Suggested order

1. Step 0 (measure).
2. Images (section 1): quick, large, safe.
3. Phase 5 as written (sections 2 to 5 items marked Phase 5).
4. Font preload, tab-bar idle load, caching headers.
5. `framer-motion` removal and `manualChunks` only if the measurements say they matter.
