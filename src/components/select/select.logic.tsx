'use client'

import { Select as Base } from '@base-ui-components/react/select'
import type { ReactNode } from 'react'
import { type SelectStyleProps, selectStyles } from './select.styles'

export interface SelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface SelectProps extends SelectStyleProps {
  items: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  'aria-label'?: string
}

// Inlined elements (not components) so their creation runs during render — covered even while the
// popup, and thus the mounted item indicator, stays closed.
const chevron = (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const check = (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Single-select dropdown. Behavior (keyboard, typeahead, positioning, dismiss, a11y) from Base UI;
 * we style trigger + popup + items. String values in v1. `'use client'`.
 */
export function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  placeholder = 'Select…',
  disabled,
  name,
  id,
  size,
  'aria-label': ariaLabel,
}: SelectProps) {
  const styles = selectStyles({ size })
  return (
    <Base.Root<string>
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (next != null) onValueChange?.(next)
      }}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      name={name}
    >
      <Base.Trigger id={id} aria-label={ariaLabel} className={styles.trigger()}>
        <Base.Value>
          {(current: string | null) => {
            const selected = items.find((item) => item.value === current)
            return selected ? (
              selected.label
            ) : (
              <span className={styles.placeholder()}>{placeholder}</span>
            )
          }}
        </Base.Value>
        <Base.Icon className={styles.icon()}>{chevron}</Base.Icon>
      </Base.Trigger>
      <Base.Portal>
        <Base.Positioner sideOffset={6} className={styles.positioner()}>
          <Base.Popup className={styles.popup()}>
            <Base.List>
              {items.map((item) => (
                <Base.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={styles.item()}
                >
                  <Base.ItemText>{item.label}</Base.ItemText>
                  <Base.ItemIndicator className={styles.indicator()}>{check}</Base.ItemIndicator>
                </Base.Item>
              ))}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
