'use client'

import { Tooltip as Base } from '@base-ui-components/react/tooltip'
import type { ReactElement, ReactNode } from 'react'
import { tooltipStyles } from './tooltip.styles'

/** Props for `Tooltip`; it wraps a single trigger element rather than extending a native tag. */
export interface TooltipProps {
  /**
   * Exactly one focusable element (e.g. a `Button`). Base UI merges hover/focus handlers,
   * `aria-describedby` and its `ref` onto it, so the element must forward `ref` and spread
   * unknown props.
   */
  children: ReactElement
  /** The tooltip body; keep it short, non-interactive and supplementary to a visible label. */
  content: ReactNode
  /**
   * Which side of the trigger the popup prefers; Base UI flips it when there is no room.
   * @default 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popup along the chosen side.
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Gap in px between the trigger and the popup.
   * @default 8
   */
  sideOffset?: number
  /**
   * Hover delay in ms before the popup opens. Undefined uses Base UI's default (600 ms);
   * keyboard focus opens instantly regardless.
   */
  delay?: number
  /** Controlled open state; pair with `onOpenChange`. Omit for hover/focus-driven behavior. */
  open?: boolean
  /**
   * Whether the tooltip starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /** Fires with the next open state on hover/focus enter, pointer/focus leave and `Escape`. */
  onOpenChange?: (open: boolean) => void
}

/**
 * A hover/focus tooltip that shows short supplementary text next to its trigger.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Tooltip. The server renders
 *   only the trigger; the popup is portalled to `document.body` on the client and renders
 *   nothing while closed.
 * - Accessibility: the popup becomes the trigger's `aria-describedby`; it opens on hover AND
 *   keyboard focus and closes on pointer leave, blur or `Escape`. It is a description, not a
 *   name: never rely on it as the only label, and don't put interactive content inside.
 * - Stacking: the positioner sits at `--sk-z-tooltip` (80), the top of the scale, so it clears
 *   dialogs (50), popovers (60) and toasts (70).
 * - Not `forwardRef`: the `ref` belongs on the trigger element you pass as `children`.
 * - Placement is done by `side`/`align`/`sideOffset` on the positioner, not by classes;
 *   there is no arrow in v1.
 *
 * @example
 * ```tsx
 * import { Button, Tooltip } from 'sukuna-ui'
 *
 * <Tooltip content="Save (Ctrl+S)" side="bottom" delay={300}>
 *   <Button variant="ghost" aria-label="Save">
 *     <SaveIcon />
 *   </Button>
 * </Tooltip>
 * ```
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
