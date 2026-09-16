'use client'

import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { type SwitchStyleProps, switchStyles } from './switch.styles'

type NativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type' | 'onClick' | 'value' | 'role' | 'aria-checked'
>

export interface SwitchProps extends NativeProps, SwitchStyleProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

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
