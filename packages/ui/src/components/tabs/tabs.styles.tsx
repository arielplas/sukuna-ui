import { tv, type VariantProps } from '../../utils/tv'

export const tabsStyles = tv({
  slots: {
    root: 'w-full',
    list: 'group/tabs relative flex',
    tab: [
      'relative inline-flex items-center gap-2 font-medium cursor-pointer',
      'text-text-dim hover:text-text transition-colors motion-reduce:transition-none duration-fast ease-sukuna',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      // Base UI marks a disabled tab with data-disabled (no native `disabled` attr), so the plain
      // `disabled:` variant never fires — gate the dim/cursor styling on data-disabled too.
      'disabled:opacity-45 disabled:cursor-not-allowed data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    panel: 'text-text focus-visible:outline-none',
    // Slides to the selected tab using Base UI's --active-tab-* measurements (docs/motion.md).
    // Rendered for `underline` only.
    indicator:
      'absolute bg-accent pointer-events-none transition-[translate,width,height] motion-reduce:transition-none duration-base ease-spring',
  },
  variants: {
    orientation: {
      // Tabs above the panel.
      horizontal: {
        panel: 'pt-4',
        indicator:
          'left-0 bottom-[-1px] h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
      },
      // A navigation column beside the panel.
      vertical: {
        root: 'flex items-start gap-6',
        list: 'flex-col shrink-0 min-w-44',
        tab: 'w-full justify-start',
        panel: 'flex-1 min-w-0',
        indicator:
          'top-0 right-[-1px] w-0.5 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]',
      },
    },
    variant: {
      // Base UI marks the selected tab with aria-selected (there is no data-selected). Selected
      // reads crimson (text + bar) so it's unmistakable; `accent` clears AA as text on the
      // page/surface backgrounds tabs sit on. The sliding indicator takes over once Base UI has
      // measured it (it is `hidden` until then, incl. the server render) — until that moment the
      // tab's own border marks the selection.
      underline: {
        list: 'border-line',
        tab: [
          'border-transparent aria-selected:text-accent aria-selected:border-accent',
          'group-has-[[data-sk-indicator]:not([hidden])]/tabs:aria-selected:border-transparent',
        ],
      },
      // Segmented control (horizontal only): the track is `well` and the selected segment is
      // `surface`, which is lighter than its track in both themes (dark: #000 → #141416, light:
      // #E8E5DD → #FFFFFF).
      pill: {
        list: 'w-fit gap-1 rounded-pill bg-well p-1',
        tab: [
          'rounded-pill border border-transparent',
          'aria-selected:bg-surface aria-selected:text-accent aria-selected:border-line',
        ],
      },
    },
    size: {
      sm: { tab: 'h-8 px-2.5 text-sm' },
      md: { tab: 'h-10 px-3 text-sm' },
      lg: { tab: 'h-12 px-4 text-md' },
    },
    // Declared after `variant` so `w-full` wins over the pill track's `w-fit`. Horizontal only.
    fitted: {
      true: { list: 'w-full', tab: 'flex-1 justify-center' },
    },
  },
  compoundVariants: [
    // Underline tabs: a bottom rule under a row, or a right-edge rule beside a column, where the
    // selected row also gets a surface fill.
    {
      orientation: 'horizontal',
      variant: 'underline',
      class: { list: 'border-b', tab: '-mb-px border-b-2 rounded-t-sm' },
    },
    {
      orientation: 'vertical',
      variant: 'underline',
      class: {
        list: 'border-r',
        tab: '-mr-px border-r-2 rounded-l-sm hover:bg-line-soft aria-selected:bg-surface-2',
      },
    },
    // Vertical rows keep their compact 36px height at the default size.
    { orientation: 'vertical', size: 'md', class: { tab: 'h-9' } },
  ],
  defaultVariants: { orientation: 'horizontal', variant: 'underline', size: 'md' },
})

export type TabsStyleProps = VariantProps<typeof tabsStyles>
