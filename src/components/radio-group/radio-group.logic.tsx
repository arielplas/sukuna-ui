'use client'

import { Radio } from '@base-ui-components/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group'
import { type ReactNode, useId } from 'react'
import { type RadioGroupStyleProps, radioGroupStyles } from './radio-group.styles'

/** One choice in a {@link RadioGroup}'s `items` array. */
export interface RadioOption {
  /** Unique string submitted as the form value and passed to `onValueChange`. Used as the key. */
  value: string
  /** Visible label rendered beside the circle; clicking it selects the option. */
  label: ReactNode
  /**
   * Renders this option dimmed and unselectable; arrow-key navigation skips it.
   * @default false
   */
  disabled?: boolean
}

/** Props for {@link RadioGroup}. `orientation` and `size` come from the style variants. */
export interface RadioGroupProps extends RadioGroupStyleProps {
  /** Options to render, in order. Values must be unique strings. */
  items: RadioOption[]
  /** Controlled selected value. Pair with `onValueChange`; omit to stay uncontrolled. */
  value?: string
  /** Initial selection for uncontrolled use; leave unset for no option checked. */
  defaultValue?: string
  /** Fires when a different option is checked (click or arrow key), with that option's `value`. */
  onValueChange?: (value: string) => void
  /** Form field name; a hidden input carries the checked value on native form submit. */
  name?: string
  /**
   * Disables every option in the group.
   * @default false
   */
  disabled?: boolean
  /**
   * Accessible name for the `role="radiogroup"` container. Required: the individual option
   * labels do not describe the question being asked.
   */
  'aria-label'?: string
}

/**
 * Single-choice radio group: pick exactly one option from a small, always-visible set. For more
 * than about six options, or when space is tight, prefer `Select`.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because checked state and roving focus come
 *   from Base UI hooks. It renders fully on the server (no portal), so all options are in the
 *   initial HTML.
 * - Accessibility: the container is `role="radiogroup"` and each row is `role="radio"` with
 *   `aria-checked`, named by its visible label through `aria-labelledby`. Pass `aria-label` for
 *   the group itself. `Tab` enters the group on the checked (or first) option and leaves it on
 *   the next press; `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` move focus and check the next
 *   enabled option; `Space` checks the focused one. The whole row is the control, so clicking the
 *   label text also selects it.
 * - Variants: `orientation` is `'vertical'` (column, gap-3) or `'horizontal'` (wrapping row,
 *   gap-5); default `'vertical'`. `size` is `'sm'` (16px circle) or `'md'` (20px circle);
 *   default `'md'`.
 * - Behaviour: uncontrolled via `defaultValue`, controlled via `value` + `onValueChange`. Values
 *   are strings only in v1. `onValueChange` is not called when the already-checked option is
 *   clicked again.
 *
 * @example
 * ```tsx
 * import { RadioGroup } from 'sukuna-ui'
 *
 * <RadioGroup
 *   aria-label="Delivery speed"
 *   name="delivery"
 *   defaultValue="standard"
 *   items={[
 *     { value: 'standard', label: 'Standard (3–5 days)' },
 *     { value: 'express', label: 'Express (1–2 days)' },
 *     { value: 'overnight', label: 'Overnight', disabled: true },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { RadioGroup } from 'sukuna-ui'
 *
 * function ThemePicker() {
 *   const [theme, setTheme] = useState('dark')
 *   return (
 *     <RadioGroup
 *       aria-label="Theme"
 *       orientation="horizontal"
 *       size="sm"
 *       items={[
 *         { value: 'dark', label: 'Dark' },
 *         { value: 'light', label: 'Light' },
 *         { value: 'system', label: 'System' },
 *       ]}
 *       value={theme}
 *       onValueChange={setTheme}
 *     />
 *   )
 * }
 * ```
 */
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
