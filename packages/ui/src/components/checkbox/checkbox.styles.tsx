import { tv, type VariantProps } from '../../utils/tv'

export const checkboxStyles = tv({
  base: [
    'accent-accent cursor-pointer rounded-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-45 disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
})

/** Wrapper rendered only when `label` is given: a real `<label>` so a click on the text toggles. */
export const checkboxLabelStyles = tv({
  slots: {
    root: [
      'inline-flex items-center gap-2 cursor-pointer select-none text-text',
      'has-[:disabled]:cursor-not-allowed has-[:disabled]:text-text-dim',
    ],
    text: '',
  },
  variants: {
    size: {
      sm: { text: 'text-sm' },
      md: { text: 'text-md' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type CheckboxStyleProps = VariantProps<typeof checkboxStyles>
