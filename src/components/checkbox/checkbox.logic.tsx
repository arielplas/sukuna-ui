'use client'

import { type ComponentPropsWithoutRef, forwardRef, type RefObject, useCallback } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { type CheckboxStyleProps, checkboxStyles } from './checkbox.styles'

type NativeProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value' | 'defaultValue'
>

export interface CheckboxProps extends NativeProps, CheckboxStyleProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

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
