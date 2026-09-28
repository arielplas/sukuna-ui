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
  orientation?: 'horizontal' | 'vertical'   // v1.3 — default 'horizontal'
}
```

**Vertical (v1.3).** `orientation="vertical"` stacks the tabs in a left-hand column beside the
panel — settings pages, docs sections, sidebar navigation. Base UI switches the keys to
ArrowUp/ArrowDown and sets `aria-orientation="vertical"` on the tablist. Labels can hold an
icon + text (`gap-2`).

## 4. Variants → tokens

list: `flex border-b border-line`. tab: `h-10 px-3 text-sm font-medium text-text-dim border-b-2 border-transparent -mb-px hover:text-text data-[selected]:text-text data-[selected]:border-accent focus-visible:ring-2 focus-visible:ring-accent-glow`. panel: `pt-4 text-text`.

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

`tv()` `slots` + an `orientation` variant (`horizontal` default, `vertical`).

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

`Default`, `WithDefault`, `DisabledTab`, `Vertical` (v1.3 — settings nav with icons).

## 11. Decisions

- Horizontal only in v1; **vertical added in v1.3** (owner request, Q19) as `orientation` — the
  indicator moves to a right-edge bar on the list border plus a `surface-2` fill for the selected row.
- Prop-driven `items` with string values.
