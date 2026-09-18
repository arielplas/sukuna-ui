'use client'

import { Dialog as Base } from '@base-ui-components/react/dialog'
import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { drawerStyles } from './drawer.styles'

const base = drawerStyles()

/** Props for the `Drawer` root; the compound parts go in `children`. */
export interface DrawerProps {
  /** The compound parts: a `Drawer.Trigger` and a `Drawer.Content` (plus anything else). */
  children: ReactNode
  /** Controlled open state; pair with `onOpenChange`. Omit to let the drawer manage itself. */
  open?: boolean
  /**
   * Whether the drawer starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Fires when the open state should change (trigger click, `Escape`, outside click, or a
   * `Drawer.Close`) with the requested next state.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * `true` traps focus, locks page scroll and blocks outside pointer events; `false` leaves the
   * page fully interactive; `'trap-focus'` traps focus but keeps scroll and outside clicks.
   * @default true
   */
  modal?: boolean | 'trap-focus'
}

/** The state-holding root (Base UI `Dialog.Root`). Exported as `Drawer`; see that doc block. */
function DrawerRoot({ children, open, defaultOpen, onOpenChange, modal }: DrawerProps) {
  return (
    <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </Base.Root>
  )
}

/**
 * Opens the drawer. Pass exactly one element (e.g. a `Button`); Base UI merges the trigger's
 * `onClick`, `aria-haspopup`/`aria-expanded` and `ref` onto it instead of adding a wrapper.
 */
function DrawerTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

/** Props of `Drawer.Content`: native `div` attributes for the panel plus the anchoring edge. */
export interface DrawerContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * The edge the panel is anchored to and slides in from. `left`/`right` panels are full
   * height and `w-80` (max 90vw); `top`/`bottom` panels are full width and `h-64`.
   * @default 'right'
   */
  side?: 'left' | 'right' | 'top' | 'bottom'
}

/**
 * The backdrop plus the side-anchored panel, portalled to `document.body`. Put `Drawer.Title`,
 * `Drawer.Description`, `Drawer.Close` and the body inside; `className` lands on the panel.
 */
function DrawerContent({ side = 'right', className, children, ...rest }: DrawerContentProps) {
  const styles = drawerStyles({ side })
  return (
    <Base.Portal>
      <Base.Backdrop className={styles.backdrop()} />
      <Base.Popup className={styles.popup({ className })} {...rest}>
        {children}
      </Base.Popup>
    </Base.Portal>
  )
}

/** The accessible name of the drawer, rendered as an `<h2>` and linked via `aria-labelledby`. */
function DrawerTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={base.title({ className })} {...rest} />
}
/** Supporting text, rendered as a `<p>` and linked via `aria-describedby`. */
function DrawerDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={base.description({ className })} {...rest} />
}
/**
 * A `<button>` pinned to the panel's top-right corner that closes the drawer. Give it an
 * icon plus `aria-label`, or text; pass Base UI's `render` prop to swap the element.
 */
function DrawerClose({
  className,
  ...rest
}: Omit<ComponentProps<typeof Base.Close>, 'className'> & { className?: string }) {
  return <Base.Close className={base.close({ className })} {...rest} />
}

/**
 * A panel that slides in from a screen edge over a backdrop, for navigation, filters or details.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Dialog. The server renders
 *   only the trigger; `Drawer.Content` is portalled to `document.body` on the client and
 *   renders nothing while closed (unless `open`/`defaultOpen` is set).
 * - Accessibility: the panel is `role="dialog"` with `aria-modal`; `Drawer.Title` and
 *   `Drawer.Description` wire `aria-labelledby`/`aria-describedby`. Focus moves into the panel
 *   on open, is trapped while open (see `modal`), and returns to the trigger on close.
 *   `Escape` and outside-click dismiss; page scroll is locked while modal.
 * - Stacking: backdrop and panel sit at `--sk-z-dialog` (50), below popover (60), toast (70)
 *   and tooltip (80), so a Select/Menu/Tooltip inside a Drawer renders above it.
 * - Parts: `Drawer` (state, takes `DrawerProps`) · `Drawer.Trigger` (wraps ONE element) ·
 *   `Drawer.Content` (backdrop + panel; `DrawerContentProps` with `side`) · `Drawer.Title`
 *   (`h2`) · `Drawer.Description` (`p`) · `Drawer.Close` (corner `button`).
 * - Variants: only `side` on `Drawer.Content` (`'right'` default, `'left'`, `'top'`,
 *   `'bottom'`); the enter/exit transform follows the chosen edge.
 *
 * @example
 * ```tsx
 * import { Button, Drawer } from 'sukuna-ui'
 *
 * <Drawer>
 *   <Drawer.Trigger>
 *     <Button variant="ghost">Filters</Button>
 *   </Drawer.Trigger>
 *   <Drawer.Content side="left">
 *     <Drawer.Title>Filters</Drawer.Title>
 *     <Drawer.Description>Narrow the results.</Drawer.Description>
 *     <Drawer.Close aria-label="Close">×</Drawer.Close>
 *     <form>…</form>
 *   </Drawer.Content>
 * </Drawer>
 * ```
 */
export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
})
