# Implementation — Theming & brand assets

The site is **dark-only** (no light theme, no theme switcher). Identity is derived from the
community logo: a deep navy field, clean white mark, a blue primary accent, and a single warm
amber secondary "hazard" contrast.

## `src/styles/theme.css`

Loaded last in `customCss` (after the two `@fontsource` imports). The file header indexes six
sections (below); a seventh **Draft banner** block was appended later (see "Banner & footer"):

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

## Banner & footer overrides (`src/components/`)

Two more registered component overrides, beyond the dark-only pair:

- **`Banner.astro`** — replaces Starlight's frontmatter-gated banner with an always-on,
  full-width **"Draft preview"** strip (`.dzm-draft-banner`), pinned `position: fixed` at the
  very top of the viewport (height `--dzm-banner-h` ≈ `1.9rem`, `3rem` on narrow screens,
  `z-index: 20`, amber background). Because Starlight's own header, sidebars, and mobile TOC are
  also fixed, the theme's Draft-banner block nudges each down by `--dzm-banner-h`: `.header`,
  `.sidebar-pane` (left nav), `.main-frame` top padding, `mobile-starlight-toc nav`, **and the
  desktop `.right-sidebar`** ("On this page" TOC — also height-trimmed to `100vh − --dzm-banner-h`
  so it still bottoms out at the viewport edge). These rules are **unlayered**, so they win over
  Starlight's layered defaults. *(The right-sidebar offset was the last one added — without it the
  TOC tucked up under the top bar.)*
- **`Footer.astro`** — wraps Starlight's default footer and appends a legal/contact row
  (`.dzm-footer-legal`): a link nav of **Sources · Privacy · Contact** plus a "community project ·
  CC BY 4.0 · not affiliated with Bohemia Interactive" line.

## Typography

Both faces are self-hosted via `@fontsource-variable/*` (imported through `customCss`) — no
external runtime font dependency. **Inter Variable** = body; **Oswald Variable** = display
(headings, brand wordmark, hero, card/group titles).

## Brand assets

All original geometry (not copied from other mods). Palette: navy `#10182a`, white `#f4f7fc`,
blue `#2f7fe6`, amber `#f0a93b`.

The **active mark** is the **split-circle** (`logo-split.svg`): an off-white (`#eef2f8`) circle
(r 44) sliced by two horizontal cuts into three bands in a `0 0 128 120` viewBox — top band nudged
left (`cx 44`), middle band pushed right past the circle's edge (`cx 78`), bottom centered
(`cx 56`), with generous gaps marking the cuts. It serves as **both** the header logo
(`astro.config.mjs` `logo.src`) and the splash hero image (`index.mdx` `hero.image`).

An earlier **three-shard "Z" mark** survives only inlined in `favicon.svg`: three white triangular
shards sliced by parallel 45° gaps, as three polygons in a `0 0 41 22` viewBox
(`0,3 11,3 11,14` · `15,1 15,15 30,15` · `22,2 41,2 41,22`). The standalone `logo.svg` of that mark
was deleted once the split-circle became the brand. `hero.svg` (earlier hero art) is retained but
currently unreferenced, since the hero switched to the split logo.

| File | What |
| --- | --- |
| `src/assets/logo-split.svg` | **Active** mark — split-circle, off-white on transparent; header + hero |
| `public/favicon.svg` | Navy `#10182a` rounded chip + inlined three-shard mark |
| `src/assets/app-icon.svg` | Navy gradient chip + "MODDERS" (Oswald) + mark — scalable app icon |
| `src/assets/hero.svg` | Earlier hero art (mark + instrument contours) — retained, currently unreferenced |
