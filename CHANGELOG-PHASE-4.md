# Phase 4: home page rebuild

Review lens: the Anthropic `frontend-design` skill (the closest match to "anti slop"; there is no skill by that exact name). The plan's Phase 4 section fixed the direction, so it was followed as written. Typing effect on headings was considered and rejected: the h1 stays static and the terminal is the one moving thing on the page.

## What changed

**Hero** (`src/pages/Home.jsx`, new `src/components/home/TerminalHero.jsx`)
- Left aligned: one h1 ("Build in the open, together."), one sentence, two buttons. The terminal panel sits on the right at 1024px and up, and below the text on smaller screens.
- Terminal: four commands, three grey notes, one output line (8 lines; the plan said six or seven, but its own wireframe shows nine). Title bar reads `first-contribution` and `example`.
- Plays once about 500 ms after load and takes about six seconds. Commands type at 42 ms per character; notes and output appear at once. Then it stays still. The cursor is a still block while typing and is gone at the end. No loop, no blink.
- `Replay` button (44px target) appears when the run has finished. It only exists where the animation does.
- Reduced motion, and screens under 640px: finished panel at once, no Replay button.
- Accessibility: the animated panel is `aria-hidden`. A visually hidden `<pre>` holds the finished text, and the panel is a `role="group"` labelled "Example: the commands for a first contribution". The `$` prompt is not selectable, so copying gives commands only. Focus ring on the dark panel uses the orange fill (Deep orange would be about 2.4:1 there).
- Plain React and CSS, no animation library. Wording lives in `heroSteps` in `src/data/home.js`.
- Removed from Home: `HeroBackdrop` (and with it the lazy 3D hero), `RotatingTagline` (file deleted), the word-by-word h1 animation, confetti on the hero button.

**Sections**
- Tools: `ToolsLine.jsx` replaces `ToolsMarquee.jsx` (deleted). One wrapped sentence, no scrolling, no dot separators. Marquee CSS and keyframes deleted from `index.css`.
- Tracks: a list of rows, name left and one line right, separated by rules. No icons, no cards (icon names removed from `tracks` in `home.js`).
- Events ("Coming up"): a ledger with a heavy ink rule on top. Each row is date (large), title and time, venue, type. Today is a static "Today" label; the pinging dot is gone. Empty state is plain text under the rule.
- How to join: five numbered steps down a connecting line, left aligned. Numbers stay because it is a real sequence. Section has `id="how-to-join"`.
- FAQ: heading left aligned, all items closed (`defaultValue` removed from `FAQ.jsx`, so About and Join no longer show it either). Section has `id="faq"`.
- Closing block: left aligned, one sentence, one button, flat wash background. Confetti removed from this button.
- No pill eyebrows remain on Home (they went in Phase 3). `RevealText` removed from every Home heading; it is still used on About and Join until Phase 5.

**De-duplication**
- Join: the steps list and the FAQ are gone. A short line links to `/#how-to-join` and `/#faq`.
- About: the FAQ is gone, replaced by a link to `/#faq`. About keeps its tracks and values.
- The FAQ now exists on one page (Home). The steps exist on one page (Home).

## Definition of done

- [x] Hero has one h1, one sentence, two buttons and the terminal panel (checked in the browser harness: 1 h1, 2 buttons).
- [x] Terminal plays once, ends finished, and is complete at 300 ms with reduced motion (checked in Chromium). Panel height is 286px before and after typing, so nothing shifts. No infinite animations on the page (`document.getAnimations()` returned none).
- [~] Full command text is real DOM text and the `$` prompt is `user-select: none` (checked). The hidden copy and `aria-hidden` structure are in place, but it was **not** tested with a real screen reader or the clipboard.
- [~] No two adjacent sections share a layout: hero (two columns), tools (single line), tracks (open rows), events (ruled ledger with large dates), steps (connected timeline), FAQ (accordion), closing block. Tracks and events are both row lists and are the closest pair; the heavy top rule, large dates and hover row set the ledger apart. This is a judgement call, so look at it.
- [ ] "Home loads without three.js (Network tab)": **not confirmed.** Nothing Home imports reaches `three` any more (the only importer was `HeroBackdrop`, which Home no longer uses), but no production build could be inspected.

## How this was verified (read this)

The sandbox had no network, and the `node_modules` in the zip is empty folders, so `npm install`, `npm run lint` and `npm run build` **could not run**. Treat all three as unverified and run them on your machine first.

What was done instead:
- A throwaway harness (kept outside the project) bundled the real `Home` page with esbuild and compiled the project's real `index.css` and `tailwind.config.js` with Tailwind. Stubs stood in for `framer-motion`, `react-router-dom`, the Radix accordion (a plain `<details>`), the navbar (not rendered), and the events loader.
- Syntax and unused-import checks ran on all 13 edited files (clean). `eslint` itself did not run.
- Fonts in the screenshots are Inter and DejaVu Sans Mono, not Bricolage Grotesque and IBM Plex. Real type will differ in width and feel.
- Event rows in the ledger screenshot use **sample data** that is not in the project. The real site has no events yet and shows the empty state.
- axe-core was not available offline, so no accessibility scan ran this phase. Run it as in Phase 2.
- Not tested: Safari, Firefox, real phones, Lighthouse, forced colors, the real navbar and tab bar.

## Left for later
- Phase 5: delete `HeroBackdrop.jsx`, `Hero3D.jsx`, `useTypewriter`, `ScrambleText`, `RevealText`, `SplashScreen`, confetti in `JoinButton`, and the `three` packages. Those files are now unused by Home but still in the repo and `package.json`.
- Phase 6: About still has the three values as cards and the tracks as cards. Join and About still have the old page header with a label. Tracks appear on both Home and About; the plan says Home keeps the summary and About keeps tracks, so this overlap is kept until Phase 6 turns About into a plain list. If you want tracks on one page only, say so.
- `OPTIMISATION-PLAN.md` (new) lists performance work beyond the six phases.
