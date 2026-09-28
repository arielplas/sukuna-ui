'use client'

import { AlertDialog as Base } from '@base-ui/react/alert-dialog'
import type { ComponentPropsWithoutRef, MouseEvent, ReactElement, ReactNode } from 'react'
import { Button, type ButtonProps } from '../button'
import { alertDialogStyles } from './alert-dialog.styles'

const styles = alertDialogStyles()

/** Props for the `AlertDialog` root; the compound parts go in `children`. */
export interface AlertDialogProps {
  /** The compound parts: an `AlertDialog.Trigger` and an `AlertDialog.Content`. */
  children: ReactNode
  /** Controlled open state; pair with `onOpenChange`. */
  open?: boolean
  /**
   * Whether the dialog starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /** Fires when the open state should change (trigger, `Escape`, `Cancel` or `Action`). */
  onOpenChange?: (open: boolean) => void
}

/**
 * What `AlertDialog.Action` / `Cancel` accept: native `<button>` attributes plus the `Button`
 * extras (`size`, `loading`, icons). The label is required — these buttons are never icon-only.
 */
export interface AlertDialogButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color' | 'children'>,
    Pick<ButtonProps, 'size' | 'loading' | 'leadingIcon' | 'trailingIcon' | 'fullWidth'> {
  /** The visible label. */
  children: ReactNode
}

/** The state-holding root (Base UI `AlertDialog.Root`). Exported as `AlertDialog`; see that doc. */
function AlertDialogRoot({ children, open, defaultOpen, onOpenChange }: AlertDialogProps) {
  return (
    <Base.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      {children}
    </Base.Root>
  )
}

/** Opens the alert dialog. Pass exactly one element (e.g. a `Button`); props merge onto it. */
function AlertDialogTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

/** The backdrop plus the centered `role="alertdialog"` popup, portalled to `document.body`. */
function AlertDialogContent({ className, children, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return (
    <Base.Portal>
      <Base.Backdrop className={styles.backdrop()} />
      <Base.Popup className={styles.popup({ className })} {...rest}>
        {children}
      </Base.Popup>
    </Base.Portal>
  )
}

/** The question being asked, rendered as an `<h2>` and linked via `aria-labelledby`. */
function AlertDialogTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={styles.title({ className })} {...rest} />
}

/** The consequence, rendered as a `<p>` and linked via `aria-describedby`. */
function AlertDialogDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/** Right-aligned button row. Put `Cancel` first (it receives initial focus), then `Action`. */
function AlertDialogFooter({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={styles.footer({ className })} {...rest} />
}

/** A ghost `Button` that closes without acting — the safe choice. */
function AlertDialogCancel(props: AlertDialogButtonProps) {
  return <Base.Close render={<Button variant="ghost" {...props} />} />
}

/**
 * The primary `Button` that confirms. Runs `onClick`, then closes — unless `onClick` calls
 * `event.preventDefault()` (e.g. keep it open with `loading` while an async delete runs).
 */
function AlertDialogAction({ onClick, ...rest }: AlertDialogButtonProps) {
  return (
    <Base.Close
      render={<Button variant="primary" {...rest} />}
      onClick={(event) => {
        onClick?.(event as MouseEvent<HTMLButtonElement>)
        // Map the standard preventDefault() onto Base UI's "skip the close handler" switch.
        if (event.defaultPrevented) event.preventBaseUIHandler()
      }}
    />
  )
}

/**
 * A modal that interrupts to confirm a consequential action ("Delete project?"). Unlike `Dialog`,
 * it never closes on an outside click — the user has to choose.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI AlertDialog. The server renders
 *   only the trigger; the content is portalled to `document.body` while open.
 * - Accessibility: the popup is `role="alertdialog"` with `aria-modal`, named by
 *   `AlertDialog.Title` and described by `AlertDialog.Description`. Focus is trapped and returns
 *   to the trigger on close. `Escape` and `Cancel` dismiss; an outside press does not.
 * - `Action` is the primary crimson `Button` (Sukuna has one red — there is no `danger` look);
 *   `Cancel` is a ghost `Button`. Both accept native-button `Button` props (`loading`, icons…).
 * - Stacking: backdrop and popup sit at `--sk-z-dialog` (50), like Dialog.
 * - Parts: `AlertDialog` (state) · `.Trigger` (wraps ONE element) · `.Content` · `.Title` (`h2`) ·
 *   `.Description` (`p`) · `.Footer` · `.Cancel` · `.Action`.
 *
 * @example
 * ```tsx
 * import { AlertDialog, Button } from 'sukuna-ui'
 *
 * <AlertDialog>
 *   <AlertDialog.Trigger>
 *     <Button variant="secondary">Delete project</Button>
 *   </AlertDialog.Trigger>
 *   <AlertDialog.Content>
 *     <AlertDialog.Title>Delete project?</AlertDialog.Title>
 *     <AlertDialog.Description>This permanently deletes every file. It can't be undone.</AlertDialog.Description>
 *     <AlertDialog.Footer>
 *       <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
 *       <AlertDialog.Action onClick={deleteProject}>Delete</AlertDialog.Action>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog>
 * ```
 */
export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Footer: AlertDialogFooter,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
})
