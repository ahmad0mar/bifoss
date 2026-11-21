# Phase 6: inner pages, copy and final QA

Review lens: the Anthropic `frontend-design` ("anti-slop") skill, applied to every inner page.
Rules taken from it: no label above a heading, structure that carries meaning, left-aligned, one memorable
moment per page (the Home terminal), plain copy with one name per action, errors and empty states that say
what to do.

## What changed

**Shared pieces**
- `PageShell`: the label above the title is gone. Title, one intro sentence, content. It also sets the page's meta description (from `intro`, or an explicit `description`).
- `EventLedger` (new): the date-led event rows from Home, now shared by Home and Events so they match.
- `EmptyState`: rebuilt. Left aligned, a top rule like the ledgers, says what will appear and gives one action. It replaces the illustrated `EmptyBlog` and `EmptyEvents` (deleted, with the `components/empty/` folder).
- `Markdown` (new): article body for posts and events. A 68-character measure (the `max-w-2xl` that overrode it is gone), code blocks reachable by keyboard, lazy images.
- `usePageTitle(title, description)`: also updates the meta description and the Open Graph and Twitter title and description.
- `NotFound` takes its own wording, so an unknown event or post says "We can't find that event" and links to the list. `RouteBoundary` uses the same left-aligned layout.

**Pages**
- **About:** story, three values as plain text (no cards, no icons), tracks as the same ruled list as Home (`TrackList`, exported from `home/Tracks.jsx`), one FAQ link.
- **Events:** the type filter is one segmented control. Upcoming and Past use the ledger. A filter that matches nothing says so. With no events at all, one empty state replaces two.
- **Event detail:** the pulsing-style "happening today" pill is now plain text. "Register" sits directly under the date, time and venue, and "Copy link" beside it. Past events say "This event has finished."
- **Projects:** a ruled list (title and status left, one line and repository right). Status is text. Images are no longer shown.
- **Team:** one square crop for every portrait; initials fill the square when there is no photo or the photo fails.
- **Blog:** the list is a ruled list like Events (date, title, summary, author). Post pages use the new article layout.
- **Join, Code of conduct, Footer:** labels removed, boxes removed, links use the new `.text-link` class. The footer legal line is left-aligned.

**Copy pass**
- "Join BIFOSS" is the only name for that action (navbar, footer, buttons, empty states, and the real form button once `joinUrl` is set; it used to say "Open the join form").
- "See events" and "See posts" replace "All events", "All posts", "Find a first session" and "How to join".
- "Copy link" then "Link copied" (was "Share" then "Copied!").
- Middle-dot meta strings removed (event time, blog author and date). The `—` in the `og:title` is now a `|`.
- External links say "(opens in a new tab)" to screen readers only.

**Metadata**
- Per-page titles and descriptions on every page; event and post descriptions come from the content.
- `public/images/brand/og-image.png`: 1200 x 630, 109 KB (the old preview image was 544 KB at 3:1). `index.html` uses it, with `summary_large_image` and the size tags.
- `vite.config.js` has a small plugin: `robots.txt` on every build, `sitemap.xml` (fixed pages plus every non-draft event and post) once `domain` is set. Without a domain the build prints a warning and skips the sitemap.

**CSS** (`index.css`): added `.text-link`; defined `--terminal-rule` (the title-bar divider that did not draw, found in Phase 5); `.prose-bifoss` now wraps long words and styles images and rules.

## Definition of done

- [~] QA checklist: see below. Items needing a browser were **not run**.
- [~] Score re-assessed: provisional, from code and rendered HTML, **not** from screenshots.

### Final QA checklist

| Item | Result |
|---|---|
| Keyboard only | **Not run** (no browser). By construction: the filter is real buttons with `aria-pressed`, code blocks have `tabindex`, every link and button has the focus ring. |
| 320, 375, 768, 1280, 1920 px, no horizontal scroll | **Not run.** Layouts use the same grid patterns as Home, which passed at 360 and 1280 in Phase 3. The Team grid (two columns at 320 px) is the thing most worth a look. |
| Reduced motion and forced colours | **Not run.** Phase 6 added no motion. |
| Slow 3G, usable before fonts load | **Not run.** Fallback stacks are set in `index.css`; two fonts are preloaded. |
| Internal links, deep links | Every internal link in the rendered pages matches a route, and `#faq` and `#how-to-join` exist on Home. `404.html`, `_redirects` and `vercel.json` were not changed and not tested on a host. |
| No visible TODO | Rendered HTML of all routes is clean with every value empty. `dist/` was not built, so `npm run check -- --dist` still needs running. |

### How this was verified

- No network and no browser. `npm install`, lint, `vite build`, axe and Lighthouse did **not** run. Only Tailwind v4 was installed (the project is v3), so the real stylesheet was not compiled and the new classes were not confirmed in generated CSS. They use plain v3 syntax and patterns already used on Home.
- Done: esbuild bundled `src/main.jsx` and every page and component alone; an unused-import script found nothing in the files changed; a server-render of all 11 routes plus an unknown event and post, in an empty and a populated scenario, had no crashes. A scan of that HTML found no TODO text, no middle dots, one `h1` per page, no skipped heading levels, no animation classes and no links outside the route table. Contrast for the new pairings was calculated (selected filter 17.3:1, deep orange on the row hover fill 5.4:1, muted on the hover fill 5.2:1, filter border 5.9:1; all pass). The sitemap plugin was run on its own, with and without a domain, and skipped a draft.

## Score (provisional)

Same rubric as the original review. My own judgement from the code and the rendered text, so treat it as an estimate.

| | Score | Why |
|---|---|---|
| Distinctiveness | 7 | Terminal hero and ledgers are specific to the subject. Four pages now share the ruled-list pattern, which is consistent but risks feeling samey. |
| Subject grounding | 8 | Git terminal, commit-log-style rows, real commands. |
| Typography | 7 | Bricolage Grotesque and Plex are deliberate and the scale is set, but nobody has looked at it rendered. |
| Motion | 9 | One animation on Home; a 150 ms fade between pages; nothing else unprompted. |
| Contrast | 8 | Every pair calculated and passing. axe has not run on the changed pages. |
| Copy | 7 | One name per action, plain empty states and errors. The placeholder FAQ answers still say "will be announced". |
| Completeness | 6 | Every page works empty, but Team, Projects, events and posts have no content yet. |

About **7.4 / 10**. The target of 8+ is not claimed: it needs the browser checks above and real content.

## Found, not changed

- `src/lib/utils.js` exports `isIframe`, which reads `window` when the module loads and is used nowhere. Harmless in a browser; delete it if you like.
- `ui/badge.jsx` has an unused `React` import (it was there before).
- No calendar file for events: `time` is free text. If the club wants "Add to calendar", add separate `start` and `end` fields (ISO times) to the event template first.
- Images are still the first performance job (`OPTIMISATION-PLAN.md` section 1): the navbar logo is a 144 KB PNG.

## Needs your action

1. `npm install` (the lock file is stale since Phase 5), then `npm run lint` and `npm run build`. Record the bundle size and fix anything they report.
2. After the build: `npm run check -- --dist`, and open `dist/robots.txt`. Set `domain` first if you want `dist/sitemap.xml`.
3. Open each page at 320 and 1280 px, tab through the site once, then run axe and Lighthouse.
4. Fill in the values listed in `HANDOFF.md`.
