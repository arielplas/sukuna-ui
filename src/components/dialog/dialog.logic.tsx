'use client'

import { Dialog as Base } from '@base-ui-components/react/dialog'
import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { dialogStyles } from './dialog.styles'

const styles = dialogStyles()

export interface DialogProps {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Modal by default; `false` allows interaction outside, `'trap-focus'` traps focus only. */
  modal?: boolean | 'trap-focus'
}

/** Dialog root. Behavior (focus trap, scroll lock, dismiss) from Base UI. `'use client'`. */
function DialogRoot({ children, open, defaultOpen, onOpenChange, modal }: DialogProps) {
  return (
    <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </Base.Root>
  )
}

/** Opens the dialog. Pass a single element (e.g. a Button); Base UI merges trigger props onto it. */
function DialogTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

/** Backdrop + centered popup, portalled to `document.body`. Put Title/Description/content inside. */
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

function DialogTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={styles.title({ className })} {...rest} />
}

function DialogDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={styles.description({ className })} {...rest} />
}

/** A button that closes the dialog. Renders a `<button>`; pass `render` for a custom element. */
function DialogClose({
  className,
  ...rest
}: Omit<ComponentProps<typeof Base.Close>, 'className'> & { className?: string }) {
  return <Base.Close className={styles.close({ className })} {...rest} />
}

export type DialogTitleProps = ComponentPropsWithoutRef<'h2'>
export type DialogContentProps = ComponentPropsWithoutRef<'div'>

/** Compound: `Dialog` + `Dialog.Trigger/Content/Title/Description/Close`. */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
})
