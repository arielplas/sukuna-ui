import { tv } from '../../utils/tv'

// Kept intentionally in parity with `menu.styles.tsx` (duplicated, not shared, to avoid coupling
// the two client bundles). If one changes, mirror it in the other.
export const contextMenuStyles = tv({
  slots: {
    // The long-press / right-click target. `select-none` + `[-webkit-touch-callout:none]` stop iOS
    // Safari from starting text selection or the native callout on long-press, which otherwise
    // fights Base UI's long-press detection. `display: contents` keeps the wrapper from changing
    // the consumer's layout.
    trigger: 'contents select-none [-webkit-touch-callout:none]',
    // z-index on the body-level portalled positioner, above the dialog layer — see Menu.
    positioner: 'z-[var(--sk-z-popover)]',
    popup: [
      'min-w-40 rounded-md border border-line bg-surface p-1 shadow-card outline-none',
      'transition-[opacity,transform] motion-reduce:transition-none duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
    item: [
      'flex items-center gap-2 h-9 px-2.5 rounded-sm text-sm text-text cursor-pointer outline-none select-none',
      '[content-visibility:auto] [contain-intrinsic-size:auto_36px]',
      'data-[highlighted]:bg-surface-2 data-[highlighted]:ring-1 data-[highlighted]:ring-inset data-[highlighted]:ring-focus-ring',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
  },
})
