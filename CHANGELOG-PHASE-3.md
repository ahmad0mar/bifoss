# Phase 3: design system

Review lens: the Anthropic `frontend-design` ("unslop") skill, as named in `UI-IMPROVEMENT-PLAN.md`. The plan's Phase 3 section already fixes the direction (palette, fonts, principles), so it was followed as written. Checked against the skill's list of generic defaults: no cream background, no serif-and-terracotta pairing, no all-caps eyebrows, no gradient washes, and orange used as a signal. One watch item: Ink (#101214) is a tinted near-black, which the skill lists as a tell. The plan pins it, so it was kept.

## What changed

**Tokens** (`src/index.css`, `tailwind.config.js`)
- Replaced the cream/peach palette with Paper `#F5F6F4`, Ink `#101214`, Rule `#D9DBD6`, Terminal `#16181B`, Orange fill `#FF8500` and Deep orange `#9A4300`, plus derived `--muted`, `--wash`, `--terminal-ink`, `--terminal-dim`, `--danger`.
- Deleted `--surface`, `--surface-2`, `--brown-900`, `--orange-500/600`, `--amber-400`, `--orange-fill-hover`, `--text`, `--text-heading`, `--brand-gradient`, `--headline-gradient`, `--peach-gradient`.
- Tailwind `brand.*` is now `paper, ink, rule, terminal, terminal-ink, terminal-dim, orange-fill, orange-ink, orange-ink-hover, muted, wash, danger`. Class renames done across `src/`: `brand-surface` to `brand-paper`, `brand-surface-2` to `brand-wash`, `brand-border` to `brand-rule`, `brand-text` to `brand-ink`. The `backgroundImage` gradients were removed from the config.
- shadcn HSL tokens remapped onto the palette. `--input` is now the muted grey so form-control borders meet 3:1. `--destructive` darkened to 6:1.
- Radius: `--radius` is `0.5rem` for controls and cards; `--radius-panel` (1rem) is reserved for the phase 4 hero panel. `rounded-3xl/2xl/xl` became `rounded-lg` everywhere. Buttons, skip link, scroll-to-top, share button and filter buttons are no longer pills.
- Type scale 1.250 on a 17px body, mapped onto Tailwind's `text-*` names. Headings on Home, inner pages and the closing block were stepped down one size so they do not balloon on the new scale.

**Fonts**
- Self-hosted through `@fontsource`: Bricolage Grotesque 700, IBM Plex Sans 400 and 600, IBM Plex Mono 400 (Latin subset). Imported in `src/main.jsx`. The Google Fonts `<link>` tags are gone from `index.html`. Verified in Chromium: no requests leave the origin and the three faces report as loaded.
- `h1` to `h6` default to the display face. `code`, `pre` use Plex Mono.
- Mono is used only in code blocks for now. The tab bar and buttons use Plex Sans.

**Components**
- `.btn-brand`: ink on orange (7.69:1), hover flips to ink fill with orange text. `.btn-ghost`: ink outline. No shadows, no lift, no shimmer. Radius 0.5rem.
- `.prose-bifoss`: 68ch measure, ink body text, code blocks on the Terminal colour, inline code on wash.
- shadcn `ui/` components: shadows removed, radius and colours come from the new tokens.
- Deleted from `index.css`: `.pill-label`, `.page-glow`, the gradient `.headline` (kept as a plain display style), the skeleton shimmer colours (now a flat Rule block that fades), the `.btn-brand::after` shimmer, `float-orb`, the marquee edge fade mask, and the focus ring's forced border-radius.
- Removed every card and button drop shadow and glow, including the orange glow on hover in Projects, Team and scroll-to-top.
- Gradient and blur removed from: reading progress bar, closing CTA, hero fallback orb, 404 orb, image placeholder, step number badges, track icon chips. The hero fallback orb is gone, so Home shows only the 3D shapes (or nothing, without WebGL) behind the headline.
- Pill eyebrows above the Home sections (Events, Tracks, How to join, FAQ) were removed because the class no longer exists. Event type and project status are now plain orange-ink text. The page-header `label` in `PageShell` is plain text for now (phase 6 removes it).
- Empty-state illustrations use Tailwind `fill-*` and `stroke-*` classes instead of hex.
- `src/lib/tokens.js` (new): `token('--name')` reads a CSS variable at runtime. The liquid tab bar, confetti and the 3D hero use it, so no colour is typed twice. The tab bar's `TINT` constant and the "must match" comment are gone.
- Logo chip beside the tab bar uses a new `.glass-chip` class instead of inline `rgba` and `backdrop-blur`.
- `index.html`: `theme-color` is now Paper.

## Pairs checked (WCAG, computed)

| Text | Background | Ratio |
|---|---|---|
| Ink #101214 | Paper #F5F6F4 | 17.32 |
| Ink | Orange #FF8500 | 7.69 |
| Deep orange #9A4300 | Paper | 6.10 |
| Deep orange | Wash (#ECEDEB) | 5.63 |
| Orange hover #7A3500 | Paper | 8.29 |
| Muted #5A5F66 | Paper | 5.94 |
| Muted | Wash | 5.48 |
| Danger #B42318 | Paper | 6.06 |
| Orange #FF8500 | Terminal #16181B | 7.29 |
| Terminal dim #9AA0A6 | Terminal | 6.74 |
| Terminal ink #E6E8EB | Terminal | 14.49 |

Correction to the plan: it quotes orange on Terminal as 7.7:1; the computed value is 7.29:1 (still above 4.5:1). Non-text: Rule on Paper is 1.29:1, so Rule is decorative only; control borders use Muted (5.94:1). Focus ring Deep orange on Paper 6.10:1.

## Verification

- `npm run lint`: passes. `npm run build`: passes (Linux sandbox, fresh `npm install`).
- axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice) in headless Chromium on `/`, `/about`, `/events`, `/projects`, `/blog`, `/team`, `/join`, `/code-of-conduct` and a 404 route at 1280px and 360px: zero violations on all 18 runs, no horizontal scroll.
- `grep -rnE "#[0-9a-fA-F]{3,8}" src` outside `src/index.css`: no matches. No `gradient` anywhere in `src/` or the CSS.
- Screenshots reviewed at 1280px and 360px for Home and About.
- Tab bar re-tested after the font change (software WebGL): tap Events, drag from Events to Projects, and Enter on a focused Blog tab all navigated correctly.

## Not done / left for later

- **Still on the page until phases 4 and 5:** the 3D hero, the typewriter tagline, the scrolling tools marquee, the splash screen, hover lifts, fade-up entrances, the animated "today" ping dot and the confetti. Their colours now come from the tokens but they are not redesigned. The headline sits over the 3D shapes, as before.
- **Remaining blur:** only `backdrop-filter` on the tab bar and logo chip (the frosted glass the owner asked for). There are no blur orbs.
- Cards are still cards (flat, bordered, 0.5rem). Phases 4 and 6 turn them into lists and rows.
- Only weights 400/600 (Plex Sans) and 700 (Bricolage) are loaded. `font-medium` (500) renders as 400 and `font-bold` on Plex Sans renders as 600. Latin subset only, so non-Latin text falls back to system fonts.
- `.prose-bifoss` was checked only by injecting sample HTML and reading computed styles (Bricolage headings, Terminal-coloured code block in Plex Mono, 68ch measure). It has not been seen on a real blog post, because there are none yet.
- Lighthouse not run. Not tested on real phones, Safari, Firefox, forced-colors mode or a screen reader.
