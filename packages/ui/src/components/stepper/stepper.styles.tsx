import { tv, type VariantProps } from '../../utils/tv'

export const stepperStyles = tv({
  slots: {
    list: 'flex m-0 p-0 list-none',
    step: 'flex flex-1 items-center gap-3',
    indicator:
      'inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
    body: 'flex flex-col',
    label: 'text-sm font-medium',
    description: 'text-xs text-text-dim',
    connector: 'flex-1 rounded-pill',
  },
  variants: {
    orientation: {
      horizontal: { list: 'flex-row items-center gap-3', connector: 'h-0.5 min-w-8' },
      vertical: { list: 'flex-col gap-4', step: 'flex-none items-start', connector: 'hidden' },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type StepperStyleProps = VariantProps<typeof stepperStyles>
