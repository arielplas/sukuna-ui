import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { type StepperStyleProps, stepperStyles } from './stepper.styles'

/** One step in the sequence, as passed in {@link StepperProps.steps}. */
export interface Step {
  /** Short title of the step (e.g. 'Payment'); rendered next to the numbered indicator. */
  label: ReactNode
  /** Optional one-line hint rendered under the label in smaller, dimmer text. */
  description?: ReactNode
}

/**
 * Props for {@link Stepper}: every native `<ol>` attribute except `children`, plus the
 * `orientation` style variant.
 */
export interface StepperProps
  extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'>,
    StepperStyleProps {
  /** Steps in order; the indicator shows each one's 1-based position. */
  steps: Step[]
  /**
   * 0-based index of the current step. Steps before it are completed (check icon), steps after
   * it are upcoming. Pass `steps.length` to mark every step completed.
   */
  activeStep: number
}

const CheckIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Shows progress through an ordered sequence of steps (completed, current, upcoming).
 *
 * @remarks
 * - SSR/RSC: static (no `'use client'`); display-only with no state or DOM access, so it works
 *   in React Server Components.
 * - Accessibility: an `<ol aria-label="Progress">` (override via `aria-label`) of `<li>`s; the
 *   current step carries `aria-current="step"`. State is conveyed by more than color: completed
 *   steps show a check icon, others their number, and current/completed labels are brighter.
 *   Connectors are `aria-hidden`.
 * - Variants: `orientation`: 'horizontal' (default, steps in a row joined by connector lines) |
 *   'vertical' (stacked column, connectors hidden). Ref → the `<ol>`.
 * - Behaviour: display-only — steps are not clickable. Drive `activeStep` (0-based) from your own
 *   state and render your own Back/Next controls. `className` is merged with the list styles.
 *
 * @example
 * ```tsx
 * import { Stepper } from 'sukuna-ui'
 *
 * const steps = [
 *   { label: 'Account', description: 'Email and password' },
 *   { label: 'Payment', description: 'Card details' },
 *   { label: 'Confirm' },
 * ]
 *
 * // Step 1 ('Account') is completed, 'Payment' is current, 'Confirm' is upcoming.
 * <Stepper steps={steps} activeStep={1} aria-label="Checkout progress" />
 *
 * <Stepper steps={steps} activeStep={2} orientation="vertical" />
 * ```
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, activeStep, orientation, 'aria-label': ariaLabel = 'Progress', className, ...rest },
  ref,
) {
  const styles = stepperStyles({ orientation })
  return (
    <ol ref={ref} aria-label={ariaLabel} className={cn(styles.list(), className)} {...rest}>
      {steps.map((step, index) => {
        const completed = index < activeStep
        const current = index === activeStep
        const last = index === steps.length - 1
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: steps are a fixed, ordered sequence
          <li key={index} className={styles.step()} aria-current={current ? 'step' : undefined}>
            <span
              className={cn(
                styles.indicator(),
                completed
                  ? 'bg-accent text-text border-transparent'
                  : current
                    ? 'border-accent text-accent'
                    : 'border-line text-text-faint',
              )}
            >
              {completed ? <CheckIcon /> : index + 1}
            </span>
            <span className={styles.body()}>
              <span
                className={cn(styles.label(), current || completed ? 'text-text' : 'text-text-dim')}
              >
                {step.label}
              </span>
              {step.description ? (
                <span className={styles.description()}>{step.description}</span>
              ) : null}
            </span>
            {last ? null : (
              <span
                aria-hidden="true"
                className={cn(styles.connector(), completed ? 'bg-accent' : 'bg-line')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
})
