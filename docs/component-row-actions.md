# Component: RowActions

> Follows the `docs/component-button.md` template. No `'use client'` of its own — the client boundary
> is the `Menu` (Base UI `menu`) it renders. A
> "⋯" icon button that opens a menu of actions for one item — the cell content of a Table actions
> column, or the corner of a card.

## 1. Purpose

Every data table eventually needs a per-row "Edit / Duplicate / Delete" menu. RowActions packages
the pattern: a square ghost `Button` with a vertical-ellipsis icon, a required accessible name that
names the row ("Actions for Invoice #42"), and a `Menu` of options that can carry icons. It is
kept out of `Table` itself so `Table` stays a zero-JS server component and never pulls Base UI
(its 2 kB size budget); `Table.ActionsCell` / `Table.ActionsHeaderCell` give the column its layout.

## 2. Files

```
packages/ui/src/components/row-actions/
├── row-actions.styles.tsx   # tv() slot for the kebab icon.
├── row-actions.logic.tsx    # no directive (no hooks); renders client Menu. forwardRef to trigger.
├── row-actions.test.tsx
├── row-actions.stories.tsx
└── index.tsx
test/browser/row-actions.test.ts   # Playwright: open from a table row, pick an item, Escape
```

## 3. API

```ts
import type { MenuItemOption } from '@sukunagg/ui'

export interface RowActionsProps {
  items: MenuItemOption[]          // { label, icon?, onSelect?, disabled?, id? }
  'aria-label'?: string            // default 'Row actions' — pass one that names the row
  size?: 'sm' | 'md'               // trigger size; default 'sm' (fits a 44px table row)
  align?: 'start' | 'center' | 'end'   // menu alignment; default 'end' (column sits at the right)
  side?: 'top' | 'right' | 'bottom' | 'left'   // default 'bottom'
  disabled?: boolean               // disables the trigger
  className?: string               // merged onto the trigger
}
```

`MenuItemOption` gains `icon?: ReactNode` (v1.3) — a decorative, `aria-hidden` leading icon,
16px, tinted `text-text-dim`. Applies to `Menu`, `ContextMenu` and `RowActions`.

Table layout parts (static, in `Table`): `Table.ActionsHeaderCell` — a `th` whose default content is
a visually hidden "Actions" label (screen readers still get a column name), `w-px text-right`;
`Table.ActionsCell` — a `td`, `w-px text-right whitespace-nowrap`, holding the `RowActions`.

```tsx
<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Invoice</Table.HeaderCell>
      <Table.ActionsHeaderCell />
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>#42</Table.Cell>
      <Table.ActionsCell>
        <RowActions
          aria-label="Actions for invoice #42"
          items={[
            { label: 'Edit', icon: <PencilIcon />, onSelect: edit },
            { label: 'Delete', icon: <TrashIcon />, onSelect: remove },
          ]}
        />
      </Table.ActionsCell>
    </Table.Row>
  </Table.Body>
</Table>
```

Deliberately **not** in v1: separators/groups/submenus (Menu doesn't have them yet), a `danger`
item color (Q10), a Table `columns` config (Table is compositional by design).

## 4. Variants → tokens

Trigger = `Button variant="ghost" iconOnly size="sm|md"` (32/40px square). Icon: vertical ellipsis
SVG, `size-4`, `currentColor`. Menu: unchanged Menu tokens; item icon slot `size-4 shrink-0
text-text-dim` inside the existing `gap-2` row. No new tokens.

## 5. States

Trigger: default / hover / focus-visible / disabled (Button's). Menu: closed / open, item
highlighted / disabled (Menu's). Reduced motion via Menu.

## 6. Logic (`row-actions.logic.tsx`)

- No `'use client'`: it has no hooks (RSC-boundary test enforces this); `Menu` is the client
  module. `items` hold callbacks, so they are built in a client component anyway.
  `forwardRef<HTMLButtonElement>` to the trigger.
- Renders `<Menu items align side><Button ghost iconOnly aria-label … /></Menu>`.
- No `useEffect`, no DOM access.

## 7. Styles (`row-actions.styles.tsx`)

`tv()` with an `icon` slot only; the trigger look comes from `Button`.

## 8. Accessibility checklist

- [ ] Trigger is a native `<button>` with `aria-haspopup="menu"`/`aria-expanded` and a name
      (default "Row actions"; docs push a row-specific name so 20 identical buttons are distinguishable).
- [ ] Items are `role="menuitem"`; icons are `aria-hidden`, the label is the name.
- [ ] Arrow keys / Enter / Escape via Menu; focus returns to the trigger.
- [ ] Actions header keeps a screen-reader column name ("Actions", visually hidden).

## 9. Tests

Trigger renders with default and custom name; opens on click; items show icons (`aria-hidden`);
`onSelect` fires and the menu closes; disabled item doesn't fire; disabled trigger; ref + className;
SSR renders the trigger only; axe both themes. Table: `ActionsHeaderCell` has a hidden "Actions"
name and accepts children; `ActionsCell` is a right-aligned `td`. Browser: open from a table row,
arrow + Enter selects, Escape closes and returns focus.

## 10. Stories

`Default`, `InTable` (actions column with icons), `WithDisabledItem`. Both themes.

## 11. Decisions

- Separate component, not `Table.ActionsCell items={…}`: keeps `Table` server-only and Base-UI-free.
- Default `align="end"`: the column is at the row's right edge, so the menu opens inward.
- Default trigger `size="sm"` (32px) to fit the 44px row height.
