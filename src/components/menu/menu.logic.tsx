'use client'

import { Menu as Base } from '@base-ui-components/react/menu'
import type { ReactElement, ReactNode } from 'react'
import { menuStyles } from './menu.styles'

/** One action row in a {@link Menu}'s `items` array. */
export interface MenuItemOption {
  /** Visible content of the row (text, or text plus an icon). Also its accessible name if text. */
  label: ReactNode
  /** Fires when the item is activated by click, `Enter` or `Space`; the menu then closes. */
  onSelect?: () => void
  /**
   * Renders the row dimmed and non-activatable; keyboard navigation skips it.
   * @default false
   */
  disabled?: boolean
  /**
   * Stable key. Provide for dynamic menus (filtered/reordered) so React keeps item state
   * correct; static menus may omit it and fall back to the array index.
   */
  id?: string
}

/** Props for {@link Menu}. There are no style variants. */
export interface MenuProps {
  /**
   * Exactly one element used as the trigger, typically a `Button`. It must forward its ref and
   * spread unknown props onto a DOM node, because Base UI injects `aria-haspopup`,
   * `aria-expanded` and the click/keyboard handlers into it.
   */
  children: ReactElement
  /** Action rows to render, in order. Keyed by `id` when set, else by array index. */
  items: MenuItemOption[]
  /**
   * Which side of the trigger the popup opens on (flips automatically when out of space).
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popup along the chosen side.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Gap in pixels between the trigger and the popup.
   * @default 6
   */
  sideOffset?: number
}

/**
 * Dropdown menu of actions opened from a single trigger element. Use it for "more actions" style
 * lists that run a callback per row; for choosing a value use `Select`.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because open state, positioning and roving
 *   focus come from Base UI hooks. The trigger server-renders; the popup does not exist in the
 *   DOM until opened.
 * - Accessibility: the trigger receives `aria-haspopup="menu"` and `aria-expanded`; the popup is
 *   `role="menu"` with `role="menuitem"` rows. Opening focuses the first item;
 *   `ArrowUp`/`ArrowDown` move (typeahead jumps by label text), `Enter`/`Space` activate,
 *   `Escape` or an outside click closes and returns focus to the trigger. A trigger with no
 *   visible text needs its own `aria-label` (e.g. an icon-only `Button`).
 * - Variants: none. Positioning is tuned with `side`, `align` and `sideOffset`.
 * - Behaviour: open state is uncontrolled and internal. Rows are activated via `onSelect`; the
 *   menu always closes after activation. No separators, submenus or checkbox items in v1.
 * - Gotchas: `Menu` does not take a `ref`; put the ref on the trigger child. When `items` are
 *   filtered or reordered at runtime, give each a stable `id` so React does not carry highlight
 *   state across rows.
 *
 * @example
 * ```tsx
 * import { Button, Menu } from 'sukuna-ui'
 *
 * <Menu
 *   items={[
 *     { id: 'rename', label: 'Rename', onSelect: () => console.log('rename') },
 *     { id: 'duplicate', label: 'Duplicate', onSelect: () => console.log('duplicate') },
 *     { id: 'delete', label: 'Delete', onSelect: () => console.log('delete'), disabled: true },
 *   ]}
 * >
 *   <Button variant="secondary">Actions</Button>
 * </Menu>
 * ```
 *
 * @example
 * ```tsx
 * import { Button, Menu } from 'sukuna-ui'
 *
 * <Menu
 *   side="right"
 *   align="center"
 *   sideOffset={8}
 *   items={[{ label: 'Sign out', onSelect: () => signOut() }]}
 * >
 *   <Button variant="ghost" aria-label="Account menu">…</Button>
 * </Menu>
 * ```
 */
export function Menu({
  children,
  items,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
}: MenuProps) {
  const styles = menuStyles()
  return (
    <Base.Root>
      <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
      <Base.Portal>
        <Base.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={styles.positioner()}
        >
          <Base.Popup className={styles.popup()}>
            {items.map((item, index) => (
              <Base.Item
                // Prefer a stable `id`; index is the documented fallback for static menus.
                key={item.id ?? index}
                disabled={item.disabled}
                onClick={item.onSelect}
                className={styles.item()}
              >
                {item.label}
              </Base.Item>
            ))}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
