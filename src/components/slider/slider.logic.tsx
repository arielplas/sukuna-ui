'use client'

import { Slider as Base } from '@base-ui-components/react/slider'
import { sliderStyles } from './slider.styles'

export interface SliderProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

/** Single-value range slider (Base UI). `'use client'`. */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SliderProps) {
  const styles = sliderStyles()
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      // Single-value slider: Base UI only emits a number here. Cast avoids a wrapper (keeping the
      // module free of an untestable handler) while forwarding the consumer's callback directly.
      onValueChange={onValueChange as ((value: number | readonly number[]) => void) | undefined}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={styles.root({ className })}
    >
      <Base.Control className={styles.control()}>
        <Base.Track className={styles.track()}>
          <Base.Indicator className={styles.indicator()} />
          <Base.Thumb aria-label={ariaLabel} className={styles.thumb()} />
        </Base.Track>
      </Base.Control>
    </Base.Root>
  )
}
