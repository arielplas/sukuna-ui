'use client'

import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { type SwitchStyleProps, switchStyles } from './switch.styles'

type NativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type' | 'onClick' | 'value' | 'role' | 'aria-checked'
>

/**
 * Props for {@link Switch}: native `<button>` attributes (minus `type`, `role`, `aria-checked`,
 * `value` and `onClick`, which the component owns) plus the style variant
 * `size?: 'sm' | 'md'` (default `'md'`).
 */
export interface SwitchProps extends NativeProps, SwitchStyleProps {
  /**
   * Controlled on/off state. When set, the switch only changes when the parent updates this
   * prop; still call `onCheckedChange` to hear about user toggles.
   */
  checked?: boolean
  /**
   * Initial state for uncontrolled use. Ignored when `checked` is provided.
   * @default false
   */
  defaultChecked?: boolean
  /**
   * Fires after every user toggle (click, Space or Enter) with the next boolean state. Replaces
   * the native `onClick`. Fires in both controlled and uncontrolled modes.
   */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * An on/off toggle for a setting that applies immediately (not a form submission). Use a
 * `Checkbox` when the value is collected and submitted with a form.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because it holds controllable state. Renders on
 *   the server; no `useEffect` and no DOM access.
 * - Accessibility: renders `<button type="button" role="switch" aria-checked={state}>`, so
 *   Space and Enter toggle and focus comes from the native button. No visible label is rendered,
 *   so an accessible name is required: pass `aria-label` or `aria-labelledby` (or wrap in
 *   `Field`). The sliding thumb is `aria-hidden`. Focus ring is visible in both themes.
 * - Variants: `size`: 'sm' (20x36px) | 'md' (24x44px, default).
 * - Works uncontrolled (`defaultChecked`) or controlled (`checked`); listen with
 *   `onCheckedChange(boolean)`. `disabled` blocks toggling.
 * - Not a form control: it has no `name`/`value` and submits nothing. Mirror the state into a
 *   hidden input if a form needs it.
 * - The ref points at the `<button>` element; `className` merges onto the track (root).
 *
 * @example
 * ```tsx
 * import { Switch } from 'sukuna-ui'
 *
 * // Uncontrolled
 * <Switch aria-label="Email notifications" defaultChecked onCheckedChange={save} />
 * ```
 *
 * @example
 * ```tsx
 * import { Switch } from 'sukuna-ui'
 *
 * // Controlled, labelled by visible text.
 * <span id="dark-mode-label">Dark mode</span>
 * <Switch
 *   aria-labelledby="dark-mode-label"
 *   size="sm"
 *   checked={dark}
 *   onCheckedChange={setDark}
 *   disabled={!themeReady}
 * />
 * ```
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { size, checked, defaultChecked = false, onCheckedChange, className, disabled, ...rest },
  ref,
) {
  const [state, setState] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })
  const { root, thumb } = switchStyles({ size })

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={state}
      disabled={disabled}
      onClick={() => setState(!state)}
      className={root({ className })}
      {...rest}
    >
      <span aria-hidden="true" className={thumb()} />
    </button>
  )
})
