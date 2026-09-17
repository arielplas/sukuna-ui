import { tv } from '../../utils/tv'

export const paginationStyles = tv({
  slots: {
    list: 'flex flex-wrap items-center gap-1 m-0 p-0 list-none',
    page: [
      'inline-flex size-9 items-center justify-center rounded-md text-sm cursor-pointer',
      'text-text-dim hover:bg-line-soft hover:text-text transition-colors duration-fast ease-sukuna',
      'data-[active]:bg-surface-2 data-[active]:text-text data-[active]:border data-[active]:border-line',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow',
    ],
    nav: [
      'inline-flex size-9 items-center justify-center rounded-md text-sm cursor-pointer',
      'text-text-dim hover:bg-line-soft hover:text-text transition-colors duration-fast ease-sukuna',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow',
      'disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-transparent',
    ],
    ellipsis: 'inline-flex size-9 items-center justify-center text-text-faint select-none',
  },
})
