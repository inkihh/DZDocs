# Implementation — Theming & brand assets

The site is **dark-only** (no light theme, no theme switcher). Identity is derived from the
community logo: a deep navy field, clean white mark, a blue primary accent, and a single warm
amber secondary "hazard" contrast.

## `src/styles/theme.css`

Loaded last in `customCss` (after the two `@fontsource` imports). Six sections:

1. **Fonts & shared tokens** — `--sl-font` = Inter Variable stack (body);
   `--dzm-font-display` = Oswald Variable stack (display); `--dzm-amber: #f0a93b`;
   `--dzm-hazard` (the −45° amber chevron `repeating-linear-gradient`).
2. **Color tokens** (single `:root` palette — no `[data-theme='light']`):
   - Accent (blue): `--sl-color-accent-low: #15315a`, `--sl-color-accent: #2f7fe6`,
     `--sl-color-accent-high: #97c2ff`.
   - Navy-charcoal grays: white `#eef2f8` → gray-1..6 (`#d4dbe8`, `#abb4c6`, `#7b8499`,
     `#49546a`, `#2a3242`, `#1a2231`).
   - **`--sl-color-black: #10182a`** — the page background, the exact navy sampled from the
     brand logo.
   - Chrome: `--sl-color-bg-nav: #0e1524` (header, slightly deeper), `--sl-color-bg-sidebar: #10182a`
     (flush with the page), `--sl-color-hairline-shade: #232c3c`.
3. **Global type & accents** — Oswald for `h1–h3`, the `.site-title`, and hero `h1`; `h2`s render
   as uppercase stenciled labels with a hairline underline. `.header` has a single bottom hairline
   (an earlier blue inset bar was removed to leave one separator line).
4. **Header / sidebar chrome** — active sidebar entry gets a blue left spine + tinted background;
   group labels are uppercase Oswald.
5. **Splash hero** — `.hero::before` paints a radial blue glow over a navy gradient; the hero `h1`
   is large uppercase Oswald; primary CTA is a stamped button; the hero image gets a blue drop glow.
6. **Landing cards** — outlined cards lifted ~5% off the navy (`color-mix(#9fb4d6 5%, black)`),
   blue hover border, uppercase Oswald titles; plus `hr.hazard` (the amber chevron divider).

## Dark-only overrides (`src/components/`)

Registered via Starlight `components`:

- **`ThemeProvider.astro`** — replaces Starlight's provider. An inline (no-FOUC) script forces
  `document.documentElement.dataset.theme = 'dark'` and defines a no-op `StarlightThemeProvider`
  stub. Stored/system preference is ignored.
- **`ThemeSelect.astro`** — renders nothing, removing the theme switcher from both the header and
  the mobile menu.

Result: `data-theme` is always `dark`; the light palette and switcher are gone entirely.

## Typography

Both faces are self-hosted via `@fontsource-variable/*` (imported through `customCss`) — no
external runtime font dependency. **Inter Variable** = body; **Oswald Variable** = display
(headings, brand wordmark, hero, card/group titles).

## Brand assets

All original geometry; the mark is the community's own logo, faithfully vectorized (not copied
from other mods). Palette: navy `#10182a`, white `#f4f7fc`, blue `#2f7fe6`, amber `#f0a93b`.

The **mark** = three white triangular shards sliced by parallel 45° gaps (a stylized "Z" for
DayZ), as three polygons in a `0 0 41 22` viewBox:
`0,3 11,3 11,14` · `15,1 15,15 30,15` · `22,2 41,2 41,22`.

| File | What |
| --- | --- |
| `src/assets/logo.svg` | Header mark — white shards on transparent |
| `public/favicon.svg` | Navy `#10182a` rounded chip + white mark |
| `src/assets/app-icon.svg` | Navy gradient chip + "MODDERS" (Oswald) + mark — scalable version of the supplied raster icon |
| `src/assets/hero.svg` | Large mark + blue instrument contours / corner ticks, for the splash hero |
