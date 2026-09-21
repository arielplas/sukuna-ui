# Component: HoverCard

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `preview-card`). A rich floating card shown when a link/element is hovered or focused. Compound.

## 1. Purpose

Preview richer context for a link without a click — a user card, a repo summary, a footnote.
Positioning, hover/focus open-and-close delays, portalling, and dismiss come from Base UI Preview
Card. Distinct from `Tooltip`: HoverCard holds interactive/structured content and is **not** a
`role="tooltip"` (screen readers reach its content), so it must never carry information the user
can't get another way.

## 2. Files

```
src/components/hover-card/
├── hover-card.styles.tsx   # tv() slots: trigger, positioner, popup.
├── hover-card.logic.tsx    # 'use client'; compound HoverCard + sub-parts.
├── hover-card.test.tsx
├── hover-card.stories.tsx
└── index.tsx
test/browser/hover-card.test.ts  # Playwright: hover opens, mouse-out closes after delay
```

## 3. API

```ts
import type { ReactNode } from 'react'

export interface HoverCardProps {
  children: ReactNode          // Trigger + Content
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delay?: number               // ms before opening on hover; default 300
  closeDelay?: number          // ms before closing after leave; default 300
}
```

Compound: `HoverCard` + `HoverCard.Trigger` (renders an `<a>`; accepts `href`, `delay`,
`closeDelay`, and Base UI `render` to swap the element) + `HoverCard.Content` (takes
`side?: 'top'|'right'|'bottom'|'left'` default `'top'`, `align?: 'start'|'center'|'end'` default
`'center'`, `sideOffset?: number` default `8`). `delay`/`closeDelay` live on the **Trigger** (Base
UI), not the root.

Deliberately **not** in v1: an arrow (no library component uses one — Tooltip/Menu offset without
one), `openOnHover={false}` click mode (that's `Popover`, out of scope for now), and a backdrop.

## 4. Variants → tokens

popup: `max-w-xs rounded-md border border-line bg-surface p-4 text-sm text-text shadow-card` with
enter/exit fade+scale via `data-[starting-style]`/`data-[ending-style]` and
`origin-[var(--transform-origin)]`. positioner: `z-[var(--sk-z-popover)]`. trigger: focus ring only
(colour inherited so any link style works).

No new tokens — reuses `--sk-surface`, `--sk-line`, `--sk-shadow-card`, `--sk-focus-ring`,
`--sk-z-popover`, text tokens.

## 5. States

closed · opening (after `delay`, fades/scales in) · open · closing (after `closeDelay`). Reduced
motion: enter/exit transforms collapse to instant (`motion-reduce:*`).

## 6. Logic (`hover-card.logic.tsx`)

- `'use client'`. `Base.PreviewCard.Root` (open/defaultOpen/onOpenChange/delay/closeDelay) →
  `Trigger render={child}` → `Portal` → `Positioner` (side/align/sideOffset) → `Popup` → optional
  `Arrow` → children.
- Not `forwardRef` (ref goes on the trigger child).
- No `useEffect`, no DOM access.

## 7. Styles (`hover-card.styles.tsx`)

`tv()` `slots` (popup, arrow), no variants; `side`/`align`/`sideOffset` are Positioner props, not
style variants.

## 8. Accessibility checklist

- [ ] Opens on hover **and** keyboard focus of the trigger; closes on blur/leave/Escape.
- [ ] Content reachable by AT (not `role="tooltip"`); never the sole source of critical info.
- [ ] Interactive content inside the card is focusable and the card stays open while focus is in it.
- [ ] `prefers-reduced-motion` honored (no scale/slide).
- [ ] Text contrast ≥4.5:1 in both themes.

## 9. Tests

**Unit:** trigger renders; content absent while closed; `defaultOpen` renders the popup content;
`side` positioner prop applies; consumer `className` merges on the popup; SSR renders trigger only.
**Browser:** hover opens after delay; moving away closes after `closeDelay`; focus opens.

## 10. Stories

`Default` (user card), `Sides`, `WithLink` (interactive content). Both `data-theme` values.

## 11. Decisions

- Built on Base UI Preview Card; compound API mirroring `Drawer`/`Dialog`.
- Hover/focus only — a click-triggered floating panel would be `Popover` (out of scope per roadmap §D).
- Default `delay` 300 (halved from Base UI's 600 for snappier previews) / `closeDelay` 300.
- No arrow: matches Tooltip/Menu (offset popups, no arrow) and avoids a fragile per-placement visual.
- `delay`/`closeDelay` sit on `HoverCard.Trigger` (Base UI's location), not the root.
