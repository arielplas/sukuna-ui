# Component: Table

> Follows the `docs/component-button.md` template. Static component — no `'use client'`. A styled,
> compound wrapper over native table elements (not a data grid).

## 1. Purpose

Present tabular data with Sukuna styling. Composition over configuration; sorting/selection/
virtualization are out of scope (use a data-grid library for those).

## 2. Files

```
src/components/table/
├── table.styles.tsx   # tv() slots: wrapper, table, header, body, row, headerCell, cell.
├── table.logic.tsx    # forwardRef<table> + Header/Body/Row/HeaderCell/Cell. NO 'use client'.
├── table.test.tsx
├── table.stories.tsx
└── index.tsx
```

## 3. API

```ts
export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  density?: 'comfortable' | 'compact'   // default 'comfortable'
  striped?: boolean                     // even body rows get a line-soft background
  hoverable?: boolean                   // every body row highlights on hover
}
export const Table: ForwardRefExoticComponent<TableProps> & {
  Header, Body, Row, HeaderCell, Cell   // thin styled wrappers over thead/tbody/tr/th/td
}
```

```tsx
<Table>
  <Table.Header><Table.Row><Table.HeaderCell>Name</Table.HeaderCell></Table.Row></Table.Header>
  <Table.Body><Table.Row><Table.Cell>Ariel</Table.Cell></Table.Row></Table.Body>
</Table>
```

## 4. Variants → tokens

wrapper: `w-full overflow-x-auto` (horizontal scroll on small screens). table: `w-full border-collapse
text-sm text-text`. headerCell: `h-10 px-3 text-xs uppercase tracking-eyebrow text-text-dim border-b
border-line`. row: `border-b border-line`, `data-[interactive]:hover:bg-line-soft`. cell: `h-11 px-3`.

Root options are applied to the `<table>` through descendant selectors, so sub-parts need no
context (and a descendant rule beats a cell's own `h-11` on specificity):

| option | table utilities |
|---|---|
| density compact | `[&_th]:h-8 [&_th]:px-2 [&_td]:h-9 [&_td]:px-2` (comfortable = unchanged cell classes) |
| striped | `[&_tbody_tr:nth-child(even)]:bg-line-soft` |
| hoverable | `[&_tbody_tr:hover]:bg-line` — `line` (10%) rather than `line-soft` so it still reads over a stripe |

## 5. States

Static. Rows highlight on hover when the table is `hoverable`, or per row with `data-interactive`.

## 6. Logic (`table.logic.tsx`)

- No `'use client'`. `Table` renders a scroll-wrapped `<table>` (forwardRef to the table). Sub-parts
  are thin styled wrappers over `thead`/`tbody`/`tr`/`th`/`td`, all accepting native props.

## 7. Styles

`tv()` `slots` + root-only `density` / `striped` / `hoverable` variants on the `table` slot;
`defaultVariants: { density: 'comfortable' }`. Sub-parts use a static slot map.

## 8. Accessibility checklist

- [ ] Real `<table>`/`<thead>`/`<th>` semantics (use `Table.HeaderCell` for headers).
- [ ] Add `scope="col"`/`scope="row"` on header cells where appropriate (native prop passthrough).
- [ ] The wrapper scrolls horizontally so the table never breaks the page layout.

## 9. Tests

Renders a semantic table with column headers and rows; header/data cells resolve to `th`/`td`; ref
on the table; className merges; the wrapper enables horizontal scroll; SSR; axe both themes.

## 10. Stories

`Default`, `Compact`, `Striped`, `Hoverable`, `StripedHoverableCompact`, `Interactive` (per-row
hover), `Wide`.

## 11. Decisions

- Compound of styled native elements; no sorting/selection/pagination baked in (compose with
  Pagination; bring a data grid for heavy needs).
- Root options (post-0.8.0) use descendant selectors instead of React context, keeping every
  sub-part a stateless, context-free wrapper (RSC-safe, no re-render coupling).
