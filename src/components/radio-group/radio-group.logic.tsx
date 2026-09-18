'use client'

import { Radio } from '@base-ui-components/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group'
import { type ReactNode, useId } from 'react'
import { type RadioGroupStyleProps, radioGroupStyles } from './radio-group.styles'

export interface RadioOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps extends RadioGroupStyleProps {
  items: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  'aria-label'?: string
}

/** Single-choice radio group. `'use client'`. Behavior (roving focus, arrows) from Base UI. */
export function RadioGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  orientation,
  size,
  'aria-label': ariaLabel,
}: RadioGroupProps) {
  const styles = radioGroupStyles({ orientation, size })
  const baseId = useId()
  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === 'string') onValueChange?.(next)
      }}
      name={name}
      disabled={disabled}
      aria-label={ariaLabel}
      className={styles.group()}
    >
      {items.map((item) => {
        const labelId = `${baseId}-${item.value}`
        return (
          // Radio.Root wraps the label too, so a click on the text selects the option (the whole
          // row is the role=radio control). Named via aria-labelledby on the label span inside it.
          <Radio.Root
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            aria-labelledby={labelId}
            className={styles.item()}
          >
            <span className={styles.control()}>
              <Radio.Indicator className={styles.indicator()} />
            </span>
            <span id={labelId} className={styles.label()}>
              {item.label}
            </span>
          </Radio.Root>
        )
      })}
    </BaseRadioGroup>
  )
}
