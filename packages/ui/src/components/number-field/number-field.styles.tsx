import { tv, type VariantProps } from '../../utils/tv'

export const numberFieldStyles = tv({
  slots: {
    group: [
      'inline-flex items-stretch overflow-hidden bg-surface-2 text-text border border-line',
      'transition-[border-color,box-shadow] duration-fast ease-sukuna',
      'focus-within:ring-2 focus-within:ring-focus-ring focus-within:border-accent',
      'has-[input:disabled]:opacity-45 has-[input:disabled]:cursor-not-allowed',
    ],
    input: [
      'min-w-0 flex-1 bg-transparent text-text tabular-nums text-center outline-none',
      'placeholder:text-text-faint',
      'disabled:cursor-not-allowed',
      // Hide the native spinner; the component supplies its own steppers.
      '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
    ],
    stepper: [
      'grid place-items-center shrink-0 text-text-dim cursor-pointer select-none',
      'transition-colors duration-fast ease-sukuna',
      'hover:bg-well hover:text-text',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring',
      'data-[disabled]:opacity-45 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent',
    ],
  },
  variants: {
    size: {
      sm: {
        group: 'h-8 rounded-sm text-sm',
        stepper: 'w-8',
      },
      md: {
        group: 'h-10 rounded-md text-md',
        stepper: 'w-9',
      },
      lg: {
        group: 'h-12 rounded-lg text-lg',
        stepper: 'w-11',
      },
    },
  },
  defaultVariants: { size: 'md' },
})

export type NumberFieldStyleProps = VariantProps<typeof numberFieldStyles>
