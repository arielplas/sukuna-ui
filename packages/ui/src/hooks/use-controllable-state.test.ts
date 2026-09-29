import { describe, expect, it, mock } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { useControllableState } from './use-controllable-state'

describe('useControllableState', () => {
  it('manages its own state when uncontrolled', () => {
    const onChange = mock()
    const { result } = renderHook(() => useControllableState({ defaultValue: false, onChange }))
    expect(result.current[0]).toBe(false)
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('defers to the controlled value and never updates internal state', () => {
    const onChange = mock()
    const { result, rerender } = renderHook(
      ({ value }: { value: boolean }) =>
        useControllableState({ value, defaultValue: false, onChange }),
      { initialProps: { value: false } },
    )
    expect(result.current[0]).toBe(false)
    act(() => result.current[1](true))
    // still controlled value until parent updates it
    expect(result.current[0]).toBe(false)
    expect(onChange).toHaveBeenCalledWith(true)
    rerender({ value: true })
    expect(result.current[0]).toBe(true)
  })
})
