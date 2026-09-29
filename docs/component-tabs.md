# Component: Tabs

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI `tabs`).

## 1. Purpose

Switch between panels of related content. Roving focus + arrow-key navigation from Base UI.

## 2. Files

```
packages/ui/src/components/tabs/
├── tabs.styles.tsx   # tv() slots: root, list, tab, panel.
├── tabs.logic.tsx    # 'use client'; prop-driven wrapper.
├── tabs.test.tsx
├── tabs.stories.tsx
└── index.tsx
test/browser/tabs.test.ts  # Playwright: arrow-key navigation
```

## 3. API

```ts
export interface TabItem { value: string; label: ReactNode; content: ReactNode; disabled?: boolean }

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
  orientation?: 'horizontal' | 'vertical'   // v1.3 — default 'horizontal'
  variant?: 'underline' | 'pill'            // default 'underline'; horizontal only
  size?: 'sm' | 'md' | 'lg'                 // default 'md'
  fitted?: boolean                          // tabs share the list width equally; horizontal only
}
```

**Vertical (v1.3).** `orientation="vertical"` stacks the tabs in a left-hand column beside the
panel — settings pages, docs sections, sidebar navigation. Base UI switches the keys to
ArrowUp/ArrowDown and sets `aria-orientation="vertical"` on the tablist. Labels can hold an
icon + text (`gap-2`).

## 4. Variants → tokens

Shared: list `flex`; tab `inline-flex items-center font-medium text-text-dim hover:text-text
focus-visible:ring-2 focus-visible:ring-focus-ring` (+ disabled dimming); panel `pt-4 text-text`.

| variant | list | tab | selected |
|---|---|---|---|
| underline | `border-b border-line` | `border-b-2 border-transparent -mb-px rounded-t-sm` | `aria-selected:text-accent aria-selected:border-accent` |
| pill | `w-fit gap-1 rounded-pill bg-well p-1` | `rounded-pill border border-transparent` | `aria-selected:bg-surface aria-selected:text-accent aria-selected:border-line` |

The pill's selected segment (`surface`) is lighter than its `well` track in **both** themes
(dark `#000 → #141416`, light `#E8E5DD → #FFFFFF`), so the segmented look holds without a
theme-specific rule.

| size | tab |
|---|---|
| sm | `h-8 px-2.5 text-sm` |
| md | `h-10 px-3 text-sm` |
| lg | `h-12 px-4 text-md` |

`fitted`: list `w-full`, tab `flex-1 justify-center` (declared after `variant` so `w-full` beats the
pill's `w-fit`).

Vertical: root `flex items-start gap-6`; list `flex-col shrink-0 min-w-44 border-r border-line`;
tab `w-full justify-start h-9 border-r-2 -mr-px rounded-l-sm`, selected also `bg-surface-2`;
panel `flex-1 min-w-0 pt-0`. Horizontal keeps the bottom underline (`border-b-2 -mb-px`).

## 5. States

tab: default · hover · selected (accent underline) · focus-visible · disabled.

**Motion (v1.3, `docs/motion.md`):** the selected underline (vertical: right-edge bar) is a Base UI `Tabs.Indicator` that slides to the new tab (`ease-spring`, `duration-base`); the tab draws its own border until the indicator is measured (no-JS/SSR). Reduced motion: instant.

## 6. Logic (`tabs.logic.tsx`)

- `'use client'`. `Base.Root` (value/defaultValue/onValueChange guarding non-string) → `Base.List`
  of `Base.Tab` → a `Base.Panel` per item.

## 7. Styles

`tv()` `slots` + `orientation` / `variant` / `size` / `fitted` variants; `defaultVariants:
{ orientation: 'horizontal', variant: 'underline', size: 'md' }` — the defaults reproduce the
original styling exactly. The underline borders come from compound variants per orientation (bottom
rule for a row, right-edge rule + surface fill for a column), and a vertical `md` row keeps its 36px
height. `pill` and `fitted` are horizontal treatments: the logic renders vertical tabs as underline
and unfitted, and renders the sliding indicator only for `underline` (the pill's selected segment is
the tab itself).

## 8. Accessibility checklist

- [ ] `role="tablist"`/`tab`/`tabpanel` wired by Base UI; give the list an `aria-label`.
- [ ] Arrow keys move between tabs (Left/Right horizontal, Up/Down vertical); Tab key moves to the panel.
- [ ] Vertical: tablist carries `aria-orientation="vertical"`.
- [ ] Selected tab is distinguishable by more than color (underline + text weight).

## 9. Tests

**Unit:** renders tabs + active panel; clicking a tab switches the panel and fires `onValueChange`;
SSR; vertical sets `aria-orientation` and the column layout. **Browser:** arrow-key navigation
switches tabs; ArrowDown moves focus in the vertical story.

## 10. Stories

`Default`, `WithDefault`, `DisabledTab`, `Vertical` (v1.3 — settings nav with icons), `Pill`,
`Sizes`, `PillSizes`, `Fitted`, `PillFitted`.

## 11. Decisions

- Horizontal only in v1; **vertical added in v1.3** (owner request, Q19) as `orientation` — the
  indicator moves to a right-edge bar on the list border plus a `surface-2` fill for the selected row.
- Prop-driven `items` with string values.
- `pill` (added post-0.8.0) keeps crimson **text** for the selected segment, matching `underline`,
  but never a crimson fill — a selected tab is state, not the surface's one primary action.
- `size` uses the same `sm | md | lg` scale as every other control.
