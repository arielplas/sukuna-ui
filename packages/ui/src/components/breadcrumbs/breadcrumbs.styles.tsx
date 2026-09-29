import { tv } from '../../utils/tv'

export const breadcrumbsStyles = tv({
  slots: {
    list: 'flex flex-wrap items-center gap-2 text-sm m-0 p-0 list-none',
    item: 'inline-flex items-center gap-2',
    link: 'text-text-dim hover:text-text transition-colors duration-fast ease-sukuna rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    current: 'text-text font-medium',
    separator: 'text-text-faint select-none',
  },
})
