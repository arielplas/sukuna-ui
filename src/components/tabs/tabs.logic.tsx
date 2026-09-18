'use client'

import { Tabs as Base } from '@base-ui-components/react/tabs'
import type { ReactNode } from 'react'
import { tabsStyles } from './tabs.styles'

/** One tab and its panel, as passed in {@link TabsProps.items}. */
export interface TabItem {
  /** Unique string id for this tab; it is what `value`/`defaultValue`/`onValueChange` refer to. */
  value: string
  /** Contents of the clickable tab button (text or an icon + text). */
  label: ReactNode
  /** Contents of the panel shown while this tab is selected. */
  content: ReactNode
  /**
   * Renders the tab dimmed and unselectable (click/Enter/Space do nothing); arrow keys can still
   * focus it, so screen readers announce it as a disabled option.
   * @default false
   */
  disabled?: boolean
}

/** Props for {@link Tabs}. Prop-driven: no `children`, no native element passthrough. */
export interface TabsProps {
  /** Tabs to render, in order; one `<button role="tab">` and one panel per item. */
  items: TabItem[]
  /** Selected tab's `value` for controlled usage; pair with `onValueChange`. */
  value?: string
  /**
   * Initially selected tab's `value` for uncontrolled usage. Pass one of these: with neither
   * `value` nor `defaultValue`, no tab starts selected.
   */
  defaultValue?: string
  /** Fires when the user selects a different tab, with that tab's `value`. */
  onValueChange?: (value: string) => void
  /** Accessible name for the `tablist` (e.g. 'Settings'); always provide one. */
  'aria-label'?: string
}

/**
 * Switches between panels of related content from a horizontal row of tabs.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) — it owns the selected-tab state via Base UI.
 *   It still server-renders (all tabs plus the selected panel are in the HTML); no DOM access
 *   outside events.
 * - Accessibility: Base UI wires `role="tablist"` / `tab` / `tabpanel`, `aria-selected` and
 *   `aria-controls`. Manual activation: ArrowLeft/ArrowRight move focus (looping past the ends,
 *   Home/End jump to first/last) and Enter/Space selects; Tab then moves into the panel. Give the
 *   list an `aria-label`. The selected tab is marked by an accent underline + color, not color
 *   alone.
 * - Variants: none — horizontal only. `items[].disabled` tabs are dimmed (`data-disabled`,
 *   not the native attribute) and cannot be activated, but remain focusable.
 * - Behaviour: uncontrolled with `defaultValue`, controlled with `value` + `onValueChange`.
 *   Values are strings; Base UI's index fallback matches none of them, so pass a default.
 *   Only the selected panel is mounted: switching tabs unmounts the previous `content`, so any
 *   local state inside it (form input, scroll) is lost — lift such state up if it must persist.
 *
 * @example
 * ```tsx
 * import { Tabs } from 'sukuna-ui'
 *
 * <Tabs
 *   aria-label="Settings"
 *   defaultValue="account"
 *   items={[
 *     { value: 'account', label: 'Account', content: <AccountForm /> },
 *     { value: 'billing', label: 'Billing', content: <BillingForm /> },
 *     { value: 'team', label: 'Team', content: <TeamList />, disabled: !isAdmin },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { Tabs } from 'sukuna-ui'
 *
 * // Controlled: keep the selected tab in the URL or parent state.
 * const [tab, setTab] = useState('account')
 *
 * <Tabs aria-label="Settings" value={tab} onValueChange={setTab} items={items} />
 * ```
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  'aria-label': ariaLabel,
}: TabsProps) {
  const styles = tabsStyles()
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === 'string') onValueChange?.(next)
      }}
      className={styles.root()}
    >
      <Base.List aria-label={ariaLabel} className={styles.list()}>
        {items.map((item) => (
          <Base.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={styles.tab()}
          >
            {item.label}
          </Base.Tab>
        ))}
      </Base.List>
      {items.map((item) => (
        <Base.Panel key={item.value} value={item.value} className={styles.panel()}>
          {item.content}
        </Base.Panel>
      ))}
    </Base.Root>
  )
}
