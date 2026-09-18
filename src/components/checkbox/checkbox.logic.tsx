'use client'

import { type ComponentPropsWithoutRef, forwardRef, type RefObject, useCallback } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { type CheckboxStyleProps, checkboxStyles } from './checkbox.styles'

type NativeProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value' | 'defaultValue'
>

/**
 * Props for {@link Checkbox}: native `<input>` attributes (minus `type`, `size`, `value`,
 * `defaultValue`, `checked`, `defaultChecked` and `onChange`, which the component owns or
 * replaces) plus the style variant `size?: 'sm' | 'md'` (default `'md'`).
 */
export interface CheckboxProps extends NativeProps, CheckboxStyleProps {
  /**
   * Controlled checked state. When set, the box only changes when the parent updates this prop;
   * still call `onCheckedChange` to hear about user toggles.
   */
  checked?: boolean
  /**
   * Initial checked state for uncontrolled use. Ignored when `checked` is provided.
   * @default false
   */
  defaultChecked?: boolean
  /**
   * Fires after every user toggle (click or Space) with the next boolean state. Replaces the
   * native `onChange`. Fires in both controlled and uncontrolled modes.
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * Shows the native "mixed" look and makes assistive tech report the state as mixed. Set as the
   * DOM property (there is no HTML attribute), independently of `checked`. Typical use: a
   * "select all" box when only some children are checked.
   * @default false
   */
  indeterminate?: boolean
}

/**
 * A boolean checkbox: a native `<input type="checkbox">` tinted with Sukuna's accent colour, so
 * keyboard, focus and the indeterminate state come from the platform.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because it holds controllable state and sets
 *   the `indeterminate` DOM property through a ref callback. No `useEffect`; renders on the
 *   server.
 * - Accessibility: the component renders no label. Supply one via `<label htmlFor>` (or wrap it
 *   in `Field`), `aria-label` or `aria-labelledby`. Space toggles (native). `indeterminate` is
 *   exposed to assistive tech as "mixed". Focus ring is visible in both themes.
 * - Variants: `size`: 'sm' (16px) | 'md' (20px, default).
 * - Works uncontrolled (`defaultChecked`) or controlled (`checked`); listen with
 *   `onCheckedChange(boolean)` rather than `onChange`. `disabled` blocks toggling.
 * - The ref points at the `<input>` element (object and callback refs both supported).
 *
 * @example
 * ```tsx
 * import { Checkbox } from 'sukuna-ui'
 *
 * // Uncontrolled
 * <label>
 *   <Checkbox name="terms" defaultChecked={false} onCheckedChange={(v) => setAgreed(v)} />
 *   I agree to the terms
 * </label>
 * ```
 *
 * @example
 * ```tsx
 * import { Checkbox } from 'sukuna-ui'
 *
 * // Controlled "select all" with an indeterminate state.
 * const all = selected.length === rows.length
 * const some = selected.length > 0 && !all
 *
 * <Checkbox
 *   aria-label="Select all rows"
 *   size="sm"
 *   checked={all}
 *   indeterminate={some}
 *   onCheckedChange={(next) => setSelected(next ? rows.map((r) => r.id) : [])}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size,
    checked,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    className,
    ...rest
  },
  ref,
) {
  const [state, setState] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  // Merge the external ref with setting the `indeterminate` DOM property (not an attribute),
  // so no useEffect is needed.
  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as RefObject<HTMLInputElement | null>).current = node
    },
    [ref, indeterminate],
  )

  return (
    <input
      ref={setRef}
      type="checkbox"
      checked={state}
      onChange={(e) => setState(e.target.checked)}
      className={checkboxStyles({ size, className })}
      {...rest}
    />
  )
})
