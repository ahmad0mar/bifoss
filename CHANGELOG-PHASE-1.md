# UI phase 1: hand-over readiness

Goal: the site never shows a TODO or a dead button to a visitor, and the person taking over knows exactly what to fill in.

## What changed

**Site values (`src/data/site.js`)**
- `email`, `address` and `domain` are now empty strings instead of `TODO...` text. `joinUrl` and the social URLs were already empty.

**Join button (`src/components/JoinButton.jsx`, new)**
- One component decides what "join" does. With `joinUrl` set it opens the form in a new tab. With it empty it links to the Join page, or on the Join page itself shows a short "The join form is not open yet" message.
- Used on the Join page and in the Home "How to join" section. The hero, navbar and closing buttons already linked to `/join`, which always works, so they are unchanged.

**Dev-only TODO flags (`src/components/Todo.jsx`)**
- `Todo` and `TodoText` render nothing in production builds. New export `showTodos` lets a page hide the whole element around a flag (used on About and Code of Conduct).
- `FAQ.jsx` now uses `TodoText` instead of its own copy of the logic.

**Footer, Join page, Code of Conduct**
- Address and email lines hide when empty. If there is no email and no social link, the Contact column says "Contact details will be listed here soon."
- Join page: the email sentence only appears with an email; the info card is titled "Code of conduct" when there is no email.
- Code of Conduct: the reporting paragraph reads correctly with or without an email ("tell an organiser").
- About: the founding-year placeholder paragraph is dev-only.

**FAQ (`src/data/home.js`)**
- The three answers that said TODO (who can join, fee, meeting time) now read as safe sentences, each with a `// FILL IN` comment above it.

**Empty states**
- `src/components/EmptyState.jsx` (new). `team.json` and `projects.json` are now `[]`; Team and Projects show an empty state, and ignore any entry whose name or title still starts with `TODO`.
- Deleted `todo-example-event.md` and `todo-example-post.md`. The `_TEMPLATE.md` files stay.

**Hand-over tooling**
- `scripts/check-config.js` and `npm run check`: lists empty values, empty lists, leftover TODO or FILL IN text, the placeholder in `public/CNAME`, and (with `-- --dist`) any "TODO:" left in a build. It only warns.
- `HANDOFF.md`: new "START HERE" table (what to fill, where, what it does, entry shapes). Old history kept; "Remaining TODOs", "Known issues" and one "How we work" rule were updated.
- `README.md`: points to `npm run check` and `HANDOFF.md`.
- `UI-IMPROVEMENT-PLAN.md` (project root): the six-phase plan with a status table and instructions for the next AI, so it travels with the project.

**Link previews (`index.html`)**
- Added `og:site_name`, `og:image`, `og:image:alt` and the Twitter card tags, using the existing full logo as a stand-in image. The image paths are relative until the real domain is known (see HANDOFF item 4).

## Files changed
Changed: `index.html`, `package.json`, `README.md`, `HANDOFF.md`, `src/data/site.js`, `src/data/home.js`, `src/data/team.json`, `src/data/projects.json`, `src/components/{FAQ,Footer,Todo}.jsx`, `src/components/home/HowToJoin.jsx`, `src/pages/{About,CodeOfConduct,Join,Projects,Team}.jsx`.
Added: `src/components/JoinButton.jsx`, `src/components/EmptyState.jsx`, `scripts/check-config.js`, `CHANGELOG-PHASE-1.md`, `UI-IMPROVEMENT-PLAN.md`.
Deleted: `src/content/events/todo-example-event.md`, `src/content/blog/todo-example-post.md`.

## Definition of done: what was and was not verified
- [x] `npm run lint` passes with no errors.
- [x] Every page renders with an empty `site.js` in production mode with no "TODO" text (server-rendered test of Home, About, Join, Events, Projects, Team, Blog, Code of Conduct, footer). No empty `href=""` links.
- [x] Filling `joinUrl` alone turns the Join page notice into the "Open the join form" button (same test with filled values). Filling `email` shows the email line in the Join page and footer.
- [x] `npm run check` lists exactly what is still missing and matches the HANDOFF table.
- [ ] `vite build` and `grep "TODO:" dist/`: **not run**. The bundled `node_modules` came from Windows and has no Linux build binary, and the sandbox had no network. Run `npm install && npm run build && npm run check -- --dist` on your machine to confirm.
- [ ] Not checked in a real browser (no 360px / 1280px visual pass).

## Deliberately left for later phases
Colour contrast, reduced-motion handling, new design system, Home rebuild, motion removal, the 3D hero decision, and inner-page restyling (phases 2 to 6).
