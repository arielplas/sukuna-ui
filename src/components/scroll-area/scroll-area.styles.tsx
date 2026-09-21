import { tv } from '../../utils/tv'

export const scrollAreaStyles = tv({
  slots: {
    root: 'relative overflow-hidden',
    viewport: [
      'h-full w-full rounded-[inherit] overscroll-contain',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
    scrollbar: [
      'flex touch-none select-none p-0.5 bg-transparent',
      'transition-colors duration-fast ease-sukuna hover:bg-surface-2',
      'data-[orientation=vertical]:w-2.5',
      'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col',
    ],
    thumb: 'flex-1 rounded-pill bg-line hover:bg-text-faint',
    corner: 'bg-transparent',
  },
})
