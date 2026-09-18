# Tokens — Sukuna → `--sk-*`

Source: Pomo Design System (Sukuna language). Dark is the default theme. Light palette **approved by owner 2026-09-16**.

## Color (semantic)

| Token | Dark (source) | Light (proposed) | Use |
|---|---|---|---|
| `--sk-bg` | `#0A0A0B` (ink) | `#FAF9F5` | Page canvas |
| `--sk-surface` | `#141416` (panel) | `#FFFFFF` | Cards, dialogs |
| `--sk-surface-2` | `#1C1C20` (panel2) | `#F1EFE9` | Nested surfaces, inputs |
| `--sk-well` | `#000000` | `#E8E5DD` | Sunken areas |
| `--sk-line` | `rgba(255,255,255,.10)` | `rgba(0,0,0,.12)` | Borders |
| `--sk-line-soft` | `rgba(255,255,255,.06)` | `rgba(0,0,0,.06)` | Dividers |
| `--sk-accent` | `#FF3B4E` (crimson) | `#D8253A` | Primary action, "live" |
| `--sk-accent-deep` | `#B01221` | `#9A0E1C` | Hover/pressed accent |
| `--sk-accent-glow` | `rgba(255,59,78,.6)` | `rgba(216,37,58,.35)` | Decorative glow shadow (not the focus ring) |
| `--sk-focus-ring` | `#FF3B4E` | `#D8253A` | Solid focus ring (≥3:1 on every surface, WCAG 1.4.11) |
| `--sk-premium` | `#E8DCC4` (bone) | `#786A4A` | Premium / gold surfaces |
| `--sk-premium-dim` | `#B5A98C` | `#776A48` | Premium secondary |
| `--sk-text` | `#F4F1EC` | `#141413` | Primary text |
| `--sk-text-dim` | `#9A948A` | `#5E5A52` | Secondary text |
| `--sk-text-faint` | `#8C8479` | `#6F6B63` | Placeholders, disabled |
| `--sk-success` | `#31C877` | `#177B46` | Done / positive |

> **Contrast floor.** Every color used as text must clear WCAG AA — 4.5:1 (normal) / 3:1 (large or
> non-text UI) — on `bg`, `surface` and `surface-2` in **both** themes. `text-faint` (both themes)
> and light-theme `premium`/`premium-dim`/`success` were retuned to meet this (see D22). The focus
> ring uses the solid `--sk-focus-ring`, not the translucent `--sk-accent-glow` (which failed 3:1).
> Verify with `scratchpad` contrast script when changing any color token.
| `--sk-gradient-accent` | `linear-gradient(135deg,#FF3B4E,#B01221)` | `linear-gradient(135deg,#D8253A,#9A0E1C)` | Wordmark, hero CTA |

## Typography

| Token | Value |
|---|---|
| `--sk-font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif` |
| `--sk-font-display` | `"Archivo", var(--sk-font-sans)` — library does NOT bundle the font; document `@import` / `next/font` for consumers |
| `--sk-text-xs / sm / md / lg / xl / 2xl / 3xl` | `11 / 12 / 14 / 16 / 18 / 24 / 34 px` |
| `--sk-weight-regular / semibold / bold / black` | `400 / 600 / 700 / 900` |
| `--sk-tracking-tight / normal / eyebrow` | `-0.02em / 0 / 0.22em` |
| `--sk-leading-tight / normal` | `1.02 / 1.5` |
| Numerals | `font-variant-numeric: tabular-nums` on numeric Text variant |

## Spacing, radius, shadow, motion

| Group | Tokens |
|---|---|
| Space | `--sk-space-1..8` = `4 6 8 12 16 20 24 32 px` |
| Radius | `--sk-radius-sm 8px`, `--sk-radius-md 12px`, `--sk-radius-lg 16px`, `--sk-radius-pill 999px` |
| Shadow | `--sk-shadow-card: 0 30px 60px -24px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.06)` (dark) / light **proposed** `0 20px 40px -24px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.06)` — pending owner approval, see `questions.md` Q12 |
| Motion | `--sk-duration-fast 120ms`, `--sk-duration-base 200ms`, `--sk-ease: cubic-bezier(.2,.8,.2,1)` |
| Z-index | `--sk-z-tooltip 40`, `--sk-z-dialog 50` |

## Theme wiring (Tailwind v4)

`src/styles/theme.css`, shipped as `sukuna-ui/theme.css`:

```css
:root, [data-theme="dark"]  { --sk-bg: #0A0A0B; --sk-surface: #141416; /* ... */ }
[data-theme="light"]        { --sk-bg: #FAF9F5; --sk-surface: #FFFFFF; /* ... */ }

@theme inline {
  --color-bg: var(--sk-bg);
  --color-surface: var(--sk-surface);
  --color-surface-2: var(--sk-surface-2);
  --color-accent: var(--sk-accent);
  --color-text: var(--sk-text);
  /* one line per semantic color */
  --font-display: var(--sk-font-display);
  --radius-sm: var(--sk-radius-sm);
  --ease-sukuna: var(--sk-ease);
  --duration-fast: var(--sk-duration-fast);
}

@utility bg-gradient-accent { background-image: var(--sk-gradient-accent); }
```

`@theme inline` keeps the utility pointing at the runtime variable, so `data-theme` switches colors without Tailwind's `dark:` variant. Consumers override by redefining any `--sk-*` under their own selector, exactly as before.
