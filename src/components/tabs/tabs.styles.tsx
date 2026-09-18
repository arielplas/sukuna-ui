import { tv } from '../../utils/tv'

export const tabsStyles = tv({
  slots: {
    root: 'w-full',
    list: 'flex border-b border-line',
    tab: [
      'relative inline-flex items-center h-10 px-3 text-sm font-medium -mb-px cursor-pointer',
      'text-text-dim border-b-2 border-transparent transition-colors duration-fast ease-sukuna',
      'hover:text-text data-[selected]:text-text data-[selected]:border-accent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-t-sm',
      'disabled:opacity-45 disabled:cursor-not-allowed',
    ],
    panel: 'pt-4 text-text focus-visible:outline-none',
  },
})
