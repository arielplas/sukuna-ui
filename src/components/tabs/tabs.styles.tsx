import { tv, type VariantProps } from '../../utils/tv'

export const tabsStyles = tv({
  slots: {
    root: 'w-full',
    list: 'flex',
    tab: [
      'relative inline-flex items-center font-medium cursor-pointer',
      'text-text-dim transition-colors duration-fast ease-sukuna hover:text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      // Base UI marks a disabled tab with data-disabled (no native `disabled` attr), so the plain
      // `disabled:` variant never fires — gate the dim/cursor styling on data-disabled too.
      'disabled:opacity-45 disabled:cursor-not-allowed data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    panel: 'pt-4 text-text focus-visible:outline-none',
  },
  variants: {
    variant: {
      underline: {
        list: 'border-b border-line',
        tab: [
          'border-b-2 border-transparent -mb-px rounded-t-sm',
          // Base UI marks the selected tab with aria-selected (there is no data-selected). Selected
          // reads crimson (text + underline) so it's unmistakable; `accent` clears AA as text.
          'aria-selected:text-accent aria-selected:border-accent',
        ],
      },
      // Segmented control: the track is `well` and the selected segment is `surface`, which is
      // lighter than its track in both themes (dark: #000 → #141416, light: #E8E5DD → #FFFFFF).
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
    // Declared after `variant` so `w-full` wins over the pill track's `w-fit`.
    fitted: {
      true: { list: 'w-full', tab: 'flex-1 justify-center' },
    },
  },
  defaultVariants: { variant: 'underline', size: 'md' },
})

export type TabsStyleProps = VariantProps<typeof tabsStyles>
