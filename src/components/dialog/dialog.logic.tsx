'use client'

import { Dialog as Base } from '@base-ui-components/react/dialog'
import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { dialogStyles } from './dialog.styles'

const styles = dialogStyles()

/** Props for the `Dialog` root; the compound parts go in `children`. */
export interface DialogProps {
  /** The compound parts: a `Dialog.Trigger` and a `Dialog.Content` (plus anything else). */
  children: ReactNode
  /** Controlled open state; pair with `onOpenChange`. Omit to let the dialog manage itself. */
  open?: boolean
  /**
   * Whether the dialog starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Fires when the open state should change (trigger click, `Escape`, outside click, or a
   * `Dialog.Close`) with the requested next state.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * `true` traps focus, locks page scroll and blocks outside pointer events; `false` leaves the
   * page fully interactive; `'trap-focus'` traps focus but keeps scroll and outside clicks.
   * @default true
   */
  modal?: boolean | 'trap-focus'
}

/** The state-holding root (Base UI `Dialog.Root`). Exported as `Dialog`; see that doc block. */
function DialogRoot({ children, open, defaultOpen, onOpenChange, modal }: DialogProps) {
  return (
    <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </Base.Root>
  )
}

/**
 * Opens the dialog. Pass exactly one element (e.g. a `Button`); Base UI merges the trigger's
 * `onClick`, `aria-haspopup`/`aria-expanded` and `ref` onto it instead of adding a wrapper.
 */
function DialogTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

/**
 * The backdrop plus the centered popup, portalled to `document.body`. Put `Dialog.Title`,
 * `Dialog.Description` and the body inside; `className` and other `div` props go on the popup.
 */
function DialogContent({ className, children, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return (
    <Base.Portal>
      <Base.Backdrop className={styles.backdrop()} />
      <Base.Popup className={styles.popup({ className })} {...rest}>
        {children}
      </Base.Popup>
    </Base.Portal>
  )
}

/** The accessible name of the dialog, rendered as an `<h2>` and linked via `aria-labelledby`. */
function DialogTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={styles.title({ className })} {...rest} />
}

/** Supporting text, rendered as a `<p>` and linked via `aria-describedby`. */
function DialogDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/**
 * A ghost-styled `<button>` that closes the dialog on click. Accepts Base UI `Close` props,
 * so pass `render={<a />}` (or any element) to swap the underlying element.
 */
function DialogClose({
  className,
  ...rest
}: Omit<ComponentProps<typeof Base.Close>, 'className'> & { className?: string }) {
  return <Base.Close className={styles.close({ className })} {...rest} />
}

/** Props of `Dialog.Title`: native `h2` attributes (`className` merges with the slot class). */
export type DialogTitleProps = ComponentPropsWithoutRef<'h2'>
/** Props of `Dialog.Content`: native `div` attributes applied to the popup, not the backdrop. */
export type DialogContentProps = ComponentPropsWithoutRef<'div'>

/**
 * A modal dialog that opens from a trigger and renders a backdrop plus a centered popup.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Dialog. The server renders
 *   only the trigger; `Dialog.Content` is portalled to `document.body` on the client and
 *   renders nothing while closed (unless `open`/`defaultOpen` is set).
 * - Accessibility: the popup is `role="dialog"` with `aria-modal`; `Dialog.Title` and
 *   `Dialog.Description` wire `aria-labelledby`/`aria-describedby` automatically. Focus moves
 *   into the popup on open, is trapped while open (see `modal`), and returns to the trigger on
 *   close. `Escape` and outside-click dismiss.
 * - Stacking: backdrop and popup sit at `--sk-z-dialog` (50), below popover (60), toast (70)
 *   and tooltip (80), so a Select/Menu/Tooltip inside a Dialog renders above it.
 * - Parts: `Dialog` (state, takes `DialogProps`) · `Dialog.Trigger` (wraps ONE element,
 *   merging trigger props onto it) · `Dialog.Content` (backdrop + popup; `DialogContentProps`) ·
 *   `Dialog.Title` (`h2`; `DialogTitleProps`) · `Dialog.Description` (`p`) · `Dialog.Close`
 *   (a `button` that closes; Base UI `render` prop for a custom element).
 * - No visual variants; override with `className` on any part.
 *
 * @example
 * ```tsx
 * import { Button, Dialog } from 'sukuna-ui'
 *
 * <Dialog onOpenChange={(open) => console.log(open)}>
 *   <Dialog.Trigger>
 *     <Button variant="secondary">Delete project</Button>
 *   </Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Delete project?</Dialog.Title>
 *     <Dialog.Description>This can't be undone.</Dialog.Description>
 *     <div className="mt-4 flex justify-end gap-2">
 *       <Dialog.Close>Cancel</Dialog.Close>
 *       <Button onClick={remove}>Delete</Button>
 *     </div>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
})
