import { tv } from '../../utils/tv'

export const menuStyles = tv({
  slots: {
    // z-index on the Positioner (body-level portalled element), above the dialog layer — see Select.
    positioner: 'z-[var(--sk-z-popover)]',
    popup: [
      'min-w-40 rounded-md border border-line bg-surface p-1 shadow-card outline-none',
      'transition-[opacity,transform] duration-fast ease-sukuna',
      'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
      'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
    ],
    item: [
      'flex items-center gap-2 h-9 px-2.5 rounded-sm text-sm text-text cursor-pointer outline-none select-none',
      // Keyboard highlight must clear 3:1 (WCAG 1.4.11); a crimson inset ring reads clearly and,
      // unlike a text-color change, never collides with a selected item's own color.
      'data-[highlighted]:bg-surface-2 data-[highlighted]:ring-1 data-[highlighted]:ring-inset data-[highlighted]:ring-focus-ring',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed',
    ],
  },
})
