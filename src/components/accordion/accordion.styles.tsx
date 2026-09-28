import { tv } from '../../utils/tv'

export const accordionStyles = tv({
  slots: {
    root: 'w-full',
    item: 'border-b border-line',
    header: 'm-0',
    trigger: [
      'group flex w-full items-center justify-between gap-3 py-3 text-left cursor-pointer',
      'font-medium text-text hover:text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-sm',
      // Base UI keeps a disabled trigger focusable (data-disabled + aria-disabled, no native attr),
      // so the native disabled: variant never matched — same trap as Tabs (D27).
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    icon: 'shrink-0 text-text-dim transition-transform motion-reduce:transition-none duration-fast ease-sukuna group-data-[panel-open]:rotate-180',
    // Base UI measures the open height into --accordion-panel-height; animate between 0 and it.
    panel: [
      'overflow-hidden h-[var(--accordion-panel-height)]',
      'transition-[height] motion-reduce:transition-none duration-base ease-sukuna',
      'data-[starting-style]:h-0 data-[ending-style]:h-0',
    ],
    content: 'pb-3 text-sm text-text-dim',
  },
})
