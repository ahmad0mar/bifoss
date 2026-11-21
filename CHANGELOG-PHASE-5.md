# Phase 5: motion diet and performance

Review lens: the `unslop` skill (checklist item "fade-and-slide on every section, hover lift, shimmer, marquee, confetti, typewriter, splash, pulsing dots").

## What changed

**Removed (files)**: `Hero3D.jsx`, `HeroBackdrop.jsx`, `RevealText.jsx`, `ScrambleText.jsx`, `SplashScreen.jsx`, `TopProgressBar.jsx` (a fake progress sweep, not tied to real loading), `useConfetti.js`, `useTypewriter.js`.

**Removed (packages)**: `three`, `@react-three/fiber`, `@react-three/drei`, `canvas-confetti`, and `framer-motion`. Nothing needs framer-motion any more: the page fade is CSS, and the accordion and dialog are Radix.

**Motion now**
- Page change: 150 ms opacity fade (`.page-fade` in `index.css`), no movement, no exit animation. Home has no entrance fade, so the terminal is its only non-user-triggered animation.
- Gone: section and card fade-up, hover lift on cards, footer stagger, ping dots (Events and EventDetail now show a static "Today" label and a static dot), 404 digit animation, bobbing quill and spinning star in empty states, scroll-to-top spring, share button swap animation, confetti on Join.
- Kept: link and button colour transitions, accordion and dialog (Radix), the terminal sequence, skeleton loading pulse (a loading state), the liquid tab bar.
- `MotionConfig` is gone. The `prefers-reduced-motion` rule in `index.css` still covers the CSS animation.

**CSS**: deleted `cursor-blink`, `word-fade-up`, `.word-reveal`. `.link-animated` stays (footer links use it).

**Fonts**: the two files needed for first paint (Bricolage Grotesque 700, IBM Plex Sans 400) are preloaded. `vite.config.js` has a small plugin that finds their hashed file names in the build and adds the `<link rel="preload">` tags, using Vite's `base`. It does nothing in dev. Weights loaded are unchanged (Bricolage 700, Plex Sans 400 and 600, Plex Mono 400).

**SmartImage**: `width` and `height` attributes (default 800 x 450, override per call), `decoding="async"`, lazy loading kept.

**Hosting**: `vercel.json` now sends `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (from `OPTIMISATION-PLAN.md` section 6).

## Definition of done

- [ ] JS bundle smaller than Phase 4: **not measured.** No network, so no build, and no "before" figure exists either. Expected to be much smaller (three, fiber, drei, framer-motion and canvas-confetti are gone), but record both sizes after `npm install && npm run build`.
- [ ] Lighthouse mobile: **not run.**
- [~] Exactly one non-user-triggered animation on Home: by reading the code, the terminal is the only one (no `animate-*`, infinite keyframes or entrance animations reachable from Home). Not confirmed with `document.getAnimations()` in a browser.

## How this was verified

- The sandbox has no network: `npm install`, lint, `vite build`, Lighthouse and axe did **not** run.
- Done: esbuild bundled `src/main.jsx` with every `@/` import resolving (catches missing files and syntax errors); each page and component also compiled alone; a script checked the edited files for unused imports (none); grep finds no leftover references to framer-motion, the deleted files, confetti or three in `src/`.
- Caught and fixed during this: one edit emptied `ShareButton.jsx`; the bundle check found it and it was rewritten.
- The font-preload plugin is untested. After a build, check that `dist/index.html` has two `rel="preload" as="font"` links and that the files exist in `dist/assets/`.

## Needs your action

- Run `npm install` (not `npm ci`): `package.json` changed and `package-lock.json` could not be regenerated here. Commit the new lock file.
- Then `npm run lint`, `npm run build`, record sizes here, run Lighthouse and axe.

## Found, not changed (outside Phase 5)

- `index.css` `.terminal-bar` uses `var(--terminal-rule)`, which is not defined, so the title-bar divider does not draw. Phase 6 or a one-line fix: define `--terminal-rule` (a slightly lighter terminal grey).
- Images (`OPTIMISATION-PLAN.md` section 1) were not touched: the navbar logo is still the 144 KB PNG and the og:image is 544 KB at 3:1.
- Tab bar idle-loading was not done.
