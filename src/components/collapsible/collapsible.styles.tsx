import { tv } from '../../utils/tv'

export const collapsibleStyles = tv({
  slots: {
    root: 'w-full',
    trigger: [
      'group inline-flex items-center gap-2 rounded-sm text-sm font-medium text-text cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      // Base UI keeps a disabled trigger focusable: data-disabled + aria-disabled, no native attr.
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    icon: 'shrink-0 text-text-dim transition-transform motion-reduce:transition-none duration-fast ease-sukuna group-data-[panel-open]:rotate-180',
    // Base UI measures the content into --collapsible-panel-height; animate between 0 and it.
    panel: [
      'overflow-hidden h-[var(--collapsible-panel-height)]',
      'transition-[height] motion-reduce:transition-none duration-base ease-sukuna',
      'data-[starting-style]:h-0 data-[ending-style]:h-0',
    ],
    content: 'pt-2 text-sm text-text-dim',
  },
})
