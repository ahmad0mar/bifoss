# Phase 2: accessibility and contrast

## What changed

**Colour tokens** (`src/index.css`, `tailwind.config.js`)
- Added `--orange-fill` (#FF8500), `--orange-fill-hover` (#FFB066), `--orange-ink` (#9A4300), `--orange-ink-hover` (#7A3500) and `--ink` (#101214). Tailwind names: `bg-brand-orange-fill`, `text-brand-orange-ink`, `hover:text-brand-orange-ink-hover`, `text-brand-ink`.
- Bright orange is now only a fill, with ink text on top. Every orange text use (active nav, links, "All events" and "All posts", Team GitHub icon, FAQ hover, icons, share button, prose links, TODO flag, ghost button hover) uses `--orange-ink`.
- `--muted` changed from #77716C to #5A5F66 (it was 4.4:1 on the peach surface).
- shadcn tokens: `--primary-foreground` is now ink, `--ring` and `--accent-foreground` use the deep orange, `--muted-foreground` darkened. The shadcn `link` button variant uses the deep orange.
- Focus rings (global and keyboard-nav) changed from bright orange to `--orange-ink`. Bright orange on the cream page was 2.33:1; the deep orange is 6.32:1.
- `.headline` no longer uses a transparent gradient clip; it is a plain colour.
- `.link-animated` underline uses `--orange-ink`.

**White text on orange replaced by ink:** `.btn-brand`, navbar mobile CTA, skip link, scroll-to-top button, numbered step badges (Home and Join), track icons, active Events filter.

**Reduced motion**
- `main.jsx` wraps the app in `<MotionConfig reducedMotion="user">`.
- `AnimatedPage` renders a plain div when reduced motion is on.
- `SplashScreen` does not show when reduced motion is on.
- Confetti passes `disableForReducedMotion: true`.
- Checked in Chromium with `prefers-reduced-motion: reduce` on `/`, `/events` and `/join`: zero running animations and no splash. Without the preference, the splash, button shimmer, cursor blink and word reveals do run (these are removed in phase 5).

**Hero typewriter:** the pill has `aria-live="off"` and a fixed `min-height` (3.25rem on phones, 2.25rem from 640px) so the text changing no longer moves the headline.

**ARIA errors found by axe and fixed**
- `RevealText` put `aria-label` on a `<span>` (not allowed). It now renders a visually hidden copy of the text and keeps the animated words `aria-hidden`.
- "Happening today" dot and the 404 digits got `role="img"` so their `aria-label` is valid.

**Touch targets (44px):** `.btn-brand` and `.btn-ghost` have `min-height: 44px`; desktop and mobile nav links, logo link, footer links and email, footer social buttons, share button, "All events" and "All posts" links.

## Text and background pairs checked (WCAG ratios, computed)

| Text | Background | Ratio | Where |
|---|---|---|---|
| Ink #101214 | Orange #FF8500 | 7.69 | buttons, badges, filter, scroll-to-top |
| Ink #101214 | #FFB066 | 10.42 | button hover |
| Deep orange #9A4300 | Page #FFF9F1 | 6.32 | links, active nav, focus ring |
| Deep orange #9A4300 | White #FFFFFF | 6.61 | cards, navbar |
| Deep orange #9A4300 | #FFF3E6 | 6.05 | active nav pill, share button |
| Deep orange #9A4300 | #FFE3C7 | 5.37 | pill labels, hover surfaces |
| Hover orange #7A3500 | #FFF3E6 / #FFF9F1 | 8.22 / 8.59 | link hover |
| Muted #5A5F66 | #FFF9F1 / #FFF3E6 / #FFFFFF / #FFE3C7 | 6.15 / 5.89 / 6.43 / 5.23 | secondary text |
| Body #191919 | #FFF9F1 | 16.81 | body and headings |

Before: white on orange 2.44, orange text 2.33, `#E87500` pill text 2.88, muted on peach 4.40.

## Verification

- `npm run lint`: passes. `npm run build`: passes (Linux sandbox, fresh `npm install`).
- axe-core (wcag2a, wcag2aa, wcag21aa, best-practice) in headless Chromium on `/`, `/join`, `/events`, `/about`, `/projects`, `/team`, `/blog`, `/code-of-conduct` and a 404 route, at 1280px and 360px: zero violations on all 18 runs, no horizontal scroll. The first run found the `aria-prohibited-attr` errors listed above; they are fixed.
- `npm run check -- --dist` reports `TODO:` in `dist/assets/Todo-*.js`. That is the dev-only helper's own code (`indexOf("TODO:")`, `startsWith("TODO")`), not visitor text, so the check gives a false positive on it. Rendered text of all eight content routes in Chromium contains no "TODO" (the only "fill in" match is the real copy "Fill in the join form"). Phase 6 should make `check-config.js` ignore code strings.
- Touch-target scan of every link and button: all at least 44px high. One exception: the inline "code of conduct" link inside a sentence on the Join page is 23px high; inline text links are exempt under WCAG 2.5.8 and were left alone.

## Not done / left for later

- Lighthouse was not run (axe only).
- Not tested in Safari, Firefox, on real phones, or with a screen reader. Forced-colors mode not tested.
- The splash, button shimmer, cursor blink, word reveal, hover lifts and fades still run when reduced motion is **off**; phase 5 removes them. Opacity-only fades in framer-motion still play under reduced motion (position and scale animations are disabled); they are not motion in the WCAG sense.
- Form-control border contrast (3:1) was not checked because the site has no text inputs; the Join form is external.
- Hard-coded hex values and the cream/orange look are left for phase 3 (design system). The `.pill-label` and `.page-glow` classes were only recoloured, not removed.
