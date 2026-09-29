'use client'

import { Popover as Base } from '@base-ui/react/popover'
import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { popoverStyles } from './popover.styles'

const styles = popoverStyles()

/** Props for the `Popover` root; the compound parts go in `children`. */
export interface PopoverProps {
  /** The compound parts: a `Popover.Trigger` and a `Popover.Content`. */
  children: ReactNode
  /** Controlled open state; pair with `onOpenChange`. Omit to let the popover manage itself. */
  open?: boolean
  /**
   * Whether the popover starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /** Fires when the open state should change (trigger click, `Escape`, outside press, `Close`). */
  onOpenChange?: (open: boolean) => void
  /**
   * `false` keeps the page interactive and scrollable; `true` traps focus, locks scroll and blocks
   * outside pointer events; `'trap-focus'` traps focus only.
   * @default false
   */
  modal?: boolean | 'trap-focus'
}

/** The state-holding root (Base UI `Popover.Root`). Exported as `Popover`; see that doc block. */
function PopoverRoot({ children, open, defaultOpen, onOpenChange, modal = false }: PopoverProps) {
  return (
    <Base.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      modal={modal}
    >
      {children}
    </Base.Root>
  )
}

/**
 * Opens the popover on click. Pass exactly one element (e.g. a `Button`); Base UI merges the
 * trigger's `onClick`, `aria-expanded`/`aria-haspopup` and `ref` onto it instead of adding a wrapper.
 */
function PopoverTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

/** Props of `Popover.Content`: placement props plus native `div` attributes for the popup. */
export interface PopoverContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Preferred side of the trigger (flips when out of room).
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment along the chosen side.
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Gap in pixels between trigger and popup.
   * @default 8
   */
  sideOffset?: number
}

/** The portalled, positioned panel. Put the title, controls and a `Popover.Close` inside. */
function PopoverContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  className,
  children,
  ...rest
}: PopoverContentProps) {
  return (
    <Base.Portal>
      <Base.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={styles.positioner()}
      >
        <Base.Popup className={styles.popup({ className })} {...rest}>
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  )
}

/** The accessible name of the popup, rendered as an `<h2>` and linked via `aria-labelledby`. */
function PopoverTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={styles.title({ className })} {...rest} />
}

/** Supporting text, rendered as a `<p>` and linked via `aria-describedby`. */
function PopoverDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/** A ghost-styled `<button>` that closes the popover. Base UI `render` swaps the element. */
function PopoverClose({
  className,
  ...rest
}: Omit<ComponentProps<typeof Base.Close>, 'className'> & { className?: string }) {
  return <Base.Close className={styles.close({ className })} {...rest} />
}

/**
 * A click-opened floating panel anchored to its trigger — for filters, quick settings or a share
 * box. Non-modal by default: the rest of the page stays usable.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Popover. The server renders only
 *   the trigger; `Popover.Content` is portalled to `document.body` and renders nothing while closed.
 * - Accessibility: the trigger gets `aria-expanded`/`aria-haspopup`, the popup is `role="dialog"`
 *   named by `Popover.Title` (`aria-labelledby`) and described by `Popover.Description`. Focus
 *   moves into the popup on open and returns to the trigger on close; `Escape` and an outside
 *   press close it.
 * - Versus Tooltip/HoverCard: those open on hover and hold read-only content. Use Popover when the
 *   panel has controls or opens on click. Use Dialog when the user must deal with it first.
 * - Stacking: the positioner sits at `--sk-z-popover` (60), above a Dialog (50).
 * - Parts: `Popover` (state; `PopoverProps`) · `Popover.Trigger` (wraps ONE element) ·
 *   `Popover.Content` (`PopoverContentProps`: `side` 'bottom', `align` 'center', `sideOffset` 8) ·
 *   `Popover.Title` (`h2`) · `Popover.Description` (`p`) · `Popover.Close` (ghost `button`).
 *
 * @example
 * ```tsx
 * import { Button, Input, Popover } from '@sukunagg/ui'
 *
 * <Popover>
 *   <Popover.Trigger>
 *     <Button variant="secondary">Share</Button>
 *   </Popover.Trigger>
 *   <Popover.Content align="end">
 *     <Popover.Title>Share link</Popover.Title>
 *     <Popover.Description>Anyone with the link can view.</Popover.Description>
 *     <Input className="mt-3" readOnly value="https://sukuna.dev/p/42" aria-label="Link" />
 *     <Popover.Close className="mt-3">Done</Popover.Close>
 *   </Popover.Content>
 * </Popover>
 * ```
 */
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
})
