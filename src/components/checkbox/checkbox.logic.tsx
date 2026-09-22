'use client'

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useId,
} from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { type CheckboxStyleProps, checkboxLabelStyles, checkboxStyles } from './checkbox.styles'

type NativeProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value' | 'defaultValue'
>

/**
 * Props for {@link Checkbox}: native `<input>` attributes (minus `type`, `size`, `value`,
 * `defaultValue`, `checked`, `defaultChecked` and `onChange`, which the component owns or
 * replaces) plus the style variant `size?: 'sm' | 'md' | 'lg'` (default `'md'`).
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
   * Fires after every user toggle (click, label click, Space or Enter) with the next boolean
   * state. Replaces the native `onChange`. Fires in both controlled and uncontrolled modes.
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * Visible text rendered beside the box. When given, the input and the text are wrapped in a
   * real `<label>`, so clicking the text toggles the box and the text becomes its accessible
   * name (no `aria-label` needed). Omit it to render the bare input and label it yourself.
   */
  label?: ReactNode
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
 * - Accessibility: pass `label` for visible text (rendered inside a `<label>`, so it names the
 *   box and clicking it toggles), or render the bare input and name it via `<label htmlFor>`
 *   (or wrap it in `Field`), `aria-label` or `aria-labelledby`. Space toggles (native) and so
 *   does Enter — the component handles it and calls `preventDefault`, so Enter on a checkbox
 *   never implicitly submits a surrounding form. `indeterminate` is exposed to assistive tech
 *   as "mixed". Focus ring is visible in both themes.
 * - Variants: `size`: 'sm' (16px) | 'md' (20px, default).
 * - Works uncontrolled (`defaultChecked`) or controlled (`checked`); listen with
 *   `onCheckedChange(boolean)` rather than `onChange`. `disabled` blocks toggling.
 * - The ref points at the `<input>` element (object and callback refs both supported).
 *
 * @example
 * ```tsx
 * import { Checkbox } from 'sukuna-ui'
 *
 * // Uncontrolled, with its own clickable label text
 * <Checkbox
 *   name="terms"
 *   label="I agree to the terms"
 *   defaultChecked={false}
 *   onCheckedChange={(v) => setAgreed(v)}
 * />
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
    label,
    className,
    onKeyDown,
    id,
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

  // Native checkboxes toggle on Space only; people expect Enter to work too. Handle it here and
  // stop the default so Enter never falls through to implicit form submission (D32).
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (e.key === 'Enter' && !e.defaultPrevented) {
      e.preventDefault()
      setState(!state)
    }
  }

  // Stable SSR-safe id so the wrapping <label> can point at the input with htmlFor.
  const autoId = useId()
  const inputId = id ?? autoId

  const input = (
    <input
      id={inputId}
      ref={setRef}
      type="checkbox"
      checked={state}
      onChange={(e) => setState(e.target.checked)}
      onKeyDown={handleKeyDown}
      className={checkboxStyles({ size, className })}
      {...rest}
    />
  )

  if (label == null) return input

  const labelStyles = checkboxLabelStyles({ size })
  return (
    <label htmlFor={inputId} className={labelStyles.root()}>
      {input}
      <span className={labelStyles.text()}>{label}</span>
    </label>
  )
})
