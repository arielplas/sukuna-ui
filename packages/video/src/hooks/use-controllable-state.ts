import { useCallback, useState } from 'react'

export interface UseControllableStateParams<T> {
  /** Controlled value. When defined, the component is controlled. */
  value?: T
  /** Initial value when uncontrolled. */
  defaultValue: T
  /** Called with the next value on every change (controlled or not). */
  onChange?: (value: T) => void
}

/**
 * One hook for the controlled/uncontrolled pattern. If `value` is provided the component is
 * controlled and internal state is ignored; otherwise it manages its own state. `onChange` always
 * fires so a controlled parent can update. Used by Checkbox and Switch (and later Select).
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): readonly [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const state = isControlled ? (value as T) : uncontrolled

  const setState = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [state, setState] as const
}
