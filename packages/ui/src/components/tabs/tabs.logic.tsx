'use client'

import { Tabs as Base } from '@base-ui/react/tabs'
import type { ReactNode } from 'react'
import { type TabsStyleProps, tabsStyles } from './tabs.styles'

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

/**
 * Props for {@link Tabs}. Prop-driven: no `children`, no native element passthrough.
 */
export interface TabsProps
  extends Omit<TabsStyleProps, 'orientation' | 'variant' | 'size' | 'fitted'> {
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
  /**
   * `horizontal`: underlined tabs above the panel. `vertical`: a navigation column to the left of
   * the panel (settings pages, sidebars); arrow keys become Up/Down.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * `underline`: crimson text + a sliding underline. `pill`: a segmented control on a `well` track.
   * Horizontal only; vertical tabs are always underline-style.
   * @default 'underline'
   */
  variant?: 'underline' | 'pill'
  /**
   * Tab height and padding: `sm` 32px, `md` 40px (36px rows when vertical), `lg` 48px.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Tabs share the list width equally (horizontal only).
   * @default false
   */
  fitted?: boolean
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
 *   Home/End jump to first/last; ArrowUp/ArrowDown when vertical) and Enter/Space selects; Tab then moves into the panel. Give the
 *   list an `aria-label`. The selected tab is marked by an accent underline (pill: a lighter,
 *   bordered segment) plus color, not color alone.
 * - Variants:
 *   - `orientation`: 'horizontal' (default; tabs above the panel) | 'vertical' (a navigation
 *     column beside the panel; ArrowUp/ArrowDown, `aria-orientation="vertical"`).
 *   - `variant` (horizontal only): 'underline' (default) — crimson text + underline on the
 *     selected tab, over a `line` rule; 'pill' — a segmented control on a `well` track whose
 *     selected segment is a lighter `surface` pill with crimson text (lighter than its track in
 *     both themes). Vertical tabs are always underline-style.
 *   - `size`: 'sm' (32px) | 'md' (40px; 36px rows when vertical, default) | 'lg' (48px).
 *   - `fitted` (horizontal only): boolean — tabs share the list width equally.
 *   Labels may hold an icon + text. `items[].disabled` tabs are dimmed (`data-disabled`, not the
 *   native attribute) and cannot be activated, but remain focusable.
 * - Motion: the crimson underline (vertical: right-edge bar) slides to the selected tab with
 *   `ease-spring`; it jumps under `prefers-reduced-motion`. Before hydration the selected tab
 *   draws its own border, so the selection is visible without JS. The pill has no sliding
 *   indicator: its selected segment is the tab itself.
 * - Behaviour: uncontrolled with `defaultValue`, controlled with `value` + `onValueChange`.
 *   Values are strings; Base UI's index fallback matches none of them, so pass a default.
 *   Only the selected panel is mounted: switching tabs unmounts the previous `content`, so any
 *   local state inside it (form input, scroll) is lost — lift such state up if it must persist.
 *
 * @example
 * ```tsx
 * import { Tabs } from '@sukunagg/ui'
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
 * import { Tabs } from '@sukunagg/ui'
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
  orientation = 'horizontal',
  variant = 'underline',
  size,
  fitted,
}: TabsProps) {
  // The pill segmented control and `fitted` are horizontal treatments; a vertical column is always
  // underline-style (right-edge bar) and already spans its own width.
  const vertical = orientation === 'vertical'
  const look = vertical ? 'underline' : variant
  const styles = tabsStyles({ orientation, variant: look, size, fitted: vertical ? false : fitted })
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === 'string') onValueChange?.(next)
      }}
      orientation={orientation}
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
        {look === 'underline' ? (
          <Base.Indicator data-sk-indicator="" className={styles.indicator()} />
        ) : null}
      </Base.List>
      {items.map((item) => (
        <Base.Panel key={item.value} value={item.value} className={styles.panel()}>
          {item.content}
        </Base.Panel>
      ))}
    </Base.Root>
  )
}
