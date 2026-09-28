import { tv, type VariantProps } from '../../utils/tv'

export const tabsStyles = tv({
  slots: {
    root: 'w-full',
    list: 'group/tabs relative flex border-line',
    tab: [
      'relative inline-flex items-center gap-2 px-3 text-sm font-medium cursor-pointer',
      'text-text-dim border-transparent transition-colors motion-reduce:transition-none duration-fast ease-sukuna',
      // Base UI marks the selected tab with aria-selected (there is no data-selected) — key the
      // active styling off it. Selected tab reads crimson (text + bar) so it's unmistakable;
      // `accent` clears AA as text on the page/surface backgrounds tabs sit on.
      'hover:text-text aria-selected:text-accent aria-selected:border-accent',
      // The sliding indicator takes over once Base UI has measured it (it is `hidden` until then,
      // incl. the server render) — until that moment the tab's own border marks the selection.
      'group-has-[[data-sk-indicator]:not([hidden])]/tabs:aria-selected:border-transparent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      // Base UI marks a disabled tab with data-disabled (no native `disabled` attr), so the plain
      // `disabled:` variant never fires — gate the dim/cursor styling on data-disabled too.
      'disabled:opacity-45 disabled:cursor-not-allowed data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    panel: 'text-text focus-visible:outline-none',
    // Slides to the selected tab using Base UI's --active-tab-* measurements (docs/motion.md).
    indicator:
      'absolute bg-accent pointer-events-none transition-[translate,width,height] motion-reduce:transition-none duration-base ease-spring',
  },
  variants: {
    orientation: {
      // Underline tabs above the panel.
      horizontal: {
        list: 'border-b',
        tab: 'h-10 -mb-px border-b-2 rounded-t-sm',
        panel: 'pt-4',
        indicator:
          'left-0 bottom-[-1px] h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
      },
      // A navigation column beside the panel: the selected row gets a crimson bar on the list's
      // right border plus a surface fill.
      vertical: {
        root: 'flex items-start gap-6',
        list: 'flex-col shrink-0 min-w-44 border-r',
        tab: 'w-full justify-start h-9 -mr-px border-r-2 rounded-l-sm hover:bg-line-soft aria-selected:bg-surface-2',
        panel: 'flex-1 min-w-0',
        indicator:
          'top-0 right-[-1px] w-0.5 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]',
      },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type TabsStyleProps = VariantProps<typeof tabsStyles>
