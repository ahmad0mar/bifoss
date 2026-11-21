# BIFOSS website: UI/UX improvement plan

Source reviewed: `bifoss-phase5.zip` (Vite + React 18 + Tailwind + Framer Motion + react-three-fiber). This file lives at the project root as `UI-IMPROVEMENT-PLAN.md` and travels inside every phase zip.
Review lens: the Anthropic `frontend-design` ("unslop") skill.
Starting score: **4.5 / 10**. Target after Phase 6: **8+ / 10**.

---

## Status and instructions for the AI doing the work

**To the owner:** to continue, give the next AI the latest zip and say: *"Read UI-IMPROVEMENT-PLAN.md and HANDOFF.md, then do the next phase and stop."*

**To the AI:** read this whole file and `HANDOFF.md` before changing anything. Then:

1. Find the first phase below that is not marked done. Do **only that phase**.
2. Follow its tasks and its Definition of done exactly. Respect the **Decisions made** section.
3. Do not invent facts (links, fees, dates, names). Leave values empty and keep them listed in `HANDOFF.md`.
4. Finish with the hand-off routine, then update this status table, `HANDOFF.md` and `CHANGELOG-PHASE-N.md`, deliver the zip, and stop.
5. Be honest about what was and was not verified. If `npm run build` or a browser check could not run, say so in the changelog. Never imply it passed.

| Phase | Focus | Status | Zip |
|---|---|---|---|
| 1 | Hand-over readiness | **Done** (build not yet confirmed by the owner) | `bifoss-ui-phase1.zip` |
| 2 | Accessibility and contrast | **Done** (axe clean, build passes; Lighthouse not run) | `bifoss-ui-phase2.zip` |
| 3 | Design system | **Done** (axe clean, build passes; Lighthouse not run) | `bifoss-ui-phase3.zip` |
| 4 | Home page rebuild (terminal hero) | **Done** (lint, build and axe not run: no network; see `CHANGELOG-PHASE-4.md`) | `bifoss-ui-phase4.zip` |
| 5 | Motion diet and performance | **Done** (lint, build, Lighthouse not run: no network; see `CHANGELOG-PHASE-5.md`) | `bifoss-ui-phase5.1.zip` |
| 6 | Inner pages, copy, final QA | **Done** (no build, lint or browser could run; see `CHANGELOG-PHASE-6.md`) | `bifoss-ui-phase6-final.zip` |

### Environment notes (learned in phases 1 to 4)

- Phase 2: the zip had no `node_modules`; `npm install` worked in the sandbox, and `npm run lint` and `npm run build` both ran. Playwright's Chromium was available (`python3 -m playwright install chromium`), and `axe-core` installs from npm, so a real browser check is possible. Start `vite preview` and run the test in the **same** shell command (a background server does not survive between tool calls), and do not use `pkill -f "vite preview"` (it kills the calling shell).

- The `node_modules` that came with the original zip was installed on **Windows**. On Linux, `vite build` fails with "Cannot find module @rollup/rollup-linux-x64-gnu", and `node_modules/.bin` files lose their execute permission. If the sandbox has network, run `rm -rf node_modules && npm install` first. If it does not, run lint with `node node_modules/eslint/bin/eslint.js . --quiet` and say plainly that the build could not run.
- A fallback check that worked without a build: server-render each page with `react-dom/server` using the installed `typescript` package to transpile JSX, stub `lucide-react`, and give `window`, `SVGElement` and `matchMedia` simple stubs. It catches runtime crashes and leftover "TODO" text, but it is not a browser test.
- Phase 3: `npm install @fontsource/...` and `axe-core` both work in the sandbox. Keep QA scripts outside the project folder (axe-core installed in a separate scratch folder so `package.json` stays clean). Colours that canvas or WebGL code needs are read with `token('--name')` from `src/lib/tokens.js`, so no hex appears in JS.
- Phase 4: the sandbox had **no network** and the zip's `node_modules` was empty folders, so `npm install`, lint, build and axe all failed to run. A throwaway esbuild + Tailwind harness (global tools in `/opt/npm-tools`) rendered the real Home page for screenshots and behaviour checks; keep it outside the project. If network is available next time, run the full hand-off routine first. A Tailwind class extractor must not split on `(` or `)`, or arbitrary values like `grid-cols-[minmax(0,1fr)_...]` silently vanish.
- Phase 5: again no network. esbuild (in `/opt/npm-tools`) can bundle `src/main.jsx` with `--packages=external --alias:@=./src --format=esm` to catch missing imports and syntax errors. When writing files from Python, never `open(p,'w').write(open(p).read())`: it truncates the file first.
- Phase 6: no network and no browser (no Chromium), so no build, lint, axe or screenshots. Only Tailwind **v4** was installed in `/opt/npm-tools` (the project is v3), so the real CSS could not be compiled. What did run: esbuild bundling of both a populated and an empty-content scenario, and a server-render of all 11 routes (plus an unknown event and post) through `react-dom/server`, with the router, icons and Markdown stubbed and `import.meta.glob` replaced by fake content. A Python scan of that HTML checks TODO text, middle dots, heading levels, link targets and animation classes. The sitemap plugin was run on its own with a fake build context. Keep these scripts outside the project folder.
- Some files use CRLF line endings (Windows). Preserve them or normalise them consistently when editing.
- Zips contain a single top-level folder `bifoss-ui-phaseN/` and exclude `node_modules`, `dist` and `.git`.

---

## How to use this plan

1. Work **one phase at a time**, in order. Each phase builds on the one before.
2. Every phase ends with the same **hand-off routine** (see below): build, lint, check the definition of done, write a changelog, then **produce a zip and stop**.
3. Do not start the next phase until the zip for the current one has been delivered and approved.
4. Anything not listed in a phase is out of scope for that phase. Do not "fix a few extra things" and blur the zips together.

### Hand-off routine (end of every phase)

```bash
npm install
npm run lint          # must pass with zero errors
npm run build         # must pass
```

Then:

1. Tick every box in the phase's **Definition of done**. If one cannot be ticked, say so plainly in the changelog.
2. Add `CHANGELOG-PHASE-N.md` at the project root: what changed, which files, what is deliberately left for later.
3. Create the zip, excluding dependencies and git history:

```bash
# from the folder that contains the project folder
mkdir -p ../pkg/bifoss-ui-phaseN
tar --exclude=./node_modules --exclude=./dist --exclude=./.git -cf - . | tar -xf - -C ../pkg/bifoss-ui-phaseN
cd ../pkg && zip -r bifoss-ui-phaseN.zip bifoss-ui-phaseN
```

4. Deliver the zip (`bifoss-ui-phase1.zip`, `bifoss-ui-phase2.zip`, and so on) with a short summary, then **wait**.

The `dist/` folder is excluded because it is rebuilt by `npm run build`. If a built copy is wanted as well, name it `bifoss-ui-phaseN-dist.zip`.

---

## Decisions made

- **No 3D.** The 3D hero is removed completely (confirmed by the owner). Phase 5 deletes it and its libraries. There is no "extruded logo" option.
- **Hero = terminal panel** showing a first contribution (spec in Phase 4).
- **Hand-over:** the join link, email, address and socials are supplied later by someone else. The site must work with them empty (done in Phase 1).

---

## The problems, ranked

| # | Problem | Severity | Fixed in |
|---|---|---|---|
| 1 | The Join button is missing (`joinUrl` is empty) and TODO text shows on public pages (footer email and address, FAQ, Team, Projects, example event). Real values arrive after hand-over, so the site must degrade gracefully | Critical | Phase 1 |
| 2 | White text on the orange button is 2.44:1; orange text links are 2.33:1 (WCAG needs 4.5:1) | Critical | Phase 2 |
| 3 | The design is the default AI kit: cream + orange + Poppins, identical rounded cards, pill eyebrows, gradient orbs | High | Phases 3, 4 |
| 4 | The hero shows abstract polyhedra and ignores the subject (open source); replaced by the terminal panel | High | Phase 4 |
| 5 | A dozen scattered effects and no single memorable moment; Framer Motion ignores reduced-motion | High | Phase 5 |
| 6 | Same steps, tracks and FAQ repeated across Home, About and Join | Medium | Phase 4, 6 |
| 7 | Headline gradient (`#191919` to `#2A2421`) is invisible and adds `color: transparent` for nothing | Medium | Phase 3 |
| 8 | three.js + react-three-fiber + drei shipped for decoration | Medium | Phase 5 |

---

## Phase 1: Make it hand-over ready (content and conversion)

**Status: done** (`bifoss-ui-phase1.zip`). Lint passed; the build still needs to be run on the owner's machine.

**Goal:** the site never shows a TODO or a dead button to a visitor, and the person receiving it knows exactly which values to fill in and where.

The real join link, email, address and social links are not available yet. Someone else will supply them after hand-over. So this phase does **not** invent values. It makes every missing value fail quietly and makes the hand-over a ten-minute job.

### Tasks

- [ ] Keep all site-wide values in `src/data/site.js` only (`joinUrl`, `email`, `address`, `domain`, `social`). Leave them empty (`''`), not `TODO@...` strings.
- [ ] **Join button, empty `joinUrl`:** show a designed fallback, not a dashed TODO tag. Suggested text: "Membership details are coming soon." with a link to the Events page. When `joinUrl` is filled, the same spot becomes the real "Join BIFOSS" button with no other code change. Apply this in one shared `JoinButton` component used by Home, Join and the navbar so it behaves identically everywhere.
- [ ] **Footer and Join page:** hide the email and address lines when empty. Social buttons already hide when `url` is empty.
- [ ] **FAQ answers with TODO** (who can join, membership fee, meeting time): reword each so it reads correctly with no placeholder, for example "Membership details will be announced here soon." Mark the real value as a field the recipient fills (`faqs` in `src/data/home.js`).
- [ ] **Team and Projects:** empty entries show a designed empty state ("The team list is coming soon"), not a fake card.
- [ ] Delete `todo-example-event.md` and `todo-example-post.md` so Home's "Coming up" shows its real empty state. Keep the `_TEMPLATE.md` files.
- [ ] Make `Todo`, `TodoText` and the FAQ `renderAnswer` render **nothing in production** (`import.meta.env.PROD`), as a safety net.
- [ ] Add `scripts/check-config.js` and an `npm run check` script. It reads `site.js` and prints which values are still empty, for example `joinUrl: MISSING`, `email: MISSING`. It only warns and never fails the build.
- [ ] Write `HANDOFF.md` at the project root, a checklist for the next person:
  1. Set `joinUrl` in `src/data/site.js`
  2. Set `email`, `address`, `domain`, and update `public/CNAME` to match
  3. Fill social links (leave empty to hide)
  4. Fill the three FAQ answers in `src/data/home.js`
  5. Add team members in `src/data/team.json` and projects in `src/data/projects.json`
  6. Add the first event from `src/content/events/_TEMPLATE.md`
  7. Run `npm run check`, then `npm run build`
- [ ] Add a real `og:image` and `twitter:card` in `index.html` (this is design work and does not need the missing links).

### Definition of done

- [ ] `grep -rni "todo" dist/` returns nothing visitor-facing after `npm run build`, with all values still empty.
- [ ] Every page looks complete with an empty `site.js`: no dead buttons, no blank lines, no placeholder cards.
- [ ] Filling `joinUrl` alone turns every join fallback into the real button.
- [ ] `npm run check` lists exactly what is still missing, and `HANDOFF.md` matches it.

**Deliver:** `bifoss-ui-phase1.zip`

---

## Phase 2: Accessibility and contrast

**Status: done** (`bifoss-ui-phase2.zip`). See `CHANGELOG-PHASE-2.md` for the pairs checked and what was not run.

**Goal:** the brand orange stops failing contrast, and reduced-motion is honoured everywhere.

### Contrast rules

Measured ratios for the existing palette, and the replacements:

| Use | Current | Ratio | Replace with | Ratio |
|---|---|---|---|---|
| White text on orange button | `#FFFFFF` on `#FF8500` | 2.44 | Ink `#101214` on `#FF8500` | 7.69 |
| Orange link/active text on page | `#FF8500` on `#FFF9F1` | 2.33 | Deep orange `#9A4300` on `#F5F6F4` | 6.10 |
| Pill label text | `#E87500` on white | 3.01 | Deep orange `#9A4300` | 6+ |
| Muted body text | `#77716C` on `#FFF3E6` | 4.4 | `#5A5F66` on `#F5F6F4` | 5.94 |

The bright orange (`#FF8500`) stays as a **fill** (buttons, marks, highlights) with dark ink on top. Orange **text** uses the deep orange.

### Tasks

- [x] Add two tokens in `index.css`: `--orange-fill: #FF8500` and `--orange-ink: #9A4300`. Update `.btn-brand` to dark text, and move every `text-brand-orange` (active nav, prose links, "View repository", FAQ hover, Team GitHub icon) to `--orange-ink`.
- [x] Remove the `.headline` gradient-clip. Use a plain colour. (`color: transparent` breaks in forced-colors mode and the gradient is invisible anyway.)
- [x] Wrap the app in `<MotionConfig reducedMotion="user">` in `main.jsx` so Framer Motion transforms respect `prefers-reduced-motion`.
- [x] Hero typewriter: give the container a fixed `min-height` to stop layout shift, and add `aria-live="off"` so screen readers are not spammed. (This is removed entirely in Phase 5, so keep the fix minimal.)
- [x] Check the 44px minimum touch target on every link and button, including footer links and the FAQ trigger.
- [x] Keep the existing skip link and `:focus-visible` rings. Check they still meet 3:1 against the new colours.

### Definition of done

- [x] Every text/background pair is at least 4.5:1 (large text at least 3:1). List the pairs checked in the changelog.
- [x] With "reduce motion" on, no card, page or menu transitions play.
- [x] axe-core (run in Chromium via Playwright) reports zero violations on Home, Join and Events and six other routes at 1280px and 360px. Lighthouse was not run.

**Deliver:** `bifoss-ui-phase2.zip`

---

## Phase 3: Design system (a deliberate identity)

**Status: done** (`bifoss-ui-phase3.zip`). See `CHANGELOG-PHASE-3.md`.

**Goal:** replace the default look with tokens chosen for a free-software club.

### Direction

BIFOSS is a student open source club. Its world is terminals, commit logs, diffs, READMEs, licences and pull requests. The site should look like it came from that world: plain, legible, a little technical, and warm because the club is for beginners. Orange stays because the logo is orange, but it becomes a **signal**, not a wash.

### Tokens

**Colour** (4 base values and one signal):

| Name | Hex | Role |
|---|---|---|
| Paper | `#F5F6F4` | page background (cool off-white, not cream) |
| Ink | `#101214` | text, headings, primary button text |
| Rule | `#D9DBD6` | dividers and borders (decorative only) |
| Terminal | `#16181B` | code and terminal panels |
| Orange | `#FF8500` | fills and highlights |
| Deep orange | `#9A4300` | orange used as text |

Drop `--surface-2` peach, `--brown-900`, `--peach-gradient` and `--brand-gradient`. No gradient washes, no blurred orbs.

**Type** (self-host with `@fontsource` instead of Google Fonts; both are open-licence, which suits a FOSS club):

- Headlines: **Bricolage Grotesque**, weight 700, tight tracking. It has real character at large sizes.
- Body and UI: **IBM Plex Sans**, 400 and 600.
- Mono: **IBM Plex Mono**, used **only** for real code, commands and the terminal panel. Not for small decorative labels.
- Scale: 1.250 ratio. Body 17px at 1.6 line height. Headings 1.05 to 1.15. Keep prose lines under 70 characters.

**Layout principles:**

1. Left-aligned. Stop centring everything.
2. One border radius for controls (`0.5rem`) and a different, larger one only for the single hero panel. Not `rounded-3xl` on everything.
3. Structure carries meaning. A rule, a number or a border must say something about the content. Remove it if it does not.
4. One bold move per page; everything else is quiet.

### Tasks

- [x] Replace the `:root` tokens in `index.css` and the `brand.*` colours in `tailwind.config.js`.
- [x] Swap fonts via `@fontsource` packages and update `--font-sans`, a new `--font-display`, and `--font-mono`. Remove the Google Fonts `<link>` tags from `index.html`.
- [x] Rebuild `.btn-brand`, `.btn-ghost`, `.prose-bifoss` and the shadcn `ui/` components on the new tokens.
- [x] Delete `.pill-label`, `.page-glow`, `.headline` (gradient version), `.skeleton` shimmer colours and the `.btn-brand::after` shimmer.
- [x] Add a `/design` section to the repo README (colours, type scale, spacing) so future contributors do not drift.

### Definition of done

- [x] No hard-coded hex values remain in `src/` outside `index.css` and the Tailwind config.
- [x] No gradients and no blur orbs remain in the design.
- [x] Phase 2 contrast ratios still pass with the new tokens.

**Deliver:** `bifoss-ui-phase3.zip`

---

## Phase 4: Home page rebuild

**Status: done** (`bifoss-ui-phase4.zip`). See `CHANGELOG-PHASE-4.md` for what was and was not verified.

**Goal:** the first screen says "open source club", and the sections stop looking identical.

### Hero (the one memorable thing): a terminal panel

Replace the 3D shapes with a dark **terminal panel** that tells the story of a first contribution in five commands. Headline, one supporting sentence and two buttons on the left; the panel on the right. It is the only dark block on a light page, so the eye goes straight to it.

```
+----------------------------------------------------------------+
|  bifoss                          About  Events  Projects  Join |
+----------------------------------------------------------------+
|                                  +-----------------------------+
|  Build in the open,              | o o o   first-contribution  |
|  together.                       |-----------------------------|
|                                  | $ git clone <project>       |
|  A student-run free software     |   # get a copy of the code  |
|  club in Mangaluru.              | $ git switch -c fix-typo    |
|                                  |   # make your own branch    |
|  [ Join BIFOSS ]  See events     | $ git commit -am "Fix typo" |
|                                  |   # save your change        |
|                                  | $ git push -u origin ...    |
|                                  | remote: Create a pull       |
|                                  |   request for 'fix-typo'    |
|                                  +-----------------------------+
+----------------------------------------------------------------+
```

**Content**

- Five commands: `git clone <project>`, `git switch -c fix-typo`, `git commit -am "Fix typo"`, `git push -u origin fix-typo`, then the real GitHub-style output line "remote: Create a pull request for 'fix-typo'".
- Under each command, a grey comment line in plain words (for example "# get a copy of the code", "# make your own branch", "# save your change"). The comments are the important part: they make the panel teach instead of show off, which fits a club whose promise is "beginners welcome".
- Six or seven lines in total. More becomes a wall of text.
- Use a neutral `<project>` placeholder until the club has a real repository. Label the panel "example" in its title bar (`first-contribution`) so it does not pretend to be live.
- Wording of the comments is editable in one data array (`heroSteps` in `src/data/home.js`), so the club can change them without touching the component.

**Behaviour**

- Plays **once** on page load, about six seconds: each command types out, output lines appear instantly.
- Then it stays still. No looping, no endlessly blinking cursor.
- A small "Replay" button lets the visitor watch it again (motion the visitor asked for).
- Reduced motion: show the finished panel immediately, no typing.
- Mobile: the panel sits below the headline at full width in a slightly smaller font and shows the finished state with no animation.

**Build notes**

- Plain React and CSS in one component (`TerminalHero.jsx`), about 2 KB. No animation library, no canvas.
- Prompt `$` in orange `#FF8500` on the Terminal colour `#16181B` (7.7:1); grey comments `#9AA0A6` on `#16181B` (6.7:1). Commands in near-white. Use the mono typeface here, and only here and in other real code blocks.
- Accessibility: the full command list is real text in the DOM, selectable and copyable. The typing animation is `aria-hidden`; screen readers get the finished list in one piece (for example through a visually hidden copy), so they never hear letters arrive one by one. Give the panel a text label such as "Example: the commands for a first contribution".
- Do not add a fake mouse cursor, a glow, scanlines or any "hacker" effect. That is decoration and brings back the generic look this plan removes.

**Later (not in this plan):** when the club has real activity, a "what we have shipped" git-log feed can sit under the hero; when there are good photos from a session, one can be added elsewhere. Neither replaces the terminal.

### Sections

- [x] **Tools marquee:** replace with a static, wrapped line of tools (no scrolling animation, no middle-dot separators).
- [x] **Tracks:** change from six identical icon cards to a two-column list: track name left, one-line description right, separated by rules. This is a list, not a feature grid. Drop the gradient icon chips.
- [x] **Events ("Coming up"):** a ledger of rows (date, title, venue, type) instead of cards. The date is the strongest element.
- [x] **How to join:** keep the numbers (it is a real sequence). Lay the five steps vertically on a connecting line, left aligned.
- [x] **FAQ:** keep the accordion; remove the pill label above it. Start with all items closed.
- [x] **Closing CTA:** a plain block with one sentence and one button. No gradient panel.
- [x] Remove every pill eyebrow above a heading.
- [x] De-duplicate: Home keeps the summary; About keeps tracks; Join keeps only a link to the steps. The FAQ appears on **one** page, linked from the others.

### Definition of done

- [x] The hero contains one h1, one sentence, two buttons and the terminal panel, nothing else.
- [x] The terminal plays once, ends in the finished state, and shows the finished state immediately with reduced motion.
- [~] The full command text can be selected and copied, and a screen reader reads it as one block. (Structure in place; not tested with a real screen reader.)
- [~] No two adjacent sections use the same layout pattern. (Judgement call: tracks and events are both row lists; see changelog.)
- [ ] Home loads without three.js (confirm in the Network tab). Not confirmed: no build could run.

**Deliver:** `bifoss-ui-phase4.zip`

---

## Phase 5: Motion diet and performance

**Goal:** keep only motion that shows a change, and drop the weight.

### Remove

- [ ] `RevealText` on headings (use plain text).
- [ ] Fade-and-slide-up entrances on every card and section (`motion.li` `whileInView`).
- [ ] Hover lift on cards (`whileHover={{ y: -4 }}` and `hover:-translate-y-*`).
- [ ] Button shimmer sweep, typewriter tagline, marquee scroll, `ScrambleText`.
- [ ] Splash screen.
- [ ] Confetti on the Join button.
- [ ] Footer column stagger, the ping animation on event dots (use a static "Today" label), the floating 404 orb.
- [ ] The 3D hero: remove `Hero3D.jsx`, `HeroBackdrop.jsx`, and the `three`, `@react-three/fiber` and `@react-three/drei` dependencies. (Decided: no 3D at all.)

### Keep (motion that answers an action)

- Accordion open/close, mobile menu open/close, hover colour change on links and buttons, focus rings.
- Page-to-page transitions: a short fade only (about 150ms), with no vertical slide.
- The one hero terminal sequence from Phase 4.

### Tasks

- [ ] Remove unused components and hooks (`useConfetti`, `useTypewriter`, `ScrambleText`, `SplashScreen`, `TopProgressBar` if it is not clearly useful) and run `npm run lint:fix` to clear unused imports.
- [ ] Remove `canvas-confetti`, `three`, `@react-three/fiber` and `@react-three/drei` from `package.json`.
- [ ] Delete the marquee, shimmer, word-reveal, cursor-blink and float-orb CSS and keyframes from `index.css`.
- [ ] Self-host and preload only the font weights actually used.
- [ ] Make `loading="lazy"` and explicit `width`/`height` the default in `SmartImage` to prevent layout shift.

### Definition of done

- [ ] JS bundle is smaller than the Phase 4 build (record both sizes in the changelog).
- [ ] Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 95+.
- [ ] Exactly one non-user-triggered animation exists on the home page.

**Deliver:** `bifoss-ui-phase5.1.zip` (named to avoid clashing with the original `bifoss-phase5.zip`)

---

## Phase 6: Inner pages, copy and final QA

**Status: done** (`bifoss-ui-phase6-final.zip`). See `CHANGELOG-PHASE-6.md` for what was and was not verified.

**Goal:** every page follows the new system, and the whole site is checked end to end.

### Tasks

- [x] **PageShell:** remove the pill label. Page title, one intro sentence, content. Left aligned.
- [x] **About:** short story, three values as a plain list (not three cards), and a link to the FAQ.
- [~] **Events:** filter chips become a simple segmented control; event rows match the Home ledger. Event detail page gets a clear "Add to calendar" or "Register" action if the data supports it. (Done, with "Register" only. "Add to calendar" was not added because `time` is free text such as "10:00 AM to 1:00 PM", so a calendar file would have to guess.)
- [x] **Projects:** each entry shows title, status, one line, repo link. Status is a text label, not a pill.
- [x] **Team:** photo, name, role. Use a consistent crop; add initials as the fallback when there is no photo.
- [x] **Blog:** readable article layout: max 68ch measure, comfortable line height, code blocks on the Terminal colour.
- [x] **404 and error states:** keep the plain wording ("We can't find that page"); one link home; no floating orb. Error text says what went wrong and what to do.
- [x] **Copy pass:** sentence case everywhere, one verb per button, and the same action keeps the same name ("Join BIFOSS" everywhere, never "Become a member" on one page and "Join" on another).
- [x] **Empty states:** each says what will appear here and what the visitor can do now.
- [~] **Metadata:** per-page titles and descriptions, an `og:image`, a sitemap and `robots.txt`. (Titles and descriptions are set in the browser, so crawlers that do not run JavaScript see only `index.html`. `robots.txt` is always written; `sitemap.xml` is written only once `domain` is set.)

### Final QA checklist

- [ ] Keyboard only: reach every page, open the menu and the accordion, and submit nothing by accident. (Not run: no browser.)
- [ ] Screen sizes: 320px, 375px, 768px, 1280px, 1920px. No horizontal scroll. (Not run: no browser.)
- [ ] Reduced motion on, and forced-colors on: still usable. (Not run. Phase 6 added no motion.)
- [ ] Slow 3G throttle: the page is usable before fonts load (fallback stack set). (Not run. The fallback stacks are in `index.css`.)
- [~] Every internal link works; GitHub Pages SPA fallback (`404.html`, `_redirects`) still routes deep links such as `/events/some-slug`. (Every internal link in the rendered pages matches a route, and both `#faq` and `#how-to-join` exist on Home. The fallback files were not changed and not tested on a host.)
- [~] `grep -rni "todo" dist/` is clean again. (Rendered HTML of every route is clean with all values empty. `dist/` itself was not built.)

### Definition of done

- [~] Every item in the QA checklist is ticked, or noted as an exception in the changelog. (Exceptions are noted above and in the changelog.)
- [~] Final score re-assessed against the same rubric as the original review (distinctiveness, subject grounding, typography, motion, contrast, copy, completeness). (Provisional, from code and rendered HTML, not from screenshots. See the changelog.)

**Deliver:** `bifoss-ui-phase6-final.zip`

---

## Delivery summary

| Phase | Focus | Zip |
|---|---|---|
| 1 | Hand-over readiness | `bifoss-ui-phase1.zip` |
| 2 | Accessibility and contrast | `bifoss-ui-phase2.zip` |
| 3 | Design system | `bifoss-ui-phase3.zip` |
| 4 | Home page rebuild | `bifoss-ui-phase4.zip` |
| 5 | Motion diet and performance | `bifoss-ui-phase5.1.zip` |
| 6 | Inner pages, copy, final QA | `bifoss-ui-phase6-final.zip` |

Each zip contains the full project (without `node_modules`, `.git` or `dist`), this plan as `UI-IMPROVEMENT-PLAN.md`, `HANDOFF.md`, and a `CHANGELOG-PHASE-N.md`, so any phase can be restored on its own.
