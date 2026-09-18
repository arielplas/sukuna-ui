'use client'

import { Autocomplete as Base } from '@base-ui-components/react/autocomplete'
import { comboboxStyles } from './combobox.styles'

export interface ComboboxProps {
  items: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  emptyMessage?: string
  /**
   * Cap how many (filtered) suggestions render at once — search still spans every item, only the
   * top N are shown. Keeps a huge `items` list cheap to open. Omit/`-1` for no cap.
   */
  maxRenderedItems?: number
  'aria-label'?: string
}

/**
 * Free-text autocomplete over a list of string suggestions (Base UI). `'use client'`.
 * Filtering is built in; `value` is the input text.
 */
export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  disabled,
  emptyMessage = 'No results',
  maxRenderedItems,
  'aria-label': ariaLabel,
}: ComboboxProps) {
  const styles = comboboxStyles()
  return (
    <Base.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      limit={maxRenderedItems}
    >
      <Base.Input
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={styles.input()}
      />
      <Base.Portal>
        <Base.Positioner sideOffset={6} className={styles.positioner()}>
          <Base.Popup className={styles.popup()}>
            <Base.Empty className={styles.empty()}>{emptyMessage}</Base.Empty>
            <Base.List>
              {(item: string) => (
                <Base.Item key={item} value={item} className={styles.item()}>
                  {item}
                </Base.Item>
              )}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
