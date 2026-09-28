# Component: Collapsible

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `collapsible`). One section that shows and hides. Compound.

## 1. Purpose

A single disclosure: "Show advanced options", "Read more", a sidebar group. `Accordion` is for a
*set* of sections; using a one-item Accordion for this adds a heading level and item chrome you
don't want. Collapsible is the unstyled-by-default primitive with a styled trigger and an animated
panel.

## 2. Files

```
packages/ui/src/components/collapsible/
├── collapsible.styles.tsx   # tv() slots: root, trigger, icon, panel, content.
├── collapsible.logic.tsx    # 'use client'; compound Collapsible + Trigger + Content.
├── collapsible.test.tsx
├── collapsible.stories.tsx
└── index.tsx
test/browser/collapsible.test.ts   # Playwright: click + Enter/Space toggle, aria-expanded
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface CollapsibleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  open?: boolean
  defaultOpen?: boolean                 // default false
  onOpenChange?: (open: boolean) => void
  disabled?: boolean                    // default false
}
```

Compound: `Collapsible` (a `div`; state) · `Collapsible.Trigger` (a `button` with a rotating
chevron; `hideIcon` to drop it; Base UI `render` to swap the element) · `Collapsible.Content` (the
panel; `keepMounted` to keep it in the DOM while closed, e.g. for find-in-page).

## 4. Variants → tokens

No variants. trigger: `inline-flex items-center gap-2 text-sm font-medium text-text` + focus ring;
icon: `text-text-dim` rotating 180° on `data-[panel-open]`. panel: height animates via Base UI's
`--collapsible-panel-height` (`h-[var(--collapsible-panel-height)]`, `data-[starting-style]:h-0`,
`data-[ending-style]:h-0`), `overflow-hidden`. content: `pt-2 text-sm text-text-dim`. No new tokens.

## 5. States

closed · open · disabled (trigger `opacity-45`, `cursor-not-allowed` via `data-[disabled]` — Base UI keeps a
disabled trigger focusable with `aria-disabled`, no native `disabled`, same as Tabs D27). Reduced motion: no height
transition, no chevron rotation transition.

## 6. Logic (`collapsible.logic.tsx`)

- `'use client'`. `Base.Root` (open/defaultOpen/onOpenChange/disabled + div props) → `Base.Trigger`
  → `Base.Panel`.
- Root `forwardRef<HTMLDivElement>`. No `useEffect`, no DOM access.

## 7. Styles (`collapsible.styles.tsx`)

`tv()` `slots`: `root`, `trigger`, `icon`, `panel`, `content`. Chevron is the same inline SVG as
Accordion (`aria-hidden`).

## 8. Accessibility checklist

- [ ] Trigger is a native `<button>` with `aria-expanded` + `aria-controls` → panel.
- [ ] Enter/Space toggle (native).
- [ ] Hidden panel content is not in the tab order.
- [ ] Focus ring visible both themes; `prefers-reduced-motion` honored.

## 9. Tests

Closed by default (content absent, `aria-expanded=false`); click opens (`aria-expanded=true`,
content visible); `defaultOpen`; controlled `open` + `onOpenChange`; `disabled` blocks toggling;
`hideIcon`; ref + `className` merge; server render; hydrate; axe both themes.
**Browser:** keyboard Enter/Space toggles.

## 10. Stories

`Default`, `DefaultOpen`, `Controlled`, `Disabled`. Both themes.

## 11. Decisions

- Chevron shown by default (the affordance people expect); `hideIcon` for custom triggers.
- Panel unmounts when closed (Base UI default); `keepMounted` opt-in on `Content`.
