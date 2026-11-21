# HANDOFF

> **If you are an AI assistant continuing this work:** read `UI-IMPROVEMENT-PLAN.md` first, then this file. Do only the next unfinished phase in that plan, follow its Definition of done, update both files, deliver the zip and stop.

## START HERE: filling in the site (for whoever takes over)

The site is built to work with every value below empty: nothing broken or "TODO" shows to visitors. Fill the values in, rebuild, and each one switches on by itself. Run `npm run check` at any time to see what is still empty.

| # | What | Where | What happens when it is filled |
|---|------|-------|-------------------------------|
| 1 | Join form link (Google Form, Tally or similar) | `joinUrl` in `src/data/site.js` | The "coming soon" notice on the Join page becomes an "Open the join form" button |
| 2 | Club email | `email` in `src/data/site.js` | Shows in the footer, on the Join page and in the Code of Conduct |
| 3 | College name and address | `address` in `src/data/site.js` | Shows in the footer |
| 4 | Real domain | `domain` in `src/data/site.js` **and** `public/CNAME` | Needed before a GitHub Pages deploy. After this, change the `og:image` and `twitter:image` paths in `index.html` to full URLs (for example `https://your-domain/images/brand/og-image.png`) so link previews work. Setting `domain` also makes `npm run build` write `sitemap.xml` (without it only `robots.txt` is written, with a build warning) |
| 5 | Social links | `social` in `src/data/site.js` | Each item with a URL appears in the footer; empty ones stay hidden |
| 6 | FAQ answers: who can join, fee, meeting time | the three `FILL IN` comments in `src/data/home.js` | Replace the safe placeholder sentence under each comment |
| 7 | Team members | `src/data/team.json` | Replaces the "team list is coming soon" message. Entry shape: `{ "name": "Full name", "role": "Role", "photo": "/images/team/name.jpg", "alt": "Short description of the photo", "github": "https://github.com/username" }` (`photo` and `github` can be empty; with no photo the member's initials show) |
| 8 | Projects | `src/data/projects.json` | Replaces the empty message. Entry shape: `{ "title": "Name", "description": "One sentence", "status": "planned", "repo": "https://github.com/..." }` (`status` is `planned`, `active` or `done`; `repo` can be empty). Projects no longer show an image |
| 9 | First event / first post | copy `_TEMPLATE.md` in `src/content/events` or `src/content/blog` | Shows on Home, Events and Blog |
| 10 | About page story | the founding year, faculty advisor and club story lines in `src/pages/About.jsx` (flagged with a dev-only TODO) | Adds the story under the intro |
| 11 | Code of Conduct enforcement wording | `src/pages/CodeOfConduct.jsx` (flagged with a dev-only TODO) | Must be written before launch: it says what organisers may do and who reviews reports. Have someone review it |

Before deploying: `npm install`, `npm run check`, `npm run lint`, `npm run build`, then `npm run check -- --dist` to confirm no "TODO:" text is in the build.

`TODO` flags (the dashed orange tags) now appear **only** while you run `npm run dev`. In a production build they render nothing.

## UI overhaul (separate from the original build phases below)

A six-phase UI/UX improvement plan is in `UI-IMPROVEMENT-PLAN.md` (project root). Each phase ends with a zip. The status table at the top of that file says which phase is next.

- UI phase 1 (hand-over readiness): done. See `CHANGELOG-PHASE-1.md`.
- UI phase 2 (accessibility and contrast): done. See `CHANGELOG-PHASE-2.md`.
- UI phase 3 (design system): done. See `CHANGELOG-PHASE-3.md` and the "Design" section of `README.md`.
- UI phase 4 (home page rebuild, terminal hero): done. See `CHANGELOG-PHASE-4.md`. Lint, build and axe could not run in the sandbox: run `npm install`, `npm run lint`, `npm run build` first.
- UI phase 5 (motion diet and performance): done. See `CHANGELOG-PHASE-5.md`. Run `npm install` (the lock file is stale), then lint and build; sizes and Lighthouse were not measured.
- UI phase 6 (inner pages, copy, final QA): done. See `CHANGELOG-PHASE-6.md`. Nothing could be built, linted or opened in a browser in that sandbox: run `npm install`, `npm run lint`, `npm run build`, then the QA list in the changelog. `OPTIMISATION-PLAN.md` holds extra performance work (images first).
- Terminal wording on the home page: edit `heroSteps` in `src/data/home.js`.
- Extra, owner-requested (not a plan phase): the navbar is now a liquid glass tab bar (WebGL). See `CHANGELOG-LIQUID-TABS.md`. Phase 3 and later should treat `src/components/Navbar.jsx`, `LiquidTabBar.jsx`, `src/lib/liquidTabs.js` and the `.lg-*` CSS as the navigation, and the bar now reads `--orange-ink` at runtime (`src/lib/tokens.js`), so nothing needs to be kept in sync by hand.

## Finished phases
- Phase 1 (foundation).
- Phase 2 (Home page).
- Phase 3 (About, Events, EventDetail, Join pages). Scope confirmed with you: About, Events, Join.
- Phase 4 (Code of Conduct, Team, Projects, Blog, BlogDetail). Scope was my inference from the placeholder list; you said "continue phase 4".
- Phase 5 (cleanup, lazy routes, deploy notes). Scope was inferred from the "Next phase" note in the phase 4 HANDOFF; you said "continue" without changing it.

## Decisions made
- Phase 6: the pill or text label above every page title is gone (`PageShell` has no `label`). Events, Blog and Projects are ruled lists in the same style as the Home ledger; Team is a photo grid with initials as the fallback; About lists values as plain text and tracks as the Home list. The blog list and Projects no longer show cover images (the `cover` field still works on the post and event pages). Action names are fixed: "Join BIFOSS", "See events", "See posts", "Copy link" then "Link copied", "Register".
- Wordmark crops: `bifoss-wordmark.png` (no tagline) is used in the navbar and footer because the tagline in the original logo is dark brown and disappears on the dark theme. `bifoss-logo-full.png` keeps the tagline for light backgrounds. The tagline is set as live text in the footer.
- Favicons are the "b" on a dark tile (`favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`).
- Design tokens live in `src/index.css` (the only place for hex values, besides `tailwind.config.js`). shadcn tokens map onto them. Tailwind classes: `bg-brand-paper`, `bg-brand-wash`, `text-brand-ink`, `text-brand-muted`, `border-brand-rule`, `bg-brand-orange-fill`, `text-brand-orange-ink`, `bg-brand-terminal`. There are no gradient classes.
- Tailwind opacity modifiers (`/80`) do not work on the brand variable colours. Use an arbitrary value such as `bg-[rgba(26,15,8,0.82)]`.
- The brand `--border` is the rgba value from the brief, so Tailwind `border` maps to `var(--border)` directly. shadcn `--input` uses HSL with alpha.
- Fonts (phase 3): Bricolage Grotesque 700 for headlines, IBM Plex Sans 400/600 for text, IBM Plex Mono 400 for code only. Self-hosted with `@fontsource` in `src/main.jsx`; nothing loads from Google.
- Kept shadcn components: accordion, badge, button, card, dialog, input, label, separator, skeleton, tabs, textarea.
- Packages kept: radix (accordion, dialog, label, separator, slot, tabs), cva, clsx, date-fns, lucide-react, react, react-dom, react-markdown, react-router-dom, tailwind-merge, tailwindcss-animate. framer-motion, three, react-three and canvas-confetti were removed in UI phase 5.
- Events and posts are sorted by date; `draft: true` hides one. Upcoming vs past is decided in the browser at render time.

- Phase 2 hero: `components/home/HeroBackdrop.jsx` lazy-loads `Hero3D.jsx` (three chunk is about 220 kB gzip, loaded only on Home). It falls back to a gradient orb when WebGL is missing, errors, or while loading. With `prefers-reduced-motion` the scene renders once and does not animate. The orb is dimmed on phones so the headline stays readable.
- Home copy (tools, tracks, join steps, FAQ) lives in `src/data/home.js`. `components/FAQ.jsx` was a leftover photography-template file; it is now a BIFOSS accordion built on shadcn and takes `items=[{q,a}]`. Any `TODO:` inside an answer renders as a TODO flag in development only (nothing in production).
- Upcoming events strip shows the next 3 from `splitEvents()` and an empty state if none.

- Phase 3: About reuses `tracks` and `faqs` from `src/data/home.js`, so edit copy there. Join reuses `steps` and the FAQ entries matching "Who can join", "cost" and "code". Events has type filter buttons (shown only when 2+ types exist), cover images via SmartImage (gradient fallback), upcoming and past sections. EventDetail shows icons for date, time and venue, hides Register for past events, and shows "This event has finished."

- Phase 4: Code of Conduct is a short plain-language version written in my own words, adapted from the Contributor Covenant 2.1 (CC BY 4.0) with attribution; it is not the verbatim text. `TodoText` (exported from `components/Todo.jsx`) turns any "TODO:" inside JSON or frontmatter strings into a dev-only flag. Team and Projects use SmartImage (gradient when no photo). Team photos need `alt`. Project `status` is planned, active or done.

## File and folder map
- `src/App.jsx`: routes. `src/components/Layout.jsx`: navbar, skip link, footer.
- `src/components/home/`: TerminalHero, ToolsLine, Tracks (also exports `TrackList`, used by About), UpcomingStrip, HowToJoin, ClosingCTA.
- Shared in `src/components/`: `EventLedger` (the date-led event rows on Home and Events), `EmptyState` (every empty list), `Markdown` (article body for posts and events), `JoinButton`, `PageShell` (title, one intro sentence, content; no label above the title).
- `src/components/`: Navbar, Footer, Logo, SmartImage (gradient fallback), PageShell, Todo, ScrollToTop, RouteBoundary, FAQ, `ui/` (shadcn).
- `src/pages/`: Home, About, Join, Events, EventDetail, Blog, BlogDetail, Team, Projects, CodeOfConduct, NotFound.
- `src/lib/content.js` and `src/lib/frontmatter.js`: Markdown loaders. `src/hooks/usePageTitle.js`: titles per route.
- `src/data/`, `src/content/`, `public/`: content and static files.

## How content is edited
Copy `_TEMPLATE.md` in `src/content/events` or `src/content/blog`, rename it, fill in the frontmatter. Delete the file to remove the item. Team and projects are JSON arrays.

## Remaining TODOs

See the table in "START HERE" above. Two items are not in that table:
- `public/404.html`: `pathSegmentsToKeep` is 0 (custom domain). Set it to 1 only for a `username.github.io/repo` project site.
- `src/components/home/Hero3D.jsx`: placeholder shapes. Decided: no 3D. Deleted in UI phase 5.

## Known issues
- UI phase 6: `npm install`, `npm run lint`, `npm run build`, axe, Lighthouse and every browser check were **not run** (no network, no browser in the sandbox). Only Tailwind v4 was available, and the project uses v3, so the real CSS was not compiled either. What was checked: a populated and an empty-content bundle with esbuild, a server-render of every route (no crashes, no TODO text, one `h1` per page, no skipped heading levels, no middle dots, no animation classes), every internal link against the route list, colour contrast of the new pairings by calculation, and the sitemap plugin on its own. Per-page titles and descriptions are set in the browser, so crawlers that do not run JavaScript see only `index.html`. The Events detail page has "Register" but no "Add to calendar" (event `time` is free text).
- UI phase 3: `npm install`, `npm run lint` and `npm run build` pass; axe-core zero violations on nine routes at 1280px and 360px. Lighthouse not run. The 3D hero, typewriter tagline, marquee, splash and hover lifts are still present (phases 4 and 5). The new blog code-block style was checked with sample HTML only, not a real post.
- UI phase 2: `npm install`, `npm run lint` and `npm run build` all passed in a Linux sandbox, and nine routes were checked with axe-core in headless Chromium at 1280px and 360px (zero violations, no horizontal scroll). The build has still not been confirmed on the owner's machine. Lighthouse was not run. Not tested on real phones, Safari or Firefox, and not with a screen reader.
- UI phase 1 (earlier note): the build could not run in that sandbox; it has since run in phase 2.
- Build warns that the Hero3D chunk is over 500 kB. It is lazy, so this is expected.
- The `og:image` and `twitter:image` tags use a relative path until the real domain is known (see item 4 in "START HERE").

## Phase 5 changes
- Deleted the eight unused photography-template components (BookingModal, PricingCalculator, Lightbox, RevealImage, GoogleIcon, AuthLayout, ProtectedRoute, UserNotRegisteredError). A grep showed nothing else imported them, and every `@/` import in `src/` still resolves to a file.
- `src/App.jsx`: every page is now `React.lazy`. `Layout.jsx` wraps `<Outlet />` in `Suspense` (blank placeholder while loading) and in the new `components/RouteBoundary.jsx`, which shows a Reload button if a page chunk fails to load, for example right after a redeploy. This boundary was not in the notes; I added it because lazy routes would otherwise show a blank page on that failure.
- `README.md`: full deploy steps for Netlify, Cloudflare Pages, Vercel and GitHub Pages, including the `base` setting for a project site.
- Deploy files re-read, not changed: `_redirects`, `vercel.json`, `404.html` and the `index.html` script are consistent with each other. `public/CNAME` still holds the placeholder domain.

## Next phase
None listed. The site is feature-complete once the build passes and the TODO flags are filled. Suggested next step, to confirm with you: run the build and fix what it reports, then replace the placeholder content.

## How we work
HANDOFF.md from phase 1 had no "How we work" section, so these are the rules I followed. Edit them if you meant something else.
- Do only the next phase, then stop.
- Never invent facts such as fees, dates or links. Anything the club must supply is left empty or worded safely, listed in "START HERE", and flagged with a TODO that shows in development only.
- Use the design tokens; no hex values in `src/` outside `index.css`; no opacity modifiers on token colours (use `.glass-chip`-style CSS with `color-mix`).
- `npm run lint` and `npx vite build` must pass; check at 360px and 1280px.
- Update this file and ship a new zip without node_modules or dist.
- If lint or build cannot be run, say so in Known issues rather than implying they passed.
