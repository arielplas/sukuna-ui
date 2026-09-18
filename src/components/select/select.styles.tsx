import { tv, type VariantProps } from '../../utils/tv'

export const selectStyles = tv({
  slots: {
    trigger: [
      'inline-flex items-center justify-between gap-2 min-w-40',
      'bg-surface-2 text-text border border-line rounded-md px-3 cursor-pointer',
      'transition-[border-color,box-shadow] duration-fast ease-sukuna',
      'data-[popup-open]:border-accent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      'disabled:opacity-45 disabled:cursor-not-allowed',
    ],
    icon: 'text-text-dim shrink-0',
    // z-index lives on the Positioner (the body-level portalled element); the Popup is nested
    // inside the Positioner's own stacking context, so a z-index there can't clear a dialog.
    positioner: 'z-[var(--sk-z-popover)]',
    popup: [
      // At least as wide as the trigger, never taller than the room Base UI measured on the
      // chosen side (both CSS vars are set on the Positioner) — so a Select near the bottom of the
      // viewport shrinks/flips instead of running off the page. 24rem = the previous fixed cap.
      'min-w-[var(--anchor-width,10rem)] max-h-[min(24rem,var(--available-height,24rem))] overflow-y-auto',
      'rounded-md border border-line bg-surface p-1 shadow-card',
      'transition-[opacity,transform] motion-reduce:transition-none duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
      'focus-visible:outline-none',
    ],
    item: [
      'flex items-center justify-between gap-2 h-9 px-2.5 rounded-sm text-sm text-text',
      // NB: no `content-visibility` here — deferring off-screen option layout breaks Base UI's
      // popup measurement/flip logic (verified: Playwright reported the popup outside the viewport).
      // Long option sets belong in a Combobox (searchable + capped) instead.
      'cursor-pointer select-none outline-none',
      // Keyboard highlight at ≥3:1 (WCAG 1.4.11) via a crimson inset ring — see Menu.
      'data-[highlighted]:bg-surface-2 data-[highlighted]:ring-1 data-[highlighted]:ring-inset data-[highlighted]:ring-focus-ring',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
    indicator: 'text-accent',
    placeholder: 'text-text-faint',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 text-sm' },
      md: { trigger: 'h-10 text-md' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SelectStyleProps = VariantProps<typeof selectStyles>
