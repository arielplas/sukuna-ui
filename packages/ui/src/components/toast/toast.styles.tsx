import { tv } from '../../utils/tv'

// Stacked-deck toasts (docs/motion.md). Base UI exposes per-toast CSS vars:
// --toast-index (0 = newest), --toast-offset-y (distance when expanded), --toast-height,
// --toast-frontmost-height and --toast-swipe-movement-x/y; data-expanded is set while the stack is
// hovered/focused. Collapsed: older toasts peek above the newest, scaled down. Expanded: they fan
// out into a list. Swipe right/down dismisses. All CSS; reduced motion drops the transitions.
export const toastStyles = tv({
  slots: {
    viewport:
      'fixed bottom-4 right-4 z-[var(--sk-z-toast)] w-80 max-w-[calc(100vw-2rem)] outline-none',
    root: [
      'absolute right-0 bottom-0 w-full origin-bottom select-none',
      'rounded-md border border-line bg-surface p-4 pr-9 shadow-card text-text',
      // Deck geometry.
      '[--gap:0.5rem] [--peek:0.625rem]',
      '[--scale:calc(max(0,_1_-_var(--toast-index)_*_0.06))] [--shrink:calc(1_-_var(--scale))]',
      '[--height:var(--toast-frontmost-height,var(--toast-height))]',
      '[--offset-y:calc(var(--toast-offset-y)_*_-1_-_var(--toast-index)_*_var(--gap)_+_var(--toast-swipe-movement-y))]',
      'z-[calc(1000_-_var(--toast-index))] h-[var(--height)] data-[expanded]:h-[var(--toast-height)]',
      // Collapsed: peek + scale behind the newest. Expanded: fan out by measured offsets.
      '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)_-_var(--toast-index)_*_var(--peek)_-_var(--shrink)_*_var(--height)))_scale(var(--scale))]',
      'data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
      // Bridge the gaps so moving the pointer between expanded toasts doesn't collapse the stack.
      "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)_+_1px)] after:w-full after:content-['']",
      // Enter from below; leave downward, or in the swipe direction.
      'data-[starting-style]:[transform:translateY(150%)]',
      '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
      'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)_+_150%))]',
      'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)_+_150%))_translateY(var(--offset-y))]',
      'data-[ending-style]:opacity-0 data-[limited]:opacity-0',
      '[transition:transform_var(--sk-duration-slow)_var(--sk-ease),opacity_var(--sk-duration-slow)_var(--sk-ease),height_var(--sk-duration-fast)_var(--sk-ease)]',
      'motion-reduce:[transition:none]',
    ],
    // Content of toasts tucked behind the newest fades out so the deck reads as clean cards.
    content: [
      'transition-opacity motion-reduce:transition-none duration-base ease-sukuna',
      'data-[behind]:opacity-0 data-[expanded]:opacity-100',
    ],
    title: 'font-display text-sm font-bold tracking-tight',
    description: 'mt-1 text-sm text-text-dim',
    close: [
      'absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-sm',
      'text-text-dim hover:text-text hover:bg-line-soft cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    ],
  },
})
