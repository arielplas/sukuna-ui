# Component: Tabs

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI `tabs`).

## 1. Purpose

Switch between panels of related content. Roving focus + arrow-key navigation from Base UI.

## 2. Files

```
src/components/tabs/
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
  variant?: 'underline' | 'pill'   // default 'underline'
  size?: 'sm' | 'md' | 'lg'        // default 'md'
  fitted?: boolean                 // tabs share the list width equally
}
```

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

## 5. States

tab: default · hover · selected (accent underline) · focus-visible · disabled.

## 6. Logic (`tabs.logic.tsx`)

- `'use client'`. `Base.Root` (value/defaultValue/onValueChange guarding non-string) → `Base.List`
  of `Base.Tab` → a `Base.Panel` per item.

## 7. Styles

`tv()` `slots` + `variant` / `size` / `fitted` variants; `defaultVariants: { variant: 'underline',
size: 'md' }` — the defaults reproduce the original styling exactly. Horizontal only (see Decisions).

## 8. Accessibility checklist

- [ ] `role="tablist"`/`tab`/`tabpanel` wired by Base UI; give the list an `aria-label`.
- [ ] Arrow keys move between tabs; Tab key moves to the panel.
- [ ] Selected tab is distinguishable by more than color (underline + text weight).

## 9. Tests

**Unit:** renders tabs + active panel; clicking a tab switches the panel and fires `onValueChange`;
SSR. **Browser:** arrow-key navigation switches tabs.

## 10. Stories

`Default`, `WithDefault`, `DisabledTab`, `Pill`, `Sizes`, `PillSizes`, `Fitted`, `PillFitted`.

## 11. Decisions

- Horizontal only in v1 (vertical orientation deferred) — keeps the underline styling simple.
- Prop-driven `items` with string values.
- `pill` (added post-0.8.0) keeps crimson **text** for the selected segment, matching `underline`,
  but never a crimson fill — a selected tab is state, not the surface's one primary action.
- `size` uses the same `sm | md | lg` scale as every other control.
