import { tv, type VariantProps } from '../../utils/tv'

// Shared focus ring for every control on the dark chrome.
const ring =
  'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring vp:focus-visible:ring-offset-2 vp:focus-visible:ring-offset-well'

// Chrome that fades with the controls (`data-controls="hidden"` on the root, group `vp`).
const fades =
  'vp:transition-opacity vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none vp:group-data-[controls=hidden]/vp:pointer-events-none vp:group-data-[controls=hidden]/vp:opacity-0'

/**
 * Slot class map for {@link VideoPlayer}. Pure and server-safe. The root pins
 * `data-theme="dark"`, so every token below resolves to the dark palette even in a light app.
 * Positional values (played / buffered widths, preview offset, sprite position) are inline styles;
 * everything themable is a token utility.
 */
export const videoPlayerStyles = tv({
  slots: {
    root: [
      'vp:group/vp vp:@container vp:relative vp:w-full vp:max-w-full vp:overflow-hidden vp:select-none',
      // Native scrollbars and form controls inside the chrome follow the dark palette too.
      'vp:rounded-lg vp:bg-well vp:text-text vp:shadow-card vp:font-sans vp:text-sm vp:[color-scheme:dark]',
      'vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring vp:focus-visible:ring-offset-2 vp:focus-visible:ring-offset-bg',
      'vp:data-[controls=hidden]:cursor-none',
    ],
    video: 'vp:absolute vp:inset-0 vp:size-full vp:object-contain vp:bg-well',
    scrimTop: `vp:pointer-events-none vp:absolute vp:inset-x-0 vp:top-0 vp:h-[28%] vp:bg-linear-to-b vp:from-well/70 vp:to-transparent ${fades}`,
    scrimBottom: `vp:pointer-events-none vp:absolute vp:inset-x-0 vp:bottom-0 vp:h-[48%] vp:bg-linear-to-t vp:from-well/90 vp:via-well/40 vp:to-transparent ${fades}`,
    top: `vp:absolute vp:inset-x-0 vp:top-0 vp:flex vp:items-start vp:gap-3 vp:px-5 vp:pt-3.5 vp:@max-[30rem]:px-3.5 vp:@max-[30rem]:pt-2.5 ${fades}`,
    titleWrap: 'vp:min-w-0 vp:flex-1 vp:pt-0.5',
    title:
      'vp:truncate vp:font-display vp:text-lg vp:font-bold vp:tracking-tight vp:text-text vp:@max-[30rem]:text-md',
    info: 'vp:truncate vp:text-sm vp:text-text-dim',
    logo: 'vp:block vp:h-6 vp:w-auto vp:opacity-80 vp:transition-opacity vp:duration-fast vp:hover:opacity-100',
    logoLink: `vp:shrink-0 vp:rounded-sm ${ring}`,
    center: 'vp:pointer-events-none vp:absolute vp:inset-0 vp:grid vp:place-items-center',
    bigPlay: [
      'vp:pointer-events-auto vp:grid vp:size-16 vp:place-items-center vp:rounded-full vp:cursor-pointer',
      'vp:bg-gradient-accent vp:text-on-accent vp:shadow-[0_0_28px_6px_var(--vp-color-accent-glow)]',
      'vp:transition-[scale,filter] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:hover:scale-105 vp:hover:brightness-110 vp:active:scale-[.98] vp:[&_svg]:ml-0.5 vp:[&_svg]:size-7',
      'vp:@max-[30rem]:size-13 vp:@max-[30rem]:[&_svg]:size-5.5',
      ring,
    ],
    // Indeterminate ring (the wrapper is the role=status live region); the spin stops under
    // reduced motion, the static ring stays.
    spinner:
      'vp:inline-flex vp:text-accent vp:[&_svg]:size-10 vp:[&_svg]:animate-spin vp:motion-reduce:[&_svg]:animate-none',
    errorPanel:
      'vp:pointer-events-auto vp:grid vp:max-w-80 vp:justify-items-center vp:gap-3 vp:px-5 vp:text-center vp:[&>svg]:size-8',
    errorTitle: 'vp:font-display vp:text-md vp:font-bold',
    errorBody: 'vp:text-sm vp:text-text-dim',
    retry: [
      'vp:h-8 vp:rounded-sm vp:border vp:border-line vp:bg-surface-2 vp:px-3 vp:cursor-pointer',
      'vp:font-display vp:text-sm vp:font-bold vp:text-text vp:hover:bg-well',
      ring,
    ],
    captionWrap: [
      'vp:pointer-events-none vp:absolute vp:inset-x-0 vp:bottom-22 vp:flex vp:justify-center vp:px-[10%] vp:text-center',
      'vp:transition-[bottom] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:group-data-[controls=hidden]/vp:bottom-6 vp:@max-[30rem]:bottom-18',
    ],
    caption:
      'vp:whitespace-pre-line vp:rounded-[6px] vp:px-2.5 vp:py-0.5 vp:leading-[1.35] vp:[box-decoration-break:clone]',
    parts: 'vp:pointer-events-none vp:absolute vp:inset-0 vp:[&>*]:pointer-events-auto',
    bar: `vp:absolute vp:inset-x-0 vp:bottom-0 vp:grid vp:gap-0.5 vp:px-3 vp:pb-2.5 vp:@max-[30rem]:px-1.5 vp:@max-[30rem]:pb-1.5 ${fades}`,
    seek: [
      'vp:group/seek vp:relative vp:mx-1.5 vp:flex vp:h-5 vp:cursor-pointer vp:touch-none vp:items-center vp:rounded-sm vp:outline-none',
      'vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring',
    ],
    segments: 'vp:flex vp:h-2 vp:w-full vp:items-center vp:gap-[3px]',
    segment: [
      'vp:relative vp:h-1 vp:overflow-hidden vp:rounded-pill vp:bg-text/20',
      'vp:transition-[height] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:group-hover/seek:h-[5px] vp:group-data-[dragging]/seek:h-[5px]',
    ],
    buffered: 'vp:absolute vp:inset-y-0 vp:left-0 vp:bg-text/35',
    loopRange:
      'vp:pointer-events-none vp:absolute vp:top-1/2 vp:-mt-1.5 vp:h-3 vp:rounded-[3px] vp:border-x-2 vp:border-premium vp:bg-premium/15',
    played: 'vp:absolute vp:inset-y-0 vp:left-0 vp:bg-accent',
    thumb: [
      'vp:pointer-events-none vp:absolute vp:top-1/2 vp:-mt-[7px] vp:-ml-[7px] vp:size-3.5 vp:rounded-full vp:bg-accent vp:scale-0',
      'vp:transition-[scale,box-shadow] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:group-hover/seek:scale-100 vp:group-focus-visible/seek:scale-100 vp:group-data-[dragging]/seek:scale-100',
      'vp:group-data-[dragging]/seek:shadow-[0_0_0_5px_var(--vp-color-accent-glow)]',
    ],
    preview: [
      'vp:pointer-events-none vp:absolute vp:bottom-6.5 vp:grid vp:-translate-x-1/2 vp:justify-items-center vp:gap-1 vp:opacity-0',
      'vp:transition-opacity vp:duration-fast vp:motion-reduce:transition-none',
      'vp:group-hover/seek:opacity-100 vp:group-data-[dragging]/seek:opacity-100',
    ],
    previewImage:
      'vp:h-[90px] vp:w-40 vp:rounded-sm vp:bg-well vp:bg-no-repeat vp:shadow-card vp:@max-[30rem]:h-[68px] vp:@max-[30rem]:w-30',
    previewChapter:
      'vp:max-w-44 vp:truncate vp:text-center vp:font-display vp:text-sm vp:font-bold vp:[text-shadow:0_1px_4px_var(--vp-color-well)]',
    previewTime:
      'vp:rounded-[6px] vp:border vp:border-line vp:bg-surface-2 vp:px-1.5 vp:py-px vp:text-xs vp:tabular-nums',
    row: 'vp:flex vp:min-w-0 vp:items-center vp:gap-0.5',
    spacer: 'vp:min-w-1 vp:flex-1',
    button: [
      'vp:relative vp:grid vp:size-9 vp:shrink-0 vp:place-items-center vp:rounded-md vp:text-text vp:cursor-pointer',
      'vp:transition-[background-color,scale] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:hover:bg-line-soft vp:active:scale-95 vp:[&_svg]:size-5',
      'vp:@max-[30rem]:size-8 vp:@max-[30rem]:[&_svg]:size-4.5',
      "vp:aria-pressed:after:absolute vp:aria-pressed:after:inset-x-2.5 vp:aria-pressed:after:bottom-1.5 vp:aria-pressed:after:h-0.5 vp:aria-pressed:after:rounded-pill vp:aria-pressed:after:bg-accent vp:aria-pressed:after:content-['']",
      ring,
    ],
    compactHidden: 'vp:@max-[30rem]:hidden',
    midHidden: 'vp:@max-[40rem]:hidden',
    hdBadge:
      'vp:absolute vp:top-1 vp:right-0.5 vp:rounded-[3px] vp:bg-accent vp:px-0.5 vp:font-display vp:text-[8px] vp:leading-[11px] vp:font-black vp:text-on-accent',
    time: 'vp:whitespace-nowrap vp:ps-2 vp:pe-1 vp:text-sm vp:tabular-nums vp:@max-[30rem]:ps-1 vp:@max-[30rem]:text-xs',
    timeDim: 'vp:text-text-dim',
    chapterButton: [
      'vp:inline-flex vp:h-7.5 vp:min-w-0 vp:items-center vp:gap-1 vp:rounded-sm vp:ps-2 vp:pe-1.5 vp:text-sm vp:cursor-pointer vp:@max-[30rem]:hidden',
      'vp:hover:bg-line-soft vp:[&_svg]:size-3.5 vp:[&_svg]:shrink-0 vp:[&_svg]:text-text-dim',
      ring,
    ],
    chapterName: 'vp:truncate vp:font-semibold',
    chapterDot: 'vp:text-text-dim',
    volumeGroup: 'vp:group/vol vp:flex vp:items-center',
    volumeSlide: [
      'vp:flex vp:h-9 vp:w-0 vp:items-center vp:overflow-hidden',
      'vp:transition-[width] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:group-hover/vol:w-20 vp:group-focus-within/vol:w-20 vp:@max-[30rem]:hidden',
    ],
    volumeTrack: [
      'vp:relative vp:ms-1.5 vp:me-2.5 vp:h-1 vp:w-16 vp:shrink-0 vp:cursor-pointer vp:rounded-pill vp:bg-text/20 vp:outline-none',
      'vp:focus-visible:ring-2 vp:focus-visible:ring-focus-ring vp:focus-visible:ring-offset-2 vp:focus-visible:ring-offset-well',
    ],
    volumeFill: 'vp:absolute vp:inset-y-0 vp:left-0 vp:rounded-pill vp:bg-text',
    volumeThumb:
      'vp:absolute vp:top-1/2 vp:-mt-1.5 vp:-ml-1.5 vp:size-3 vp:rounded-full vp:bg-text',
    menu: [
      'vp:absolute vp:right-3 vp:bottom-16 vp:z-10 vp:grid vp:w-65 vp:max-h-[calc(100%-5.25rem)] vp:content-start vp:overflow-auto vp:p-1',
      'vp:rounded-md vp:border vp:border-line vp:bg-surface/95 vp:shadow-card',
      'vp:origin-bottom-right vp:transition-[opacity,scale] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:starting:scale-95 vp:starting:opacity-0',
      'vp:@max-[30rem]:inset-x-1.5 vp:@max-[30rem]:bottom-14 vp:@max-[30rem]:w-auto',
    ],
    menuHead:
      'vp:mb-1 vp:flex vp:items-center vp:gap-1.5 vp:border-b vp:border-line-soft vp:px-1 vp:pt-1 vp:pb-1.5',
    menuHeadTitle: 'vp:font-display vp:text-md vp:font-bold',
    menuBack: [
      'vp:grid vp:size-7 vp:place-items-center vp:rounded-sm vp:cursor-pointer vp:hover:bg-line-soft vp:[&_svg]:size-4',
      ring,
    ],
    menuLabel:
      'vp:px-2.5 vp:pt-2 vp:pb-1 vp:text-xs vp:font-bold vp:tracking-eyebrow vp:text-text-dim vp:uppercase',
    menuItem: [
      'vp:flex vp:min-h-8.5 vp:w-full vp:items-center vp:gap-2.5 vp:rounded-sm vp:px-2.5 vp:py-1.5 vp:text-left vp:text-md vp:tabular-nums vp:text-text vp:cursor-pointer',
      'vp:hover:bg-line-soft vp:focus-visible:bg-line-soft vp:focus-visible:outline-none vp:focus-visible:ring-2 vp:focus-visible:ring-inset vp:focus-visible:ring-focus-ring',
      'vp:[&>svg]:size-4.5 vp:[&>svg]:shrink-0 vp:[&>svg]:text-text-dim',
    ],
    menuValue:
      'vp:ms-auto vp:inline-flex vp:items-center vp:gap-1 vp:text-sm vp:text-text-dim vp:[&_svg]:size-3.5 vp:[&_svg]:text-text-dim',
    menuTick:
      'vp:invisible vp:w-3.5 vp:shrink-0 vp:text-accent vp:[&_svg]:size-3.5 vp:group-aria-checked/item:visible',
    hdTag: 'vp:font-display vp:text-[9px] vp:font-black vp:text-accent',
    chips: 'vp:flex vp:flex-wrap vp:gap-1.5 vp:px-2.5 vp:pt-1 vp:pb-2',
    chip: [
      'vp:h-6.5 vp:rounded-pill vp:border vp:border-line vp:px-2.5 vp:text-sm vp:text-text vp:cursor-pointer',
      'vp:aria-checked:border-accent vp:aria-checked:bg-accent/15',
      ring,
    ],
    swatch: 'vp:mx-auto vp:block vp:size-3.5 vp:rounded-full vp:ring-1 vp:ring-line',
    switch: [
      'vp:relative vp:ms-auto vp:h-4.5 vp:w-7.5 vp:shrink-0 vp:rounded-pill vp:bg-text/20 vp:transition-colors vp:duration-fast',
      'vp:group-aria-checked/item:bg-accent',
      "vp:after:absolute vp:after:top-0.5 vp:after:left-0.5 vp:after:size-3.5 vp:after:rounded-full vp:after:bg-text vp:after:content-['']",
      'vp:after:transition-[translate] vp:after:duration-base vp:after:ease-spring vp:motion-reduce:after:transition-none',
      'vp:group-aria-checked/item:after:translate-x-3',
    ],
    toast: [
      'vp:pointer-events-none vp:absolute vp:top-4 vp:left-1/2 vp:z-30 vp:-translate-x-1/2 vp:rounded-md vp:border vp:border-line',
      'vp:bg-surface/95 vp:px-3.5 vp:py-2 vp:text-md vp:text-text vp:shadow-card',
      'vp:transition-[opacity,scale] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none vp:starting:scale-95 vp:starting:opacity-0',
    ],
    live: [
      'vp:ms-1.5 vp:inline-flex vp:h-6 vp:items-center vp:gap-1.5 vp:rounded-[6px] vp:px-2 vp:text-xs vp:font-extrabold vp:tracking-[0.12em] vp:cursor-pointer',
      'vp:bg-line-soft vp:text-text-dim vp:hover:text-text vp:data-[edge]:text-text',
      "vp:before:size-[7px] vp:before:rounded-full vp:before:bg-text-dim vp:before:content-['']",
      'vp:data-[edge]:before:bg-accent vp:data-[edge]:before:shadow-[0_0_8px_var(--vp-color-accent-glow)]',
      'vp:data-[edge]:before:animate-pulse vp:motion-reduce:data-[edge]:before:animate-none',
      ring,
    ],
    contextMenu: [
      'vp:absolute vp:z-20 vp:grid vp:w-58 vp:p-1 vp:rounded-md vp:border vp:border-line vp:bg-surface/95 vp:shadow-card',
      'vp:transition-[opacity,scale] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none',
      'vp:starting:scale-95 vp:starting:opacity-0',
    ],
    separator: 'vp:my-1 vp:border-t vp:border-line-soft',
    touchRow: 'vp:pointer-events-auto vp:flex vp:items-center vp:gap-7',
    touchButton: [
      'vp:grid vp:size-12 vp:place-items-center vp:rounded-full vp:bg-well/45 vp:text-text vp:cursor-pointer vp:[&_svg]:size-6',
      ring,
    ],
    flash: [
      'vp:pointer-events-none vp:absolute vp:inset-y-0 vp:grid vp:w-[38%] vp:place-items-center vp:text-sm vp:font-bold',
      'vp:[&_svg]:mx-auto vp:[&_svg]:mb-1 vp:[&_svg]:size-7',
    ],
    flashLeft:
      'vp:left-0 vp:rounded-r-[50%] vp:bg-radial-[ellipse_at_left] vp:from-text/15 vp:to-transparent vp:to-70%',
    flashRight:
      'vp:right-0 vp:rounded-l-[50%] vp:bg-radial-[ellipse_at_right] vp:from-text/15 vp:to-transparent vp:to-70%',
    unmute: [
      'vp:pointer-events-auto vp:absolute vp:top-16 vp:left-4 vp:inline-flex vp:h-9 vp:items-center vp:gap-2 vp:rounded-md vp:px-3.5 vp:cursor-pointer',
      'vp:border vp:border-line vp:bg-surface/90 vp:font-display vp:text-md vp:font-bold vp:text-text vp:[&_svg]:size-4',
      ring,
    ],
    cover:
      'vp:absolute vp:inset-0 vp:z-20 vp:grid vp:place-items-center vp:overflow-auto vp:bg-well/75 vp:p-5 vp:backdrop-blur-sm',
    shortcuts: 'vp:grid vp:w-full vp:max-w-md vp:gap-3',
    shortcutsGrid: 'vp:grid vp:grid-cols-[auto_1fr] vp:gap-x-4 vp:gap-y-1.5 vp:text-sm',
    kbd: 'vp:justify-self-start vp:rounded-[5px] vp:border vp:border-b-2 vp:border-line vp:bg-surface vp:px-1.5 vp:font-mono vp:text-xs',
    close: [
      'vp:absolute vp:top-3 vp:right-3 vp:grid vp:size-9 vp:place-items-center vp:rounded-md vp:cursor-pointer vp:hover:bg-line-soft vp:[&_svg]:size-5',
      ring,
    ],
    host: 'vp:relative vp:w-full',
    primary: [
      'vp:h-8 vp:rounded-sm vp:bg-gradient-accent vp:px-3 vp:font-display vp:text-sm vp:font-bold vp:text-on-accent vp:cursor-pointer',
      'vp:transition-[filter,scale] vp:duration-fast vp:ease-sukuna vp:motion-reduce:transition-none vp:hover:brightness-110 vp:active:scale-[.98]',
      ring,
    ],
    resume: [
      'vp:pointer-events-auto vp:absolute vp:bottom-22 vp:left-4 vp:z-10 vp:flex vp:items-center vp:gap-2.5 vp:rounded-md vp:border vp:border-line',
      'vp:bg-surface/95 vp:py-2 vp:ps-3.5 vp:pe-2 vp:text-md vp:text-text vp:shadow-card',
      'vp:transition-[bottom] vp:duration-base vp:ease-sukuna vp:motion-reduce:transition-none vp:group-data-[controls=hidden]/vp:bottom-5',
      'vp:@max-[30rem]:inset-x-2.5 vp:@max-[30rem]:bottom-18 vp:@max-[30rem]:text-sm',
    ],
    dockClose: [
      'vp:absolute vp:top-2 vp:right-2 vp:z-30 vp:grid vp:size-8 vp:place-items-center vp:rounded-full vp:bg-well/70 vp:text-text vp:cursor-pointer',
      'vp:hover:bg-well vp:[&_svg]:size-4',
      ring,
    ],
    srOnly: 'vp:sr-only',
  },
  variants: {
    aspectRatio: {
      '16/9': { root: 'vp:aspect-video' },
      '4/3': { root: 'vp:aspect-[4/3]' },
      '1/1': { root: 'vp:aspect-square' },
      '21/9': { root: 'vp:aspect-[21/9]' },
      '9/16': { root: 'vp:aspect-[9/16]' },
    },
    fullscreen: { true: { root: 'vp:aspect-auto vp:rounded-none' } },
    docked: {
      true: {
        root: 'vp:fixed vp:right-4 vp:bottom-4 vp:z-40 vp:aspect-video vp:w-[min(22.5rem,calc(100vw-2rem))] vp:max-w-none',
      },
    },
    hot: { true: { segment: 'vp:h-2 vp:group-hover/seek:h-2 vp:group-data-[dragging]/seek:h-2' } },
    captionSize: {
      S: { caption: 'vp:text-sm' },
      M: { caption: 'vp:text-lg' },
      L: { caption: 'vp:text-2xl' },
    },
    captionColor: {
      text: { caption: 'vp:text-text' },
      premium: { caption: 'vp:text-premium' },
    },
    captionBg: {
      solid: { caption: 'vp:bg-well/80' },
      soft: { caption: 'vp:bg-well/45' },
      none: {
        caption:
          'vp:bg-transparent vp:[text-shadow:0_1px_3px_var(--vp-color-well),0_0_8px_var(--vp-color-well)]',
      },
    },
  },
  defaultVariants: {
    aspectRatio: '16/9',
    captionSize: 'M',
    captionColor: 'text',
    captionBg: 'solid',
  },
})

export type VideoPlayerStyleProps = VariantProps<typeof videoPlayerStyles>
