# BIFOSS website

Site for BIFOSS, the Bearys ICB free open source society. React 18, Vite, Tailwind, framer-motion, react-router and react-markdown. Static hosting only: no backend, no login.

## Run it

```bash
npm install
npm run dev      # local site at http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve dist/ locally
```

## Where things live

- `src/data/site.js`: club name, email, address, social links, join link, domain.
- `src/content/events/*.md` and `src/content/blog/*.md`: one Markdown file per event or post. Files starting with `_` are ignored.
- `src/data/team.json`, `src/data/projects.json`: team and projects.
- `public/images/{brand,events,blog,team,projects}/`: plain image files, referenced by path.
- `public/images/brand/og-image.png`: the 1200 x 630 link-preview image. `vite.config.js` writes `robots.txt` on every build and `sitemap.xml` once `domain` is set in `site.js`.
- `src/index.css` and `tailwind.config.js`: design tokens (colours, fonts, type scale, radius). The only two files that may contain hex values. See "Design" below.

## Design

BIFOSS is a student open source club, so the site borrows from its world: terminals, commit logs, READMEs and pull requests. It is plain, legible and a little technical, and warm because the club is for beginners. Orange is a **signal**, not a wash: use it for the one thing that matters on a screen.

Every value below is a CSS variable in `src/index.css`. **Never type a hex value anywhere else in `src/`.** Use the variable or its Tailwind name.

### Colour

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--paper` | `#F5F6F4` | `bg-brand-paper` | Page background (cool off-white, not cream) |
| `--ink` | `#101214` | `text-brand-ink` | Text, headings, and the text on orange |
| `--rule` | `#D9DBD6` | `border-brand-rule` | Dividers and decorative borders only (1.3:1, so never the only sign of a control) |
| `--terminal` | `#16181B` | `bg-brand-terminal` | Code blocks and the hero terminal panel |
| `--orange-fill` | `#FF8500` | `bg-brand-orange-fill` | Fills and highlights. Always put ink on top, never white |
| `--orange-ink` | `#9A4300` | `text-brand-orange-ink` | Orange used as **text**: links, active states, focus ring |
| `--muted` | `#5A5F66` | `text-brand-muted` | Secondary text; also the border of form controls |

Derived, not new colours: `--wash` (ink at 6% over paper: hover and inline-code fill), `--terminal-ink` and `--terminal-dim` (text and comments on the terminal), `--danger` (error text), `--orange-ink-hover`.

Rules: no gradients, no blurred orbs, no glows. Bright orange never carries text on its own. Body text is at least 4.5:1.

### Type

All three families are open licence and self-hosted through `@fontsource` (imported in `src/main.jsx`, Latin subset only).

- **Bricolage Grotesque 700**: headlines (`font-display`, and every `h1` to `h6` by default). Tight tracking, line height 1.1.
- **IBM Plex Sans 400 and 600**: body and interface (`font-sans`).
- **IBM Plex Mono 400**: real code, commands and the terminal panel only (`font-mono`). Not for small decorative labels.

Scale: ratio 1.250 on a 17px body, line height 1.6 for body and 1.05 to 1.15 for headings. Tailwind's `text-*` names are mapped to it in `tailwind.config.js`:

| Class | Size | Class | Size |
|---|---|---|---|
| `text-xs` | 13.6px | `text-3xl` | 41.5px |
| `text-sm` | 15.2px (half step, for interface text) | `text-4xl` | 51.8px |
| `text-base` | 17px | `text-5xl` | 64.8px |
| `text-lg` | 21.3px | `text-6xl` | 81px |
| `text-xl` | 26.6px | `text-7xl` | 101px |
| `text-2xl` | 33.2px | | |

Keep running text under 68 characters per line (`--measure`; `.prose-bifoss` already does).

### Space and shape

- One corner radius for every control and card: `--radius` (0.5rem, Tailwind `rounded-lg`). One larger radius, `--radius-panel` (1rem, `rounded-panel`), is reserved for the hero terminal panel. Circles are for dots and number badges only. The tab bar is the single capsule.
- Spacing uses Tailwind's 4px steps. Sections use `py-20` on desktop and `py-12` on phones.
- Left-align text. Centre only a single short line.
- Structure carries meaning: a rule, a number or a border must say something about the content. If it does not, remove it.

### Buttons

`.btn-brand` is the primary action (orange fill, ink text; hover flips to ink fill with orange text). `.btn-ghost` is secondary (ink outline; hover fills with ink). Use one primary button per screen area.

### Keep in sync

The liquid tab bar reads `--orange-ink` at runtime (`src/lib/tokens.js`), so the open tab and `.lg-face.lit` can no longer drift apart.

## TODOs to fill in

Run `npm run check` to list what is still empty. The step-by-step list is under "START HERE" in `HANDOFF.md`. Home page copy is in `src/data/home.js`. TODO flags show only in `npm run dev`, never in a production build.

## Deploy

The site is static: `npm run build` writes `dist/`, and any static host can serve it. Every host needs one rule: unknown paths must return `index.html`, so links such as `/events/some-post` work on a fresh load. The rule is already in the repo for each host below.

Before the first deploy, set your real domain in `src/data/site.js` and `public/CNAME` (see `HANDOFF.md`).

- **Netlify or Cloudflare Pages:** connect the repo, build command `npm run build`, output folder `dist`. `public/_redirects` handles the fallback.
- **Vercel:** import the repo, framework Vite. `vercel.json` handles the fallback.
- **GitHub Pages:** build, then publish `dist/`. `public/CNAME` sets the custom domain, and `public/404.html` plus the script in `index.html` handle the fallback. Keep `pathSegmentsToKeep = 0` in `404.html` for a custom domain; set it to 1 only for a `username.github.io/repo` project site, and then also set `base: '/repo/'` in `vite.config.js`.

After deploying, open a deep link such as `/events` or `/code-of-conduct` directly (not through the home page) and check it loads.
