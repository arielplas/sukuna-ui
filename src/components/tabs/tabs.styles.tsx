import { tv } from '../../utils/tv'

export const tabsStyles = tv({
  slots: {
    root: 'w-full',
    list: 'flex border-b border-line',
    tab: [
      'relative inline-flex items-center h-10 px-3 text-sm font-medium -mb-px cursor-pointer',
      'text-text-dim border-b-2 border-transparent transition-colors duration-fast ease-sukuna',
      // Base UI marks the selected tab with aria-selected (there is no data-selected) — key the
      // active styling off it. Selected tab reads crimson (text + underline) so it's unmistakable;
      // `accent` clears AA as text on the page/surface backgrounds tabs sit on.
      'hover:text-text aria-selected:text-accent aria-selected:border-accent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-t-sm',
      // Base UI marks a disabled tab with data-disabled (no native `disabled` attr), so the plain
      // `disabled:` variant never fires — gate the dim/cursor styling on data-disabled too.
      'disabled:opacity-45 disabled:cursor-not-allowed data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    panel: 'pt-4 text-text focus-visible:outline-none',
  },
})
