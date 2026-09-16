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
}
```

## 4. Variants → tokens

list: `flex border-b border-line`. tab: `h-10 px-3 text-sm font-medium text-text-dim border-b-2 border-transparent -mb-px hover:text-text data-[selected]:text-text data-[selected]:border-accent focus-visible:ring-2 focus-visible:ring-accent-glow`. panel: `pt-4 text-text`.

## 5. States

tab: default · hover · selected (accent underline) · focus-visible · disabled.

## 6. Logic (`tabs.logic.tsx`)

- `'use client'`. `Base.Root` (value/defaultValue/onValueChange guarding non-string) → `Base.List`
  of `Base.Tab` → a `Base.Panel` per item.

## 7. Styles

`tv()` `slots` (no variants). Horizontal only in v1 (see Decisions).

## 8. Accessibility checklist

- [ ] `role="tablist"`/`tab`/`tabpanel` wired by Base UI; give the list an `aria-label`.
- [ ] Arrow keys move between tabs; Tab key moves to the panel.
- [ ] Selected tab is distinguishable by more than color (underline + text weight).

## 9. Tests

**Unit:** renders tabs + active panel; clicking a tab switches the panel and fires `onValueChange`;
SSR. **Browser:** arrow-key navigation switches tabs.

## 10. Stories

`Default`, `WithDefault`, `DisabledTab`.

## 11. Decisions

- Horizontal only in v1 (vertical orientation deferred) — keeps the underline styling simple.
- Prop-driven `items` with string values.
