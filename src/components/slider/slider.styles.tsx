import { tv } from '../../utils/tv'

export const sliderStyles = tv({
  slots: {
    root: 'relative w-full select-none touch-none data-[disabled]:opacity-45',
    control: 'flex w-full items-center py-2',
    track: 'relative h-1.5 w-full rounded-pill bg-surface-2',
    indicator: 'absolute h-full rounded-pill bg-accent',
    thumb:
      'size-4 rounded-full bg-text border border-line shadow-sm cursor-grab data-[dragging]:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  },
})
