import { tv, type VariantProps } from '../../utils/tv'

export const buttonStyles = tv({
  base: [
    'inline-flex items-center justify-center gap-2 select-none',
    'font-display font-bold tracking-tight',
    // `scale` (not `transform`) so the active press actually animates in Tailwind v4.
    'transition-[background-color,box-shadow,scale] motion-reduce:transition-none duration-fast ease-sukuna',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'active:scale-[.98] motion-reduce:active:scale-100',
    'cursor-pointer',
    'disabled:opacity-45 disabled:cursor-not-allowed',
    // Anchors can't be `:disabled`; mirror the disabled look and block activation via aria-disabled.
    'aria-disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
    'aria-busy:cursor-progress',
  ],
  variants: {
    variant: {
      primary:
        'bg-gradient-accent text-on-accent hover:brightness-110 hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]',
      secondary: 'bg-surface-2 text-text border border-line hover:bg-well',
      ghost: 'bg-transparent text-text-dim hover:text-text hover:bg-line-soft',
      // Border only — a quieter alternative to secondary on busy or tinted surfaces.
      outline: 'bg-transparent text-text border border-line hover:bg-line-soft',
      // Inline text action: crimson label, underline on hover; height/padding reset below.
      link: 'bg-transparent text-accent underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded-sm',
      md: 'h-10 px-5 text-md rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
    },
    fullWidth: { true: 'w-full' },
    iconOnly: { true: 'px-0' },
  },
  compoundVariants: [
    // A link sits in running text: no control height, no horizontal padding.
    { variant: 'link', class: 'h-auto px-0' },
    // Icon-only buttons are square at every size.
    { iconOnly: true, size: 'sm', class: 'w-8' },
    { iconOnly: true, size: 'md', class: 'w-10' },
    { iconOnly: true, size: 'lg', class: 'w-12' },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonStyleProps = VariantProps<typeof buttonStyles>
