# Liquid glass tab bar (owner-requested, outside the six-phase plan)

The navbar is now an iOS-style liquid glass tab bar: a frosted capsule with six tabs (Home, About, Events, Projects, Blog, Team), each an icon over a word. The open tab sits in a soft orange capsule. Tapping another tab lifts a drop of clear glass off the bar; it stretches as it moves, bends and splits colour at its rim on the GPU, and settles into the new tab. Holding it lets you drag it along the bar; on release it carries on to the nearest tab. Without WebGL2, or with reduced motion on, the capsule just moves between tabs.

## Files
- `src/lib/liquidTabs.js` (new): the engine (shader, springs, pointer handling), ported from the supplied vanilla script. The wash behind the page, dark-scheme handling and arrow-key tab switching were left out (the site is light only, and the tabs are real links).
- `src/components/LiquidTabBar.jsx` (new): the React part. Tabs are `<a href>` links in a `<nav aria-label="Main">`. The router decides which tab is open; a tap, drag or Enter on a focused tab navigates.
- `src/components/Navbar.jsx` (rewritten): logo chip on the left, "Join BIFOSS" on the right, the bar centred at the top from 768px and along the bottom on phones. The hamburger menu and mobile menu are gone. `navLinks` is still exported for the footer.
- `src/index.css`: `.lg-*` styles at the end of the components layer.
- `src/components/Layout.jsx`: bottom padding on phones so the footer clears the bar. `ScrollToTopButton.jsx`: sits above the bar on phones.

## Behaviour worth knowing
- Pages not in the bar (Join, Code of conduct, 404) show no open tab and no drop. `/events/some-slug` and `/blog/some-slug` keep Events and Blog open.
- The lit colour is `#9A4300` in two places that must match: `TINT` in `LiquidTabBar.jsx` and `.lg-face.lit` in `index.css`.
- The resting label colour is `--muted`. The GPU layer repaints a picture of the row whenever it changes, so icons and words stay sharp inside the drop.
- Links have `draggable={false}` and a `dragstart` guard: without them, dragging on a link makes the browser cancel the pointer.

## Checked (headless Chromium, software WebGL2)
- Tap changes page and tab; the drop is visibly lifted mid-move (glass magnifies and bends the label). Hold and drag to Projects, release: lands on Projects and navigates. Enter on a focused tab navigates. Visiting `/join` shows no open tab; tapping Home from there works.
- axe-core: zero violations on 9 routes at 1280px and 360px (18 runs). Touch-target scan: every link and button at least 44px (inline links excepted). `npm run lint` and `npm run build` pass.
- Phone layout screenshot at 390px: bar along the bottom, logo and Join on top.

## Not checked / left open
- Not tested on a real GPU, real iOS Safari, Firefox, or with a screen reader. Software WebGL was used here, so frame rate on real phones is unknown.
- Six tabs at 360px leave about 54px per tab; "Projects" fits but is tight. If labels clip on small phones, drop Home from the bar (the logo already links home).
- The bar's resting text is 11px. It meets contrast (muted on glass over the cream page) but is small; phase 3 may revisit the type scale.
- Reduced motion: the bar jumps between tabs with no lift. Phase 5 ("motion diet") plans to remove most animation; this bar is a deliberate exception and answers a tap or drag, so it fits the plan's "motion that answers an action".
- The mobile menu and hover pill from the old navbar were deleted. `useScrollDirection` is no longer used by the navbar (left in place).
