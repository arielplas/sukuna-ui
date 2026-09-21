'use client'

import { PreviewCard as Base } from '@base-ui-components/react/preview-card'
import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { hoverCardStyles } from './hover-card.styles'

const styles = hoverCardStyles()

/** Props for the `HoverCard` root; the compound parts go in `children`. */
export interface HoverCardProps {
  /** The compound parts: a `HoverCard.Trigger` and a `HoverCard.Content`. */
  children: ReactNode
  /** Controlled open state; pair with `onOpenChange`. */
  open?: boolean
  /**
   * Whether the card starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /** Fires when the open state should change (hover, focus, `Escape`, outside press). */
  onOpenChange?: (open: boolean) => void
}

/** The state-holding root (Base UI `PreviewCard.Root`). Exported as `HoverCard`; see that doc. */
function HoverCardRoot({ children, open, defaultOpen, onOpenChange }: HoverCardProps) {
  return (
    <Base.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </Base.Root>
  )
}

/** Props of `HoverCard.Trigger`: Base UI trigger props (renders an `<a>`) incl. `delay`/`closeDelay`. */
export type HoverCardTriggerProps = Omit<ComponentProps<typeof Base.Trigger>, 'className'> & {
  className?: string
}

/**
 * The element that reveals the card on hover/focus. Renders an `<a>` by default (pass `href`); use
 * the Base UI `render` prop to swap the element. `delay`/`closeDelay` (ms) tune the open/close
 * timing (defaults 300 / 300); pass either to override.
 */
function HoverCardTrigger({ delay = 300, className, ...rest }: HoverCardTriggerProps) {
  return <Base.Trigger delay={delay} className={styles.trigger({ className })} {...rest} />
}

/** Props of `HoverCard.Content`: placement props plus native `div` attributes for the popup. */
export interface HoverCardContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Preferred side of the trigger (flips when out of room).
   * @default 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment along the chosen side.
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Gap in pixels between trigger and card.
   * @default 8
   */
  sideOffset?: number
}

/** The portalled, positioned card. Put rich content (incl. links) inside; `className` styles the popup. */
function HoverCardContent({
  side = 'top',
  align = 'center',
  sideOffset = 8,
  className,
  children,
  ...rest
}: HoverCardContentProps) {
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

/**
 * A rich floating card shown when a link (or element) is hovered or keyboard-focused — a user
 * card, repo summary, or footnote preview. For a short text label use `Tooltip`; for a
 * click-triggered panel use a menu/dialog (a public `Popover` is out of scope for now).
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Preview Card. The server renders
 *   only the trigger; `HoverCard.Content` is portalled to `document.body` and absent while closed
 *   (unless `open`/`defaultOpen`).
 * - Accessibility: opens on pointer hover **and** keyboard focus of the trigger; closes on blur,
 *   mouse-leave, `Escape` or outside press. Unlike `Tooltip` the content is reachable by assistive
 *   tech (not `role="tooltip"`) and stays open while focus is inside it — so it may hold links —
 *   but must never be the only source of critical information.
 * - Motion: `prefers-reduced-motion` collapses the enter/exit transition.
 * - Stacking: the positioner sits at `--sk-z-popover` (60), above the dialog layer.
 * - Parts: `HoverCard` (state, `HoverCardProps`) · `HoverCard.Trigger` (an `<a>`; `delay`/
 *   `closeDelay`) · `HoverCard.Content` (`side`/`align`/`sideOffset` + `div` props).
 * - No visual variants; override with `className` on the content.
 *
 * @example
 * ```tsx
 * import { HoverCard } from 'sukuna-ui'
 *
 * <HoverCard>
 *   <HoverCard.Trigger href="/users/sukuna">@sukuna</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <div className="font-display font-bold">Ryomen Sukuna</div>
 *     <p className="text-text-dim">King of Curses · 1,000 fingers</p>
 *   </HoverCard.Content>
 * </HoverCard>
 * ```
 */
export const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
})
