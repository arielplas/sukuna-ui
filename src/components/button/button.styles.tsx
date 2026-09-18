import { tv, type VariantProps } from '../../utils/tv'

export const buttonStyles = tv({
  base: [
    'inline-flex items-center justify-center gap-2 select-none',
    'font-display font-bold tracking-tight',
    'transition-[background-color,box-shadow,transform] motion-reduce:transition-none duration-fast ease-sukuna',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'active:scale-[.98] motion-reduce:active:scale-100',
    'disabled:opacity-45 disabled:cursor-not-allowed',
    'aria-busy:cursor-progress',
  ],
  variants: {
    variant: {
      primary:
        'bg-gradient-accent text-on-accent hover:brightness-110 hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]',
      secondary: 'bg-surface-2 text-text border border-line hover:bg-well',
      ghost: 'bg-transparent text-text-dim hover:text-text hover:bg-line-soft',
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded-sm',
      md: 'h-10 px-5 text-md rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
    },
    fullWidth: { true: 'w-full' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonStyleProps = VariantProps<typeof buttonStyles>
