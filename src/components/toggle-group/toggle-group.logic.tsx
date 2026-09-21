'use client'

import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseGroup } from '@base-ui-components/react/toggle-group'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type ToggleGroupStyleProps, toggleGroupStyles } from './toggle-group.styles'

/** One button in a {@link ToggleGroup}'s `items` array. */
export interface ToggleOption {
  /** Value reported through `onValueChange` when this button is pressed. Must be unique. */
  value: string
  /** Visible content (text, or an icon plus text). */
  label: ReactNode
  /**
   * Renders the button dimmed and non-pressable.
   * @default false
   */
  disabled?: boolean
  /** Accessible name; required when `label` is icon-only. */
  'aria-label'?: string
}

interface ToggleGroupOwnProps extends ToggleGroupStyleProps {
  /** Buttons to render, in order. */
  items: ToggleOption[]
  /** Controlled selection. A string in single mode, an array in `multiple` mode. */
  value?: string | string[]
  /** Initial selection for uncontrolled use. */
  defaultValue?: string | string[]
  /** Fires with the pressed values (always an array, even in single mode). */
  onValueChange?: (value: string[]) => void
  /**
   * Allow more than one button pressed at once. When `false`, acts as a segmented control.
   * @default false
   */
  multiple?: boolean
  /** Disable every button. */
  disabled?: boolean
}

/**
 * Props for {@link ToggleGroup}: the own props above plus native `<div>` attributes. A group needs
 * an accessible name — pass `aria-label` or `aria-labelledby`.
 */
export type ToggleGroupProps = ToggleGroupOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'dir'>

const toArray = (v: string | string[] | undefined): string[] | undefined =>
  v === undefined ? undefined : Array.isArray(v) ? v : [v]

/**
 * A segmented control: a row (or column) of pressable buttons where one — or, in `multiple` mode,
 * several — is active. Use it for compact, button-style choices (view mode, text alignment); for a
 * labelled form value use `RadioGroup`, and for a single on/off button use {@link Toggle}.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because pressed state and roving focus come from
 *   Base UI hooks. The buttons server-render.
 * - Accessibility: each button exposes `aria-pressed`; the group has roving `tabIndex` with Arrow
 *   keys (and `Home`/`End`). The group **requires** an accessible name (`aria-label` /
 *   `aria-labelledby`). Icon-only buttons require an `aria-label` on the option. Pressed state is
 *   conveyed by fill and text contrast, not colour alone.
 * - Variants: `size`: 'sm' | 'md' (default) | 'lg'; `orientation`: 'horizontal' (default) |
 *   'vertical'.
 * - Behaviour: controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`.
 *   `onValueChange` always receives an array — in single mode it is empty or one element.
 * - `ToggleGroup` does not forward a `ref` to a specific button; native `div` props (including the
 *   ref) spread onto the group container.
 *
 * @example
 * ```tsx
 * import { ToggleGroup } from 'sukuna-ui'
 *
 * <ToggleGroup
 *   aria-label="Text alignment"
 *   defaultValue="left"
 *   items={[
 *     { value: 'left', label: 'Left' },
 *     { value: 'center', label: 'Center' },
 *     { value: 'right', label: 'Right' },
 *   ]}
 * />
 * ```
 */
export function ToggleGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled,
  size,
  orientation,
  className,
  ...rest
}: ToggleGroupProps) {
  const styles = toggleGroupStyles({ size, orientation })
  return (
    <BaseGroup
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={onValueChange ? (next) => onValueChange(next as string[]) : undefined}
      multiple={multiple}
      disabled={disabled}
      orientation={orientation}
      className={styles.root({ className })}
      {...rest}
    >
      {items.map((item) => (
        <BaseToggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item['aria-label']}
          className={styles.item()}
        >
          {item.label}
        </BaseToggle>
      ))}
    </BaseGroup>
  )
}

interface ToggleOwnProps extends ToggleGroupStyleProps {
  /** Controlled pressed state. */
  pressed?: boolean
  /** Initial pressed state for uncontrolled use. */
  defaultPressed?: boolean
  /** Fires with the new pressed state. */
  onPressedChange?: (pressed: boolean) => void
}

/** Props for {@link Toggle}: own props plus native `<button>` attributes. */
export type ToggleProps = ToggleOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'>

/**
 * A single on/off button (mute, bold, pin). Standalone counterpart to {@link ToggleGroup}.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`). Accessibility: exposes `aria-pressed`; an
 *   icon-only Toggle requires `aria-label`. Variants: `size` ('sm' | 'md' | 'lg'). The ref points
 *   at the `<button>`.
 *
 * @example
 * ```tsx
 * import { Toggle } from 'sukuna-ui'
 *
 * <Toggle aria-label="Bold" defaultPressed><b>B</b></Toggle>
 * ```
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed, defaultPressed, onPressedChange, size, className, ...rest },
  ref,
) {
  const styles = toggleGroupStyles({ size })
  return (
    <BaseToggle
      ref={ref}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange ? (next) => onPressedChange(next) : undefined}
      className={styles.item({ className })}
      {...rest}
    />
  )
})
