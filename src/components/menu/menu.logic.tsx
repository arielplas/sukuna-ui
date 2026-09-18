'use client'

import { Menu as Base } from '@base-ui-components/react/menu'
import type { ReactElement, ReactNode } from 'react'
import { menuStyles } from './menu.styles'

export interface MenuItemOption {
  label: ReactNode
  onSelect?: () => void
  disabled?: boolean
  /** Stable key. Provide for dynamic menus (filtered/reordered) so React keeps item state correct. */
  id?: string
}

export interface MenuProps {
  children: ReactElement
  items: MenuItemOption[]
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

/** Dropdown action menu (Base UI). `'use client'`. Ref belongs on the trigger child. */
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
