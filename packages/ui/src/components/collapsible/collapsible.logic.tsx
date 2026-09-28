'use client'

import { Collapsible as Base } from '@base-ui/react/collapsible'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { collapsibleStyles } from './collapsible.styles'

const styles = collapsibleStyles()

/** Props for the `Collapsible` root: a `<div>` plus the open state. */
export interface CollapsibleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Controlled open state; pair with `onOpenChange`. */
  open?: boolean
  /**
   * Whether the panel starts open in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean
  /** Fires with the next open state when the trigger is activated. */
  onOpenChange?: (open: boolean) => void
  /**
   * Blocks toggling and dims the trigger.
   * @default false
   */
  disabled?: boolean
}

/** Props for `Collapsible.Trigger`: a native `<button>` plus `hideIcon`. */
export interface CollapsibleTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /**
   * Drop the rotating chevron (e.g. when the label carries its own affordance).
   * @default false
   */
  hideIcon?: boolean
}

/** Props for `Collapsible.Content`: the panel `<div>` plus `keepMounted`. */
export interface CollapsibleContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Keep the panel in the DOM (hidden) while closed, e.g. so find-in-page can reach it.
   * @default false
   */
  keepMounted?: boolean
}

const Chevron = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open, defaultOpen, onOpenChange, disabled, className, ...rest },
  ref,
) {
  return (
    <Base.Root
      ref={ref}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      disabled={disabled}
      className={styles.root({ className })}
      {...rest}
    />
  )
})

/** The `<button>` that toggles the panel; renders its children followed by a chevron. */
const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ hideIcon = false, className, children, ...rest }, ref) {
    return (
      <Base.Trigger ref={ref} className={styles.trigger({ className })} {...rest}>
        {children}
        {hideIcon ? null : <Chevron className={styles.icon()} />}
      </Base.Trigger>
    )
  },
)

/** The panel that shows and hides, with an animated height. */
const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ keepMounted, className, children, ...rest }, ref) {
    return (
      <Base.Panel ref={ref} keepMounted={keepMounted} className={styles.panel()} {...rest}>
        <div className={styles.content({ className })}>{children}</div>
      </Base.Panel>
    )
  },
)

/**
 * A single section that shows and hides — "Show advanced options", "Read more", a sidebar group.
 * For a set of sections use `Accordion`.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Collapsible. Closed content is not
 *   rendered on the server unless `defaultOpen` (or `keepMounted` on `Content`).
 * - Accessibility: `Collapsible.Trigger` is a native `<button>` with `aria-expanded` and
 *   `aria-controls` pointing at the panel; Enter/Space toggle. Hidden content is out of the tab order.
 * - Motion: the panel animates its height (Base UI's `--collapsible-panel-height`); the chevron
 *   rotates. Both are off under `prefers-reduced-motion`.
 * - Parts: `Collapsible` (`div`, state; `CollapsibleProps`) · `Collapsible.Trigger` (`button`;
 *   `hideIcon`) · `Collapsible.Content` (panel; `keepMounted`). `className` on `Content` styles the
 *   inner content box.
 *
 * @example
 * ```tsx
 * import { Collapsible } from 'sukuna-ui'
 *
 * <Collapsible>
 *   <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
 *   <Collapsible.Content>Webhook retries, custom headers and timeouts.</Collapsible.Content>
 * </Collapsible>
 * ```
 */
export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})
