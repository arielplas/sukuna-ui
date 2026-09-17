import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { type StepperStyleProps, stepperStyles } from './stepper.styles'

export interface Step {
  label: ReactNode
  description?: ReactNode
}

export interface StepperProps
  extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'>,
    StepperStyleProps {
  steps: Step[]
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

/** Ordered progress indicator. Static and RSC-safe (no `'use client'`). */
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
