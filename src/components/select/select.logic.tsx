'use client'

import { Select as Base } from '@base-ui-components/react/select'
import { type ReactNode, useMemo } from 'react'
import { type SelectStyleProps, selectStyles } from './select.styles'

/** One entry in a {@link Select}'s `items` array. */
export interface SelectOption {
  /** Unique string submitted as the form value and passed to `onValueChange`. Used as the key. */
  value: string
  /** Visible content for the option; also shown in the trigger once selected. */
  label: ReactNode
  /**
   * Renders the option dimmed, skips it in keyboard navigation and blocks selection.
   * @default false
   */
  disabled?: boolean
}

/** Props for {@link Select}. `size` comes from the style variants. */
export interface SelectProps extends SelectStyleProps {
  /** Options to list, in display order. Values must be unique strings. */
  items: SelectOption[]
  /** Controlled selected value. Pair with `onValueChange`; omit to stay uncontrolled. */
  value?: string
  /** Initial selection for uncontrolled use. Ignored once `value` is provided. */
  defaultValue?: string
  /** Fires when the user picks an option, with the option's `value`. Never fires with `null`. */
  onValueChange?: (value: string) => void
  /** Controlled open state of the listbox popup. Pair with `onOpenChange`. */
  open?: boolean
  /**
   * Whether the popup starts open (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean
  /** Fires when the popup opens or closes (trigger click, Escape, outside click, selection). */
  onOpenChange?: (open: boolean) => void
  /**
   * Faint text shown in the trigger while nothing is selected.
   * @default 'Select…'
   */
  placeholder?: string
  /**
   * Disables the trigger entirely; the popup cannot open and the value cannot change.
   * @default false
   */
  disabled?: boolean
  /** Form field name; a hidden input carries the selected value on native form submit. */
  name?: string
  /** `id` for the trigger button, so an external `<label htmlFor>` can name it. */
  id?: string
  /**
   * Accessible name for the trigger. Required unless a `<label>` is associated via `id`, since
   * the selected value alone does not describe what the field is for.
   */
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
 * Single-select dropdown: a trigger button that opens a portalled listbox of options. Use it for
 * picking one value from a fixed list without typing; for free-text search use `Combobox`.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because open state, positioning and keyboard
 *   handling live in Base UI hooks. It still server-renders the trigger; only the popup is
 *   client-only, so options are not in the DOM while closed.
 * - Accessibility: the trigger is a button with `aria-haspopup="listbox"`/`aria-expanded`; the
 *   popup is `role="listbox"` with `role="option"` items. The trigger needs a name: pass
 *   `aria-label` or point a `<label htmlFor>` at `id`. Arrow keys move the highlight, typing
 *   jumps by typeahead, `Enter`/`Space` select, `Escape` or an outside click closes and returns
 *   focus to the trigger. Disabled options are announced as disabled and skipped.
 * - Variants: `variant` is `'filled'` (default — `surface-2` fill + `line` border), `'outline'`
 *   (transparent, `line` border) or `'ghost'` (borderless until hover/focus) — the same map as
 *   Input. `size` is `'sm'` (h-8, text-sm), `'md'` (h-10, text-md) or `'lg'` (h-12, text-lg);
 *   default `'md'`.
 * - Behaviour: uncontrolled with `defaultValue`, or controlled with `value` + `onValueChange`.
 *   Open state can likewise be controlled via `open` + `onOpenChange`. Values are strings only
 *   in v1 (no multi-select). The trigger shows the matching item's `label`, falling back to the
 *   `placeholder` when `value` is empty or not found in `items`.
 * - Gotchas: `items` is memoised into a value-to-label map, so pass a stable array (hoist it or
 *   `useMemo` it) to avoid rebuilding on every render. The popup opens below the trigger (above
 *   when cramped), is at least as wide as the trigger, and caps its height at 24rem or the room
 *   left on that side — whichever is smaller — scrolling internally beyond that.
 *   Long option sets still belong in a `Combobox`; Select cannot virtualise.
 *
 * @example
 * ```tsx
 * import { Select } from 'sukuna-ui'
 *
 * const fruits = [
 *   { value: 'apple', label: 'Apple' },
 *   { value: 'banana', label: 'Banana' },
 *   { value: 'cherry', label: 'Cherry', disabled: true },
 * ]
 *
 * <Select aria-label="Fruit" items={fruits} defaultValue="apple" name="fruit" />
 * ```
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { Select } from 'sukuna-ui'
 *
 * function SizePicker() {
 *   const [size, setSize] = useState('md')
 *   return (
 *     <Select
 *       aria-label="Size"
 *       size="sm"
 *       placeholder="Pick a size"
 *       items={[
 *         { value: 'sm', label: 'Small' },
 *         { value: 'md', label: 'Medium' },
 *         { value: 'lg', label: 'Large' },
 *       ]}
 *       value={size}
 *       onValueChange={setSize}
 *     />
 *   )
 * }
 * ```
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
  variant,
  size,
  'aria-label': ariaLabel,
}: SelectProps) {
  const styles = selectStyles({ variant, size })
  // O(1) value→label lookup for the trigger, instead of an O(n) `items.find` on every value render.
  const labelByValue = useMemo(() => new Map(items.map((i) => [i.value, i.label])), [items])
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
            if (current != null && labelByValue.has(current)) return labelByValue.get(current)
            return <span className={styles.placeholder()}>{placeholder}</span>
          }}
        </Base.Value>
        <Base.Icon className={styles.icon()}>{chevron}</Base.Icon>
      </Base.Trigger>
      <Base.Portal>
        {/* Standard dropdown placement (below the trigger, flips when cramped). Base UI's default
            aligns the selected option over the trigger macOS-style, pinning a viewport-tall
            positioner whose popup grows as you wheel — the box appears to move instead of the
            list scrolling (see D31). */}
        <Base.Positioner
          alignItemWithTrigger={false}
          sideOffset={6}
          className={styles.positioner()}
        >
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
