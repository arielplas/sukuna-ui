'use client'

import { Accordion as Base } from '@base-ui-components/react/accordion'
import { createElement, type ReactElement, type ReactNode } from 'react'
import { accordionStyles } from './accordion.styles'

/** One section of an `Accordion`, passed in the `items` array. */
export interface AccordionItemData {
  /** Unique id for this section; it is what `value`/`defaultValue`/`onValueChange` refer to. */
  value: string
  /** The header label rendered inside the trigger button (text or inline elements, no buttons). */
  trigger: ReactNode
  /** The collapsible body shown when the section is open. */
  content: ReactNode
  /**
   * Prevents opening/closing and dims the trigger.
   * @default false
   */
  disabled?: boolean
}

/** Props for `Accordion`. */
export interface AccordionProps {
  /** The sections to render, in order; each needs a unique `value`. */
  items: AccordionItemData[]
  /** Controlled list of open item values; pair with `onValueChange`. */
  value?: string[]
  /**
   * Item values open on first render in uncontrolled mode.
   * @default []
   */
  defaultValue?: string[]
  /** Fires on every toggle with the full array of open item values after the change. */
  onValueChange?: (value: string[]) => void
  /**
   * Allow several sections open at once; when `false`, opening one closes the others.
   * @default false
   */
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

/**
 * Vertically stacked sections that expand and collapse, driven by an `items` array.
 *
 * @remarks
 * - SSR/RSC: client component (`'use client'`) built on Base UI Accordion. No portal: headers,
 *   triggers and any panel listed in `defaultValue`/`value` render on the server; closed
 *   panels are not in the DOM until opened.
 * - Accessibility: each header is an `<h{headingLevel}>` wrapping a `<button>` with
 *   `aria-expanded` and `aria-controls`; panels are labelled regions. Enter/Space toggle,
 *   Arrow Up/Down move between headers, Home/End jump to first/last. Disabled items are
 *   skipped. Expanded state is shown by the chevron rotation AND the visible content.
 * - Stacking: inline in the document flow; no z-index involved.
 * - Props of note: `openMultiple` (default `false`, one section at a time), `headingLevel`
 *   (default `3`), `value`/`defaultValue` are arrays of open item values even in single mode.
 * - Not `forwardRef`; there are no visual variants.
 *
 * @example
 * ```tsx
 * import { Accordion } from 'sukuna-ui'
 *
 * <Accordion
 *   headingLevel={2}
 *   openMultiple
 *   defaultValue={['shipping']}
 *   onValueChange={(open) => console.log(open)}
 *   items={[
 *     { value: 'shipping', trigger: 'Shipping', content: <p>Ships in 2–3 days.</p> },
 *     { value: 'returns', trigger: 'Returns', content: <p>30-day returns.</p> },
 *     { value: 'legacy', trigger: 'Legacy plans', content: null, disabled: true },
 *   ]}
 * />
 * ```
 */
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
