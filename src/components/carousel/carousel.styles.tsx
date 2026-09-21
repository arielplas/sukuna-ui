import { tv, type VariantProps } from '../../utils/tv'

/**
 * Slot class map for {@link Carousel}. Pure and server-safe. Colors/surfaces are inherited from the
 * slides; only structure, the transition (with a `motion-reduce` opt-out) and the control chrome are
 * defined here.
 */
export const carouselStyles = tv({
  slots: {
    root: 'relative',
    viewport: 'overflow-hidden',
    track: 'flex transition-transform duration-base ease-sukuna motion-reduce:transition-none',
    slide: 'shrink-0 grow-0 basis-full',
    controls: 'pointer-events-none absolute inset-0 flex items-center justify-between px-2',
    control:
      'pointer-events-auto inline-flex size-10 items-center justify-center rounded-full bg-surface-2 text-text border border-line cursor-pointer transition-colors duration-fast ease-sukuna hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-45 disabled:cursor-not-allowed',
    footer: 'mt-3 flex items-center justify-center gap-3',
    dots: 'flex items-center gap-2',
    dot: 'size-2 rounded-full bg-line cursor-pointer transition-colors duration-fast ease-sukuna hover:bg-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    playToggle:
      'inline-flex size-7 items-center justify-center rounded-full text-text-dim cursor-pointer hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
  },
  variants: {
    active: { true: { dot: 'bg-accent hover:bg-accent' } },
  },
})

export type CarouselStyleProps = VariantProps<typeof carouselStyles>
