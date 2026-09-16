'use client'

import { Tabs as Base } from '@base-ui-components/react/tabs'
import type { ReactNode } from 'react'
import { tabsStyles } from './tabs.styles'

export interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
}

/** Tabbed panels (Base UI). `'use client'`. Horizontal orientation. */
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
