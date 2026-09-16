'use client'

import { Accordion as Base } from '@base-ui-components/react/accordion'
import type { ReactNode } from 'react'
import { accordionStyles } from './accordion.styles'

export interface AccordionItemData {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItemData[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  openMultiple?: boolean
}

const Chevron = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Expandable sections (Base UI). `'use client'`. */
export function Accordion({
  items,
  value,
  defaultValue,
  onValueChange,
  openMultiple = false,
}: AccordionProps) {
  const styles = accordionStyles()
  return (
    <Base.Root
      multiple={openMultiple}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as string[])}
      className={styles.root()}
    >
      {items.map((item) => (
        <Base.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={styles.item()}
        >
          <Base.Header className={styles.header()}>
            <Base.Trigger className={styles.trigger()}>
              {item.trigger}
              <Chevron className={styles.icon()} />
            </Base.Trigger>
          </Base.Header>
          <Base.Panel className={styles.panel()}>
            <div className={styles.content()}>{item.content}</div>
          </Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  )
}
