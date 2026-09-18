import { tv, type VariantProps } from '../../utils/tv'

export const fieldStyles = tv({
  slots: {
    // The field container: label, control, description and error stacked with a small gap.
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-text',
    // Layout only — the control (e.g. our Input) brings its own visual styling.
    control: 'w-full',
    description: 'text-sm text-text-dim',
    // Sukuna has one red; it is the danger tone for validation errors.
    error: 'text-sm text-accent',
  },
})

export type FieldStyleProps = VariantProps<typeof fieldStyles>
