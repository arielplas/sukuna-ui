'use client'

import { Accordion as Base } from '@base-ui-components/react/accordion'
import { createElement, type ReactElement, type ReactNode } from 'react'
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
  /**
   * Heading level for each item's header, for a correct document outline
   * (WCAG 1.3.1). Renders `<h1>`..`<h6>`; the trigger button stays inside it.
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
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
  headingLevel = 3,
}: AccordionProps) {
  const styles = accordionStyles()
  // Base UI's Header `render` prop wants a ReactElement<Record<string, unknown>>; the bare heading
  // element (its props get merged by Base UI) satisfies that after this cast.
  const heading = createElement(`h${headingLevel}`) as ReactElement<Record<string, unknown>>
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
          <Base.Header render={heading} className={styles.header()}>
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
