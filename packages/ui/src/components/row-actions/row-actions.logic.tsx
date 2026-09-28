import { forwardRef } from 'react'
import { Button } from '../button'
import { Menu, type MenuItemOption } from '../menu'
import { rowActionsStyles } from './row-actions.styles'

const styles = rowActionsStyles()

/** Props for {@link RowActions}. */
export interface RowActionsProps {
  /** The actions, in order: `{ label, icon?, onSelect?, disabled?, id? }` (see `MenuItemOption`). */
  items: MenuItemOption[]
  /**
   * Accessible name of the ⋯ button. Name the row ("Actions for invoice #42") so a table of
   * identical buttons stays distinguishable to screen-reader users.
   * @default 'Row actions'
   */
  'aria-label'?: string
  /**
   * Trigger size: `sm` = 32px square (fits a 44px table row), `md` = 40px.
   * @default 'sm'
   */
  size?: 'sm' | 'md'
  /**
   * Menu alignment along the trigger. `end` opens inward from a right-edge column.
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Side of the trigger the menu opens on (flips when out of room).
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Disables the trigger.
   * @default false
   */
  disabled?: boolean
  /** Extra classes for the trigger button, merged last. */
  className?: string
}

const Ellipsis = ({ className }: { className: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
)

/**
 * A "⋯" icon button that opens a menu of actions for one item — the cell content of a Table
 * actions column (`Table.ActionsCell`) or the corner of a card.
 *
 * @remarks
 * - SSR/RSC: no hooks of its own, so no `'use client'`; the client boundary is `Menu` (Base UI),
 *   which it renders. The server renders just the trigger button. `items` carry `onSelect`
 *   callbacks, so build them in a client component. Kept separate from `Table` so tables without
 *   row actions stay zero-JS.
 * - Accessibility: a native `<button>` (ghost, square) with `aria-haspopup="menu"` and
 *   `aria-expanded`; items are `role="menuitem"` with arrow-key / Enter / Escape handling and focus
 *   returns to the trigger. Item `icon`s are `aria-hidden` — the `label` is the name. Always pass a
 *   row-specific `aria-label`.
 * - Items take `MenuItemOption`, so `icon` / `disabled` / `id` work exactly as in `Menu`.
 * - The ref points at the trigger `<button>`.
 *
 * @example
 * ```tsx
 * import { RowActions, Table } from 'sukuna-ui'
 *
 * <Table.ActionsCell>
 *   <RowActions
 *     aria-label={`Actions for ${invoice.number}`}
 *     items={[
 *       { label: 'Edit', icon: <PencilIcon />, onSelect: () => edit(invoice.id) },
 *       { label: 'Duplicate', icon: <CopyIcon />, onSelect: () => duplicate(invoice.id) },
 *       { label: 'Delete', icon: <TrashIcon />, onSelect: () => remove(invoice.id) },
 *     ]}
 *   />
 * </Table.ActionsCell>
 * ```
 */
export const RowActions = forwardRef<HTMLButtonElement, RowActionsProps>(function RowActions(
  {
    items,
    'aria-label': ariaLabel = 'Row actions',
    size = 'sm',
    align = 'end',
    side = 'bottom',
    disabled,
    className,
  },
  ref,
) {
  return (
    <Menu items={items} align={align} side={side}>
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        iconOnly
        aria-label={ariaLabel}
        disabled={disabled}
        className={className}
        leadingIcon={<Ellipsis className={styles.icon()} />}
      />
    </Menu>
  )
})
