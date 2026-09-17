'use client'

import { Tooltip as Base } from '@base-ui-components/react/tooltip'
import type { ReactElement, ReactNode } from 'react'
import { tooltipStyles } from './tooltip.styles'

export interface TooltipProps {
  /** The trigger element. Base UI merges trigger behavior onto it. */
  children: ReactElement
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  delay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Hover/focus tooltip. Behavior from Base UI; we style the popup. Not `forwardRef` — the ref
 * belongs on the trigger element passed as `children`. `'use client'` (portal + interaction).
 */
export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  delay,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  const styles = tooltipStyles()
  return (
    <Base.Provider delay={delay}>
      <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Base.Trigger render={children as ReactElement<Record<string, unknown>>} />
        <Base.Portal>
          <Base.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={styles.positioner()}
          >
            <Base.Popup className={styles.popup()}>{content}</Base.Popup>
          </Base.Positioner>
        </Base.Portal>
      </Base.Root>
    </Base.Provider>
  )
}
