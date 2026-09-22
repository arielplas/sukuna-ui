import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type TableStyleProps, tableStyles } from './table.styles'

// Sub-parts vary by nothing, so they share one static slot map.
const styles = tableStyles()

/** Props for {@link Table}: the native `<table>` attributes plus the root style options. */
export interface TableProps extends ComponentPropsWithoutRef<'table'>, TableStyleProps {}

/**
 * Table root: a `<table>` inside a full-width, horizontally scrolling `<div>`. Accepts every
 * native `<table>` attribute; `className` is merged into the table (not the wrapper) and the ref
 * points at the `<table>`.
 */
const TableRoot = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density, striped, hoverable, className, children, ...rest },
  ref,
) {
  const root = tableStyles({ density, striped, hoverable })
  return (
    <div className={root.wrapper()}>
      <table ref={ref} className={root.table({ className })} {...rest}>
        {children}
      </table>
    </div>
  )
})

/** `Table.Header`: a left-aligned `<thead>`; put one `Table.Row` of `Table.HeaderCell`s inside. */
function Header({ className, ...rest }: ComponentPropsWithoutRef<'thead'>) {
  return <thead className={styles.header({ className })} {...rest} />
}
/** `Table.Body`: an unstyled `<tbody>` holding the data `Table.Row`s. */
function Body({ className, ...rest }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={styles.body({ className })} {...rest} />
}
/**
 * `Table.Row`: a `<tr>` with a bottom hairline (none on the last row). Add `data-interactive`
 * to get a hover background for clickable rows.
 */
function Row({ className, ...rest }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={styles.row({ className })} {...rest} />
}
/**
 * `Table.HeaderCell`: a 40px-tall `<th>` in dim uppercase eyebrow text. Pass `scope="col"` (or
 * `scope="row"` for row headers) so screen readers associate it with its cells.
 */
function HeaderCell({ className, ...rest }: ComponentPropsWithoutRef<'th'>) {
  return <th className={styles.headerCell({ className })} {...rest} />
}
/** `Table.Cell`: a 44px-tall, vertically centred `<td>`; use `className` for alignment. */
function Cell({ className, ...rest }: ComponentPropsWithoutRef<'td'>) {
  return <td className={styles.cell({ className })} {...rest} />
}

/**
 * Presents tabular data with Sukuna styling as a compound of thin wrappers over the native table
 * elements: `Table` + `Table.Header` / `Table.Body` / `Table.Row` / `Table.HeaderCell` /
 * `Table.Cell`.
 *
 * @remarks
 * - SSR/RSC: static (no `'use client'`); every part is a plain function component with no state
 *   or DOM access, so the whole table can live in a React Server Component.
 * - Accessibility: real `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` semantics — use
 *   `Table.HeaderCell` (never a styled `Table.Cell`) for headers and give it `scope`. Add a
 *   `<caption>` child or `aria-label` on `Table` to name it. The wrapper scrolls horizontally so a
 *   wide table never breaks the page layout.
 * - Variants (on the root only; applied to the `<table>` via descendant selectors so sub-parts
 *   need no context):
 *   - `density`: 'comfortable' (default — 40px header / 44px cells) | 'compact' (32px / 36px,
 *     tighter padding).
 *   - `striped`: boolean — even body rows get a `line-soft` background.
 *   - `hoverable`: boolean — every body row highlights (`line`) on hover, without per-row
 *     `data-interactive`.
 *   Each part takes its native props and a `className` merged after the base styles. Only the
 *   root is `forwardRef` (→ `HTMLTableElement`); sub-parts take no ref.
 * - Behaviour: renders every row you pass — no sorting, selection, virtualization or paging.
 *   Beyond a few hundred rows, paginate (compose with `Pagination`) or use a data grid.
 *   `data-interactive` on a `Table.Row` opts that single row into a hover background.
 *
 * @example
 * ```tsx
 * import { Table } from 'sukuna-ui'
 *
 * const users = [
 *   { id: 1, name: 'Ariel', role: 'Owner', lastSeen: 'Today' },
 *   { id: 2, name: 'Sukuna', role: 'Admin', lastSeen: 'Yesterday' },
 * ]
 *
 * <Table aria-label="Team members">
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.HeaderCell scope="col">Name</Table.HeaderCell>
 *       <Table.HeaderCell scope="col">Role</Table.HeaderCell>
 *       <Table.HeaderCell scope="col" className="text-right">Last seen</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     {users.map((user) => (
 *       <Table.Row key={user.id} data-interactive onClick={() => openUser(user.id)}>
 *         <Table.Cell>{user.name}</Table.Cell>
 *         <Table.Cell>{user.role}</Table.Cell>
 *         <Table.Cell className="text-right">{user.lastSeen}</Table.Cell>
 *       </Table.Row>
 *     ))}
 *   </Table.Body>
 * </Table>
 * ```
 */
export const Table = Object.assign(TableRoot, { Header, Body, Row, HeaderCell, Cell })
