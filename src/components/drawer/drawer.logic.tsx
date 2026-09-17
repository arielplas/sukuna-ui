'use client'

import { Dialog as Base } from '@base-ui-components/react/dialog'
import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { drawerStyles } from './drawer.styles'

const base = drawerStyles()

export interface DrawerProps {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'
}

/** Side-anchored overlay panel over Base UI Dialog. `'use client'`. */
function DrawerRoot({ children, open, defaultOpen, onOpenChange, modal }: DrawerProps) {
  return (
    <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </Base.Root>
  )
}

function DrawerTrigger({ children }: { children: ReactElement }) {
  return <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
}

export interface DrawerContentProps extends ComponentPropsWithoutRef<'div'> {
  side?: 'left' | 'right' | 'top' | 'bottom'
}

/** Backdrop + side-anchored panel, portalled. */
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

function DrawerTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <Base.Title className={base.title({ className })} {...rest} />
}
function DrawerDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <Base.Description className={base.description({ className })} {...rest} />
}
function DrawerClose({
  className,
  ...rest
}: Omit<ComponentProps<typeof Base.Close>, 'className'> & { className?: string }) {
  return <Base.Close className={base.close({ className })} {...rest} />
}

/** Compound: `Drawer` + `Drawer.Trigger/Content/Title/Description/Close`. */
export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
})
