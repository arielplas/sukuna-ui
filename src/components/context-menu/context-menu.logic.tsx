'use client'

import { ContextMenu as Base } from '@base-ui-components/react/context-menu'
import type { ReactNode } from 'react'
import type { MenuItemOption } from '../menu'
import { contextMenuStyles } from './context-menu.styles'

const styles = contextMenuStyles()

/** Props for {@link ContextMenu}. */
export interface ContextMenuProps {
  /**
   * The content that becomes the right-click / long-press target. Wrapped in a `display: contents`
   * trigger (no layout box of its own) that carries the touch handlers and the iOS long-press
   * fixes, so any markup is fine here.
   */
  children: ReactNode
  /** Action rows to render, in order. Keyed by `id` when set, else by array index. */
  items: MenuItemOption[]
}

/**
 * A right-click (desktop) or long-press (touch) menu of actions over a target area. Shares the
 * `items` shape and popup styling with `Menu`. Use it to enrich a surface with contextual actions;
 * because right-click is not discoverable, always expose the same actions through a visible control
 * (a `Menu` or buttons) as well.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`). The trigger area server-renders; the popup does
 *   not exist in the DOM until opened.
 * - Accessibility: the popup is `role="menu"` with `role="menuitem"` rows. It opens on the
 *   `contextmenu` event, on touch long-press, and from the keyboard (`Shift`+`F10` / the Menu key).
 *   Once open, `ArrowUp`/`ArrowDown` move (typeahead by label), `Enter`/`Space` activate, `Escape`
 *   closes and returns focus. Disabled rows are announced and skipped.
 * - Touch/iOS: `children` are wrapped in a `display: contents` trigger that sets `user-select: none`
 *   and `-webkit-touch-callout: none`, so an iOS long-press opens the menu instead of starting text
 *   selection or the native callout. The wrapper adds no layout box.
 * - Behaviour: open state is internal. Rows run `onSelect`; the menu then closes. No separators,
 *   submenus or checkbox items in v1 (same scope as `Menu`).
 * - Gotchas: `ContextMenu` takes no `ref`. Give dynamic (filtered/reordered) items a stable `id`.
 *
 * @example
 * ```tsx
 * import { ContextMenu } from 'sukuna-ui'
 *
 * <ContextMenu
 *   items={[
 *     { id: 'copy', label: 'Copy', onSelect: () => copy() },
 *     { id: 'rename', label: 'Rename', onSelect: () => rename() },
 *     { id: 'delete', label: 'Delete', onSelect: () => remove(), disabled: true },
 *   ]}
 * >
 *   <div className="grid h-40 place-items-center rounded-md border border-line">
 *     Right-click me
 *   </div>
 * </ContextMenu>
 * ```
 */
export function ContextMenu({ children, items }: ContextMenuProps) {
  return (
    <Base.Root>
      <Base.Trigger className={styles.trigger()}>{children}</Base.Trigger>
      <Base.Portal>
        <Base.Positioner className={styles.positioner()}>
          <Base.Popup className={styles.popup()}>
            {items.map((item, index) => (
              <Base.Item
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
