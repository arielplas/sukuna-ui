import { tv } from '../../utils/tv'

// Shared with the core chrome: the player root is `group/vp` and pins data-theme="dark".
const ring =
  'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring vp:focus-visible:ring-offset-2 vp:focus-visible:ring-offset-well'

/**
 * Slot class map for the VideoPlayer parts (panel, up next, end screen, share, skip). Pure and
 * server-safe. Parts render inside the player's parts layer, so tokens resolve to the dark palette.
 */
export const videoPlayerPartsStyles = tv({
  slots: {
    // ── side panel ──
    panel: [
      'vp:absolute vp:top-0 vp:right-0 vp:bottom-16 vp:z-20 vp:grid vp:w-[min(21.25rem,44%)] vp:grid-rows-[auto_1fr] vp:rounded-bl-md',
      'vp:border-b vp:border-l vp:border-line vp:bg-surface/95 vp:backdrop-blur-md',
      'vp:transition-[translate] vp:duration-slow vp:ease-sukuna vp:motion-reduce:transition-none vp:starting:translate-x-full',
      'vp:@max-[30rem]:bottom-14 vp:@max-[30rem]:w-full',
    ],
    panelHead:
      'vp:flex vp:items-center vp:gap-1 vp:border-b vp:border-line-soft vp:ps-3 vp:pe-2 vp:pt-2',
    tabs: 'vp:flex vp:min-w-0 vp:flex-1 vp:gap-0.5',
    tab: [
      'vp:relative vp:h-9.5 vp:rounded-t-[6px] vp:px-2.5 vp:font-display vp:text-md vp:font-bold vp:text-text-dim vp:cursor-pointer',
      'vp:hover:text-text vp:aria-selected:text-text',
      "vp:aria-selected:after:absolute vp:aria-selected:after:inset-x-2.5 vp:aria-selected:after:-bottom-px vp:aria-selected:after:h-0.5 vp:aria-selected:after:rounded-pill vp:aria-selected:after:bg-accent vp:aria-selected:after:content-['']",
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-inset vp:focus-visible:ring-focus-ring',
    ],
    list: 'vp:grid vp:content-start vp:gap-0.5 vp:overflow-auto vp:p-1.5',
    item: [
      'vp:relative vp:grid vp:w-full vp:grid-cols-[5rem_1fr] vp:items-center vp:gap-2.5 vp:rounded-sm vp:p-1.5 vp:text-left vp:text-text vp:cursor-pointer',
      'vp:hover:bg-line-soft vp:aria-[current=true]:bg-accent/10',
      "vp:aria-[current=true]:before:absolute vp:aria-[current=true]:before:inset-y-2.5 vp:aria-[current=true]:before:left-0 vp:aria-[current=true]:before:w-[3px] vp:aria-[current=true]:before:rounded-[3px] vp:aria-[current=true]:before:bg-accent vp:aria-[current=true]:before:content-['']",
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-inset vp:focus-visible:ring-focus-ring',
    ],
    thumbWrap: 'vp:relative',
    thumb: 'vp:block vp:aspect-video vp:w-20 vp:rounded-[6px] vp:bg-well vp:object-cover',
    thumbIndex:
      'vp:grid vp:aspect-video vp:w-20 vp:place-items-center vp:rounded-[6px] vp:bg-surface-2 vp:font-display vp:text-md vp:font-bold vp:text-text-dim',
    duration:
      'vp:absolute vp:right-1 vp:bottom-1 vp:rounded-[4px] vp:bg-well/80 vp:px-1 vp:text-[10px] vp:tabular-nums vp:text-text',
    meta: 'vp:grid vp:min-w-0 vp:gap-px',
    metaTitle: 'vp:truncate vp:text-md vp:font-semibold',
    metaSub: 'vp:text-sm vp:tabular-nums vp:text-text-dim',
    line: [
      'vp:grid vp:w-full vp:grid-cols-[2.75rem_1fr] vp:gap-2 vp:rounded-sm vp:px-2 vp:py-1.5 vp:text-left vp:text-md vp:leading-normal vp:text-text-dim vp:cursor-pointer',
      'vp:hover:bg-line-soft vp:aria-[current=true]:bg-accent/10 vp:aria-[current=true]:text-text',
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-inset vp:focus-visible:ring-focus-ring',
    ],
    lineTime: 'vp:pt-px vp:text-sm vp:tabular-nums vp:text-accent',
    iconButton: [
      'vp:grid vp:size-9 vp:shrink-0 vp:place-items-center vp:rounded-md vp:text-text vp:cursor-pointer vp:hover:bg-line-soft vp:[&_svg]:size-5',
      ring,
    ],
    // ── floating cards ──
    card: [
      'vp:absolute vp:right-4 vp:bottom-22 vp:z-10 vp:rounded-md vp:border vp:border-line vp:bg-surface/95 vp:shadow-card',
      'vp:transition-[bottom,opacity,scale] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:starting:scale-95 vp:starting:opacity-0 vp:group-data-[controls=hidden]/vp:bottom-5',
      // Beside an open side panel instead of under it; a full-width compact panel hides them.
      'vp:group-data-[panel=open]/vp:right-[calc(min(21.25rem,44%)+1rem)]',
      'vp:@max-[30rem]:bottom-18 vp:@max-[30rem]:group-data-[panel=open]/vp:hidden',
    ],
    upNext:
      'vp:grid vp:w-70 vp:grid-cols-[6rem_1fr] vp:gap-2.5 vp:p-2.5 vp:@max-[30rem]:inset-x-2.5 vp:@max-[30rem]:w-auto',
    upNextThumb: 'vp:relative',
    upNextImage: 'vp:block vp:aspect-video vp:w-24 vp:rounded-[6px] vp:bg-well vp:object-cover',
    ring: 'vp:absolute vp:inset-0 vp:m-auto vp:size-7.5',
    ringTrack: 'vp:fill-well/60 vp:stroke-text/25',
    ringValue: 'vp:fill-none vp:stroke-accent',
    ringText: 'vp:fill-text vp:text-[11px] vp:font-bold',
    eyebrow: 'vp:text-xs vp:font-bold vp:tracking-eyebrow vp:text-text-dim vp:uppercase',
    upNextTitle: 'vp:truncate vp:font-display vp:text-md vp:font-bold',
    actions: 'vp:col-span-2 vp:flex vp:gap-1.5 vp:[&>*]:flex-1',
    skip: [
      'vp:inline-flex vp:h-9 vp:items-center vp:gap-2 vp:px-3.5 vp:font-display vp:text-md vp:font-bold vp:text-text vp:cursor-pointer',
      'vp:hover:bg-surface-2 vp:active:scale-[.98] vp:[&_svg]:size-4',
      ring,
    ],
    // ── covers (end screen, share) ──
    cover:
      'vp:absolute vp:inset-0 vp:z-20 vp:grid vp:place-items-center vp:overflow-auto vp:bg-well/75 vp:p-5 vp:backdrop-blur-sm vp:@max-[30rem]:p-3',
    coverCard: 'vp:grid vp:w-full vp:max-w-[32.5rem] vp:gap-3.5 vp:@max-[30rem]:gap-2.5',
    coverHead: 'vp:flex vp:items-center vp:justify-between vp:gap-2',
    heading: 'vp:font-display vp:text-xl vp:font-bold vp:tracking-tight vp:@max-[30rem]:text-lg',
    related: 'vp:grid vp:grid-cols-3 vp:gap-2.5 vp:@max-[30rem]:grid-cols-2',
    relatedItem: [
      'vp:grid vp:content-start vp:gap-1.5 vp:rounded-sm vp:text-left vp:text-text vp:cursor-pointer',
      'vp:[&:hover_img]:ring-2 vp:[&:hover_img]:ring-accent',
      ring,
    ],
    relatedImage:
      'vp:block vp:aspect-video vp:w-full vp:rounded-sm vp:bg-surface-2 vp:object-cover vp:ring-1 vp:ring-line',
    relatedTitle: 'vp:text-sm vp:font-semibold vp:leading-tight',
    relatedSub: 'vp:text-xs vp:tabular-nums vp:text-text-dim',
    buttons: 'vp:flex vp:flex-wrap vp:gap-1.5',
    primary: [
      'vp:h-9 vp:rounded-md vp:bg-gradient-accent vp:px-4 vp:font-display vp:text-md vp:font-bold vp:text-on-accent vp:cursor-pointer',
      'vp:hover:brightness-110 vp:active:scale-[.98]',
      ring,
    ],
    secondary: [
      'vp:h-9 vp:rounded-md vp:border vp:border-line vp:bg-surface-2 vp:px-3.5 vp:font-display vp:text-md vp:font-bold vp:text-text vp:cursor-pointer',
      'vp:hover:bg-well vp:active:scale-[.98]',
      ring,
    ],
    close: [
      'vp:absolute vp:top-3 vp:right-3 vp:grid vp:size-9 vp:place-items-center vp:rounded-md vp:text-text vp:cursor-pointer vp:hover:bg-line-soft vp:[&_svg]:size-5',
      ring,
    ],
    field: 'vp:flex vp:gap-2',
    input: [
      'vp:h-9 vp:min-w-0 vp:flex-1 vp:rounded-md vp:border vp:border-line vp:bg-surface-2 vp:px-3 vp:text-md vp:text-text',
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring',
    ],
    check:
      'vp:inline-flex vp:items-center vp:gap-2 vp:text-md vp:text-text-dim vp:[&_input]:size-4 vp:[&_input]:accent-accent',
    embed: [
      'vp:h-16 vp:w-full vp:resize-none vp:rounded-md vp:border vp:border-line vp:bg-surface-2 vp:px-3 vp:py-2.5 vp:font-mono vp:text-sm vp:text-text-dim',
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring',
    ],
    label: 'vp:text-sm vp:font-semibold vp:text-text-dim',
    // ── overlay ──
    overlay: [
      'vp:absolute vp:z-10 vp:transition-[opacity,scale] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:starting:scale-95 vp:starting:opacity-0',
    ],
    overlayCard:
      'vp:max-w-[min(20rem,calc(100%-2rem))] vp:rounded-md vp:border vp:border-line vp:bg-surface/95 vp:p-3 vp:pe-10 vp:text-md vp:text-text vp:shadow-card',
    overlayBanner:
      'vp:inset-x-0 vp:bottom-16 vp:border-y vp:border-line-soft vp:bg-well/80 vp:px-4 vp:py-2 vp:text-md vp:text-text vp:backdrop-blur-sm',
    overlayPlain: '',
    overlayClose: [
      'vp:absolute vp:top-1.5 vp:right-1.5 vp:grid vp:size-7 vp:place-items-center vp:rounded-sm vp:text-text-dim vp:cursor-pointer',
      'vp:hover:bg-line-soft vp:hover:text-text vp:[&_svg]:size-4',
      ring,
    ],
    // ── audio ──
    audio: [
      'vp:pointer-events-none vp:absolute vp:inset-0 vp:grid vp:grid-cols-[auto_1fr] vp:items-center vp:gap-6 vp:px-7 vp:pt-7 vp:pb-24',
      'vp:bg-radial-[ellipse_at_20%_40%] vp:from-accent-deep/40 vp:to-well vp:to-70%',
      'vp:@max-[30rem]:gap-3.5 vp:@max-[30rem]:px-4 vp:@max-[30rem]:pt-4 vp:@max-[30rem]:pb-18',
    ],
    art: 'vp:aspect-square vp:w-[clamp(5rem,26cqw,10.5rem)] vp:rounded-md vp:bg-surface-2 vp:object-cover vp:shadow-card',
    artFallback:
      'vp:grid vp:aspect-square vp:w-[clamp(5rem,26cqw,10.5rem)] vp:place-items-center vp:rounded-md vp:bg-gradient-accent vp:font-display vp:text-3xl vp:font-black vp:text-on-accent vp:shadow-[0_20px_40px_-12px_var(--vp-color-accent-glow)]',
    audioMeta: 'vp:grid vp:min-w-0 vp:content-center vp:gap-3.5',
    audioTitle:
      'vp:truncate vp:font-display vp:text-xl vp:font-bold vp:tracking-tight vp:@max-[30rem]:text-lg',
    audioArtist: 'vp:truncate vp:text-md vp:text-text-dim',
    visualizer: 'vp:h-[clamp(3rem,22cqw,8rem)] vp:w-full',
  },
  variants: {
    placement: {
      'top-left': { overlay: 'vp:top-16 vp:left-4' },
      'top-right': { overlay: 'vp:top-16 vp:right-4' },
      'bottom-left': { overlay: 'vp:bottom-22 vp:left-4' },
      'bottom-right': { overlay: 'vp:right-4 vp:bottom-22' },
      center: { overlay: 'vp:top-1/2 vp:left-1/2 vp:-translate-1/2' },
    },
  },
})
