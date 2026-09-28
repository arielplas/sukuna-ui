# Component: VideoPlayer

> Follows the `docs/component-button.md` section template. Client component (`'use client'`) that
> drives the native `<video>`. Built from scratch: no Base UI video primitive exists, and the seek
> bar needs chapter segments, a buffered layer and a hover preview that Base UI `Slider` can't host,
> so seek, volume and the settings menu are small in-house controls. **Status: approved (Q21–Q23);
> W1 (core), W2 (parts), W3 (tools) and the W4 engine seam + hls.js adapter shipped; other SDK adapters wait on per-dependency approval (Q26).** Interactive design mockup:
> https://claude.ai/artifact/YEbDARw4mUAPviuEnRDBzv (v2).
> Scope source: a scout of nuevodevel.com (Nuevo plugin for Video.js, ~80 demos) — full parity map
> in **Appendix A**, delivery waves in **Appendix B**.

## 1. Purpose

Plays a single video with Sukuna-branded controls instead of each browser's native chrome, so video
looks the same in Chrome, Safari and Firefox and matches the rest of the library. It covers the
basics people expect from any player — play/pause, seek, time, volume, speed, captions,
picture-in-picture, fullscreen and keyboard shortcuts — and, per owner request Q22, the feature set
of the Nuevo plugin for Video.js: chapters, preview thumbnails, quality, playlists, transcript,
end screens, share, overlays, live, ads, cast and more.

Three tiers keep that from becoming one heavy component:

- **Tier 1 — core** (in `VideoPlayer`): everything a viewer expects on every video.
- **Tier 2 — parts** (separate named exports rendered as children): opt-in features; unused parts
  are tree-shaken.
- **Tier 3 — adapters** (subpath entries, vendor SDK as an optional peer): streaming engines, ads,
  Cast, DRM, VR. We ship the interface and all the chrome; the app installs the SDK.

## 2. Files

```
src/components/video-player/
├── video-player.styles.tsx    # tv() slots + variants. Pure. Server-safe.
├── video-player.logic.tsx     # 'use client' — VideoPlayer: media state, hotkeys, auto-hide, menus, a11y
├── video-player.controls.tsx  # 'use client' — SeekBar (segments + preview), VolumeSlider, SettingsMenu
├── video-player.context.ts    # 'use client' — VideoPlayerContext + useVideoPlayer() (public)
├── video-player.labels.ts     # VideoPlayerLabels + English defaults (i18n)
├── video-player.icons.tsx     # inline SVG icons, aria-hidden
├── video-player.utils.ts      # time format, WebVTT parser, chapter/cue/thumbnail lookup, sources
├── video-player.test.tsx  video-player.utils.test.ts  video-player.stories.tsx
└── index.tsx                  # VideoPlayer, useVideoPlayer + types
.storybook/public/video/       # 30s WebM fixture (360p + 180p), poster, sprite, chapter/caption VTTs
test/browser/video-player.test.ts
```

Parts live in the same folder (they only work inside a `VideoPlayer`):
`video-player-{playlist,panel,up-next,end-screen,share,skip,overlay,audio}.logic.tsx`, one shared
`video-player-parts.styles.tsx`, tests in `video-player-parts.test.tsx` (W2) and
`video-player-w3.test.tsx` (W3). Each part is its own module, so an app that imports only
`VideoPlayer` never loads them.
W4 adapters get their own subpath entries, SDK as an optional peer: `src/video/hls.ts` →
`sukuna-ui/video/hls` (hls.js `>=1.5`, `peerDependenciesMeta.optional`, `typesVersions` for legacy
`node10` resolution), tested with a mocked hls.js in `src/video/hls.test.ts`. The HLS fixture is
`.storybook/public/video/hls/` (VP9 + Opus fMP4, 360p + 180p) — Playwright's Chromium has no H.264.

## 3. API

The root renders the frame, the `<video>` and all Tier 1 controls. **Children are parts** (Tier 2).
Media comes in through `src` / `sources` and `tracks` props (arrays, like Nuevo's playlist items),
because the player must know resolutions, chapters and thumbnails up front, and playlist items reuse
the same shape. Tracks are fetched and rendered by the player (not the browser's `::cue`), which is
what makes caption styling, the transcript and chapter segments possible; `<track>` children are
therefore not used.

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface VideoPlayerProps extends Omit<ComponentPropsWithoutRef<'video'>, 'controls'> {
  title?: string                    // shown top-left while controls are visible; also names the region
  'aria-label'?: string             // region name when there is no `title`; one of the two is required
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | '9/16'   // default '16/9'; literal classes, no interpolation
  playbackRates?: number[]          // speed menu entries; default [0.5, 0.75, 1, 1.25, 1.5, 2]
  autoHide?: boolean                // hide controls after 2.5s idle while playing; default true
  hotkeys?: boolean                 // keyboard shortcuts while focus is inside the player; default true
  children?: ReactNode              // parts (Tier 2) and useVideoPlayer() consumers

  // ── Tier 1 additions (Q22) — shipped in W1 ──
  sources?: VideoSource[]           // { src, type?, res?: number | 'SD' | 'HD', label?, default? } → quality menu
  tracks?: VideoTrack[]             // { kind: 'captions'|'subtitles'|'chapters', src, srclang?, label?, default? }
  chapters?: Chapter[]              // { start, title, thumb? } — alternative to a chapters VTT
  thumbnails?: string | ThumbnailCue[]   // sprite VTT url (#xywh=) or explicit cues → hover preview
  startTime?: number                // seconds
  logo?: { src: string; alt: string; href?: string }   // watermark, top-right
  info?: ReactNode                  // line under the title (series, episode…)
  skipSeconds?: number              // rewind/forward buttons + J/L; default 10
  frameRate?: number                // for , / . frame stepping; default 24
  settings?: Array<'quality' | 'speed' | 'captions' | 'picture' | 'sleep' | 'loop' | 'snapshot' | 'download'>
                                    // gear rows; default ['quality', 'speed', 'captions']
  contextMenu?: boolean             // default true
  touchControls?: boolean           // back/play/forward row + double-tap seek on coarse pointers; default true
  autoplayPolicy?: 'muted' | 'none' // 'muted' → autoplay muted + "Tap to unmute" chip; default 'none'
  labels?: Partial<VideoPlayerLabels>   // every visible and aria string (i18n)

  // ── Tier 2 behaviours that are only props — W2/W3 ──
  resume?: string                   // storage key; restores position, shows the Resume prompt (W2)
  watchLimit?: { seconds: number; content: ReactNode }   // stop + cover at the limit; seeking past it blocked (W3)
  syncGroup?: string                // players in the same group pause each other
  floating?: boolean                // dock to a corner when scrolled out of view
  theater?: boolean                 // controlled; also defaultTheater. The app owns layout; we own the button + T key (W2)
  onTheaterChange?: (on: boolean) => void
  live?: boolean | { dvrWindow?: number }   // LIVE pill, DVR seek, "jump to live" (W3)
  download?: string | { src: string; filename?: string }   // gear → Download (W3)
  onSnapshot?: (image: Blob, time: number) => void         // gear → Snapshot; else a PNG download (W3)

  // ── Tier 3 seams — W4 ──
  engine?: VideoEngine              // shipped: { name, handles(src), attach(video, src, callbacks) → { setLevel, destroy } }
                                    // hlsEngine() from 'sukuna-ui/video/hls'; dash.js / Shaka / DRM next (Q26)
  ads?: AdAdapter                   // Q26: VAST / VMAP / IMA / DAI → our ad chrome
  cast?: CastAdapter                // Q26: Chromecast (AirPlay is native, Tier 1)
  renderer?: Renderer               // Q26: e.g. VR/360 WebGL canvas
  onAnalytics?: (e: PlayerEvent) => void   // Q26: one normalized event stream for any tracker

  // ── events ──
  onChapterChange?: (chapter: Chapter, index: number) => void
  onQualityChange?: (source: VideoSource) => void
}
```

**Parts** (Tier 2) are separate named exports so unused ones tree-shake (approved, Q23). A part
registers itself through the context registry; the core then shows its buttons (list, share,
previous/next) and hotkeys.

| Export | Renders | Key props |
|---|---|---|
| `VideoPlayerPanel` | right-side drawer with tabs: chapters list (thumbs, durations), playlist, transcript | `tabs`, `defaultOpen` |
| `VideoPlayerPlaylist` | renders nothing; the current item's media drives the player; prev/next buttons; `Shift+N/P`; auto-advance | `items`, `index` / `defaultIndex`, `onIndexChange`, `autoAdvance` (true), `repeat`, `rememberKey` |
| `VideoPlayerUpNext` | countdown card for the playlist's next item; Cancel stops auto-advance | `countdown` (default 10) |
| `VideoPlayerEndScreen` | replay, share (when `VideoPlayerShare` is mounted), related grid (links or buttons) | `related` |
| `VideoPlayerShare` | link (optionally at current time), embed code; opened from the top-right share button | `url`, `embed` |
| `VideoPlayerSkip` | "Skip intro" / "Skip recap" button for a time range | `start`, `end`, `label` |
| `VideoPlayerOverlay` (W3) | timed card / banner / plain content; `showOn="pause"` for a banner on pause; dismissible. News-ticker variant waits on Q25 | `aria-label`, `start`, `end`, `showOn`, `variant`, `placement`, `dismissible` |
| `VideoPlayerAudio` (W3) | audio mode: cover art (or initials tile), title, artist, Web Audio frequency visualizer | `art`, `title`, `artist`, `visualizer` |

`useVideoPlayer()` exposes state and actions (`play`, `seek`, `setQuality`, `chapters`, …) so apps
can build their own parts or a fully chromeless UI (Nuevo's "chromeless player" demo).

- **`ref` → the `<video>` element**, so consumers can call `play()`, read `currentTime`, etc.
- Every native media prop and event (`src`, `poster`, `autoPlay`, `muted`, `loop`, `preload`,
  `playsInline`, `onPlay`, `onTimeUpdate`, `onRateChange`, …) passes straight to `<video>`.
- `className` and `style` go to the **root frame** (layout: width, max-width, margins); everything
  else goes to `<video>`. `// DECISION(open): className → root` (a video-level class has no use when
  the player owns the chrome).
- `controls` is omitted: the native chrome is always off; ours replaces it.
- Type-level: `title` or `aria-label` is required (same overload trick as icon-only Button).

**Not planned** (Q22 recommendation): VPAID (runs third-party JS in the page; IAB-deprecated),
YouTube tech (iframe; can't be styled), automatic subtitle translation (needs a translation
service), Nuevo's WordPress plugin and dev tools (stream tester, sprite generator).

## 4. Variants → tokens

**The player chrome is always dark.** The root sets `data-theme="dark"`, so every `--sk-*` token
inside it resolves to the dark palette even in a light app. Video frames are dark-dominant and the
controls sit on a black scrim; light-theme text (`#141413`) would be unreadable there. No new tokens.
The focus ring (`--sk-focus-ring`) stays crimson in both.

| Slot | Utilities → tokens |
|---|---|
| root | `@container relative overflow-hidden rounded-lg bg-well shadow-card` · `--sk-radius-lg`, `--sk-well` (#000), `--sk-shadow-card` |
| video | `size-full object-contain` |
| scrim (bottom) | `bg-linear-to-t from-well/85 via-well/40 to-transparent`, ~45% of height |
| scrim (top, with `title`) | `bg-linear-to-b from-well/70 to-transparent`, ~25% of height |
| title | `font-display font-bold tracking-tight text-lg text-text`, truncates |
| bigPlay | 64px circle, `bg-gradient-accent text-on-accent` + `shadow-[0_0_28px_6px_var(--sk-accent-glow)]` — the one crimson primary on the surface |
| controlButton | 36px square (`size-9 rounded-md`), `text-text hover:bg-line-soft`, 20px icon — ghost icon Button look |
| time | `font-sans text-sm tabular-nums text-text` + `text-text-dim` for the duration |
| seek track | 4px → 6px on hover/drag, `rounded-pill bg-text/20` |
| seek buffered | `bg-text/35` (inline `width` %, positional) |
| seek played | `bg-accent` (`--sk-accent`) |
| seek thumb | 14px `bg-accent`, `ring-4 ring-accent-glow` on drag; scales in on hover (`scale-0 → scale-100`) |
| seek hover time | small chip `bg-surface-2 border border-line rounded-sm text-xs tabular-nums` above the pointer |
| volume slider | 72px track, same as seek but `bg-text` fill (volume isn't a brand moment); expands from `w-0` on hover/focus of the mute group |
| settings menu | in-house paged menu (`role="menu"`), `bg-surface/95 border-line rounded-md shadow-card`; radio rows show a crimson tick |
| spinner | our `Spinner` (lg) centered while `waiting` |
| error panel | centered `text-text` message + `text-text-dim` detail, `Retry` secondary Button |

**Q22 additions** (all existing tokens):

| Slot | Utilities → tokens |
|---|---|
| seek segments (chapters) | one `seg` per chapter, `gap-[3px]`, each `rounded-pill bg-text/20`; hovered segment `h-2`; played `bg-accent` per segment |
| thumbnail preview | 160×90 frame `rounded-sm shadow-card`, chapter title (`font-display font-bold text-sm`) above, time chip below |
| chapter label | beside the time: `· Chapter name ›` `text-sm`, truncates; opens the panel |
| settings menu | `bg-surface/95 border-line rounded-md shadow-card`, 260px; rows show current value in `text-text-dim` + chevron; sub-pages have a back header; toggles use our Switch look; chips use `border-accent bg-accent/14` when checked |
| side panel | `w-[min(340px,44%)]` right drawer, `bg-surface/95 backdrop-blur`, tabs with crimson underline (Tabs look); current item `bg-accent/10` + 3px crimson left rail; slides with `translate` `duration-slow` |
| skip intro / resume / up next | floating cards `bg-surface/95 border-line rounded-md`; ride above the bar and drop to the edge when controls hide; up-next countdown ring stroke `--sk-accent` |
| end screen / share / watch limit | full-frame cover `bg-well/70 backdrop-blur-sm`; primary action is the crimson Button, the rest secondary |
| loop range | `border-x-2 border-premium bg-premium/15` over the bar |
| ad chrome | `AD` badge `bg-premium text-bg`, pod position + countdown, "Skip in 5" → "Skip ad" tab on the right edge; ad progress `bg-premium` |
| live | `LIVE` pill: dot `bg-accent` pulsing at the live edge (static under reduced motion), `text-text-dim` when behind + `−0:42` |
| context menu | Menu popup look at the pointer |
| touch row | 48px round back/forward (`bg-well/45`) around the 64px crimson play; double-tap flashes a side ripple with "+10 seconds" |

Aspect ratio: `aspect-video` / `aspect-[4/3]` / `aspect-square` / `aspect-[21/9]` / `aspect-[9/16]`
as literal `tv()` variant strings.

**Compact layout** (container < 480px, `@max-[30rem]:` literal): 32px buttons, volume slider and PiP
hidden (mute stays), time shows `current / duration` in `text-xs`, bigPlay 52px. No JS measuring.

## 5. States

| State | Behavior |
|---|---|
| idle (not started) | poster (or first frame) + big crimson play button centered; bottom bar visible; title visible. |
| playing | big play hides; controls fade out after 2.5s without pointer movement (`autoHide`); cursor hides with them. |
| controls shown | pointer move, touch, or keyboard focus inside the player; stays shown while paused, while a menu is open, while dragging, and while focus is in the control bar. |
| paused | pause icon → play icon; controls pinned; big play does **not** return (it's a start affordance only). |
| waiting / buffering | centered Spinner after a 200ms delay (no flash on quick seeks); controls stay usable. |
| seeking (drag) | segments grow to 5px (hovered chapter 8px), thumb shown with glow, preview follows the pointer, video scrubs live. |
| ended | play icon becomes **replay**; controls pinned. |
| muted / volume 0 | volume icon shows the muted glyph; unmuting restores the previous level (min 0.1). |
| captions on | CC button `aria-pressed="true"` + a 2px crimson underline; only rendered when the video has ≥1 `captions`/`subtitles` track. |
| picture-in-picture | PiP button `aria-pressed`; `I` toggles. Hidden where unsupported (Firefox). |
| fullscreen | root goes fullscreen (not the `<video>`, so our controls come too); icon flips to exit. iOS Safari falls back to `video.webkitEnterFullscreen()` (native chrome there). |
| error | video `error` → error panel with the media error in plain words ("This video couldn't be loaded. Check the link or your connection.") + Retry (`load()`). |
| focus-visible | solid `--sk-focus-ring` on every control; the root gets a ring when focused directly. |
| reduced motion | controls hide/show instantly (no fade); thumb appears without scale; no glow pulse. |

**Motion (`docs/motion.md`):** controls fade (`opacity`, `duration-base`); seek track height and
thumb `scale` (`duration-fast`, listed explicitly — rule 3); volume slider width expand
(`duration-base ease-sukuna`). All with `motion-reduce:` fallbacks.

## 6. Logic (`video-player.logic.tsx`)

- `'use client'`. `forwardRef<HTMLVideoElement, VideoPlayerProps>` via `useImperativeHandle` to the
  internal `<video>` ref.
- **Media state** comes from React media events on the `<video>` (`onPlay`, `onPause`,
  `onTimeUpdate`, `onProgress`, `onDurationChange`, `onLoadedMetadata`, `onVolumeChange`,
  `onRateChange`, `onWaiting`, `onPlaying`, `onCanPlay`, `onEnded`, `onError`). Ours run first, then
  the consumer's handler of the same name. PiP uses `enter/leavepictureinpicture` listeners;
  fullscreen reads `document.fullscreenElement` on `fullscreenchange`. Buffered = the end of the
  `TimeRanges` entry containing `currentTime`.
- **Tracks**: `loadVtt()` fetches and parses WebVTT in effects (`parseVtt` in utils). Caption cues
  are cached per URL; failures are silent (no captions / chapters / thumbnails). Chapter VTTs follow
  Nuevo's format (a URL cue id becomes the chapter thumbnail). Thumbnail VTTs use `#xywh=` sprites,
  relative URLs resolved against the VTT.
- **Seek** (`SeekBar`): `role="slider"`, pointer capture while dragging (live scrub), arrows ±5s,
  PageUp/Down ±30s, Home/End. Shift+arrows bubble to the root for chapter jumps.
  `aria-valuetext` = "1 minute 23 seconds of 4 minutes, Crossing".
- **Volume** (`VolumeSlider`): 0–1, 5% steps; mute remembers the last non-zero level (min 10%).
- **Quality**: switching remembers `currentTime` and play state, swaps `src`, restores both on the
  next `loadedmetadata`. `startTime` applies once on the first `loadedmetadata`.
- **Settings menu** (`SettingsMenu`): paged `role="menu"` rendered inside the root (so it works in
  fullscreen); rows link to pages, radio rows, chip groups. **Choosing never closes it or
  leaves the page** (owner request, 0.9.2): the new value is ticked in place, so you can try 1.5×
  then 2× without reopening; **Back** (or ArrowLeft) returns to the main list, whose rows show the
  current values. Only the gear (toggle), an outside
  `pointerdown` / click on the video, or Escape (refocuses the gear) close it. Arrows move,
  ArrowLeft goes back. The context menu reuses it.
- **Auto-hide**: one `setTimeout` (2500ms) restarted on pointer move, pointer down (every tap or
  click, e.g. ±10s) and focus; hides after that much inactivity while playing with no menu open and
  no drag. Only **keyboard** focus in the bar pins the controls (`:focus-visible`; kept when the
  selector is unsupported) — the focus a click or tap leaves on a button doesn't. A mouse
  `pointerleave` hides immediately while playing; touch `pointerleave` (fired when a finger lifts)
  is ignored. State is `data-controls` on the root; styles use `group-data-[controls=hidden]/vp:`.
- **Hotkeys** (`onKeyDown` on the root, never `window`): skipped inside inputs, menus and dialogs,
  and for Space/Enter on buttons (native activation wins). Full list in the `?` sheet and TSDoc.
- **Touch** (`pointer: coarse` and `touchControls`): the centre shows back / play / forward; a tap
  toggles controls; a double tap on the left/right half seeks by `skipSeconds` with a side flash.
- **Fullscreen**: `requestFullscreen()` on the root (our controls come along), landscape lock on
  touch, `webkitEnterFullscreen()` fallback on iOS.
- **SSR-safe**: server HTML is the idle frame; fullscreen / PiP / AirPlay buttons render after an
  effect confirms support, so server and first client render match. No DOM access outside effects
  and handlers.
- Formatting: `m:ss`, or `h:mm:ss` when duration ≥ 1h; unknown duration → `--:--`.

## 7. Styles (`video-player.styles.tsx`)

`tv()` slots for every part of the chrome (root, scrims, top bar, big play, seek segments, preview,
row buttons, volume, menu, chips, context menu, touch row, flash, unmute chip, shortcuts sheet) and
variants `aspectRatio`, `fullscreen`, `hot` (hovered chapter segment), `captionSize` (S/M/L),
`captionColor` (text/premium), `captionBg` (solid/soft/none). Hidden-controls rules are the literal
`group-data-[controls=hidden]/vp:opacity-0 …` on each fading slot; compact rules are literal
`@max-[30rem]:` container variants. Played/buffered widths, the preview offset and sprite position
are inline positional styles (like Carousel's `translateX`). Colors only via `--sk-*` utilities;
opacity modifiers (`bg-well/85`) on tokens, never raw hex.

## 8. Accessibility checklist

- [x] Root: labelled `<section>` (role `region`) named by `title` or `aria-label`; `aria-roledescription="video player"`; focusable (`tabIndex={0}`) so hotkeys work after a click.
- [x] Every control is a native `<button>` with an `aria-label` that says what happens now ("Play", "Pause", "Mute", "Unmute", "Enter fullscreen", "Turn on captions"); icons `aria-hidden`.
- [x] Toggle buttons (captions, PiP) use `aria-pressed`; play/mute/fullscreen swap their label instead (the action changes).
- [x] Seek and volume are `role="slider"` with `aria-label` ("Seek", "Volume") and spoken `aria-valuetext` (seek includes the chapter).
- [x] Settings: gear `aria-haspopup="menu"` + `aria-expanded`; pages are `role="menu"`, choices `menuitemradio` + `aria-checked`; caption-style chips are named "Size: Large".
- [x] Controls never hide while focus is inside them (WCAG 2.4.7/2.4.11 — focus stays visible).
- [x] Hotkeys only fire with focus inside the player and never steal keys from sliders, menus or text inputs; `?` opens a shortcuts sheet (`role="dialog"`, focus on Close, Escape closes).
- [x] Buffering spinner: `role="status"` + "Loading"; error panel: `role="alert"`.
- [ ] Contrast (owner visual pass): control icons `--sk-text` on the scrim ≥ 4.5:1 over a bright frame; crimson played bar ≥ 3:1 against the `bg-text/20` track.
- [x] Autoplay is the consumer's choice; `autoplayPolicy="muted"` is the only autoplay mode and always shows "Tap to unmute". Caption tracks are the consumer's responsibility (WCAG 1.2.2).
- [x] Touch targets ≥ 32px in compact, 36px otherwise; touch row 48px.

## 9. Tests

Harness in `docs/testing.md`. happy-dom has no media pipeline, so unit tests stub
`HTMLMediaElement.prototype.play/pause/load`, define `duration`/`buffered`, dispatch media events,
and stub `fetch` for VTTs. Real playback runs in the browser suite.

- `video-player.utils.test.ts`: time formats, spoken time, VTT parsing (ids, settings, tags,
  NOTE blocks, CRLF), cue/chapter/thumbnail lookup, rendition ranking, label formatters.
- `video-player.test.tsx`: SSR + hydration; axe idle and error; ref/className/native props;
  play/pause/replay from every entry point; rejected `play()`; time + buffered + valuetext; seek keys
  and pointer drag; hover preview (chapter, sprite, single image); volume keys/pointer/mute memory;
  settings pages + keyboard + outside click; quality switch keeps position and play state; captions
  (default, switch, cache, failure, style chips, C key); chapter track + Shift+arrow jumps +
  `onChapterChange`; thumbnails VTT; `startTime`; every hotkey + opt-out; shortcuts sheet; context
  menu; fake-timer auto-hide, spinner delay and touch double-tap; error + Retry; muted autoplay
  chip; fullscreen / PiP / AirPlay support, landscape lock and the iOS fallback; title/info/logo;
  `useVideoPlayer` inside a part and outside one.
- `video-player-parts.test.tsx` (W2): playlist (buttons, Shift+N/P, repeat wrap, auto-advance and
  play-on-load, no autoAdvance, controlled, `rememberKey`, empty/unmounted fallback, throwing
  storage); panel (open from list button and chapter label, chapter seek + `aria-current`,
  playlist + transcript tabs, arrow-key tabs, auto-scroll, Escape, no-content case, axe); up next
  (countdown, Cancel, Play now, hidden without a next item); end screen (links, buttons, Replay,
  Share only with the Share part); share (top bar + end screen entry, focus, start-at time, copy,
  clipboard missing/refused → select, embed as string/function, Escape, axe); skip; resume
  (prompt, Resume/Start over, throttled save, clear on end, edge positions); sync group; theater
  (controlled, uncontrolled, T key); floating (dock, height kept, close, re-arm, pause undocks).
- `video-player-engine.test.tsx` (W4): engine URLs never get `src` (server or client) and attach
  in an effect; other URLs stay native; Quality menu from engine levels (Auto + highest first,
  labels, HD badge from the playing level), pinning and back to Auto; single level hides the row;
  fatal error → error state, Retry re-attaches, unmount destroys; `sources` pick decides.
  `src/video/hls.test.ts`: URL claim, hls.js wiring (config, load/attach, levels, level switch,
  `currentLevel`, destroy), one-shot network/media recovery then fatal, native fallback without
  MSE and with `preferNative`.
- `video-player-w3.test.tsx` (W3): picture chips + mirror toggle + reset (inline `scale`/`filter`),
  sleep timer (minutes with fake timers; "end of video" blocks auto-advance once), loop (whole
  video = native `loop`, chapter, custom A–B incl. edge orders, root-row values), snapshot
  (callback, PNG download, null blob / no 2D context / tainted canvas → toast), toast timeout,
  download (URL and `{src, filename}`), watch limit (pause, cover, play blocked, seek clamped),
  live (edge pill, behind time, DVR-relative bar, Jump to live, End key, no % jumps), overlay
  (window, dismiss, banner on pause, placements, axe), audio (initials/art, visualizer drawing,
  graph reuse, rejected `resume()`, no Web Audio, `webkitAudioContext`, reduced motion).
- Browser (`test/browser/video-player.test.ts`, bundled WebM fixture): real play + first caption,
  keyboard seek + chapter jump, sprite preview on hover, speed + quality from the menu, error
  state; W2: panel chapter seek + tab keys + transcript, playlist next swaps media, end screen →
  share sheet focus + Escape; W3: zoom + mirror computed `scale`, watch-limit cover, live pill
  edge/behind + jump back, overlay window + close; W4: HLS plays through MSE (`blob:` src) and the
  Quality menu lists Auto / 360p / 180p from the manifest, pinning 180p.

## 10. Stories

W1: `Playground`, `Basic`, `ChaptersAndThumbnails`, `WithCaptions`, `Quality`, `CustomSpeeds`,
`AspectRatios`, `Compact` (320px), `LightAppContext` (chrome stays dark), `ErrorState`,
`MutedAutoplay`, `Controlled` (outside buttons via `ref`), `CustomPart` (`useVideoPlayer`).
W2: `FullPlayer` (every part together), `ChaptersPanel`, `Playlist`, `EndScreen`, `Share`,
`SkipIntro`, `Resume`, `TheaterMode`, `Floating`, `SyncGroup`.
W3: `AllSettings` (every gear row), `WatchLimit`, `Live` (the fixture's seekable range as a DVR
window), `Overlays`, `AudioMode`. W4: `HlsStream` (`hlsEngine()` + the HLS fixture).

## 11. Decisions

- **Built on native `<video>`, no player library** (Video.js/Plyr/Vidstack would add 30–100 kB and
  their own CSS). Approved (Q23).
- **Always-dark chrome** via `data-theme="dark"` on the root. Approved (Q23).
- **In-house seek/volume/menu instead of Base UI** (W1): chapter segments, the buffered layer and
  the hover preview live inside the slider; Base UI `Slider` has one track and one indicator.
- **Player-rendered captions** instead of native `<track>` + `::cue`: needed for caption style
  settings and the W2 transcript; no `@utility video-cues` required.
- **Chapter label** opens the chapters tab when a `VideoPlayerPanel` is mounted, else seeks to the
  chapter start.
- **Panel stops above the control bar** (W2) so the bar stays usable; floating cards (skip, up
  next) move beside an open panel. The panel animates in with `@starting-style` and unmounts on
  close (no slide-out) so closed content is never focusable.
- **In-house tablist in the panel** instead of our `Tabs` (Base UI, ~22 kB) — three tabs don't
  justify the weight inside a player.
- **Playlist items replace the player's media props**; the core resets per-item state (quality,
  chapters, captions kept by language when the new item has it) and plays on load after
  next/previous/auto-advance.
- **`syncGroup`** is a module-level registry (effects only), not window events.
- **Picture filters are chip presets** (W3), not sliders: a range input inside `role="menu"` breaks
  the menu's ARIA ownership; presets cover the common adjustments. Zoom/mirror/filters are inline
  `scale`/`filter` on the `<video>` (user-chosen values, like positional styles).
- **Snapshot** draws the frame to a canvas; tainted (cross-origin) media, a missing 2D context or
  an empty blob show a "not available" toast instead of failing silently.
- **Loop A–B**: setting A after B drops B; setting B at or before A restarts the range at 0:00.
- **Live** uses the element's `seekable` range as the bar's window; `dvrWindow` caps it.
- **Ticker overlay deferred** (Q25): it needs a new keyframe in the generated `theme.css`, which
  follows the token-approval rule (as the shine keyframes did in Q13).
- **Player root declares `color-scheme: dark`** so native scrollbars and checkboxes inside the
  chrome match it.
- **Engines claim URLs at render time** (`handles(src)`), so the server and the client render the
  same `<video>` without `src` and React never fights the engine over it (removing a MediaSource
  `blob:` src would break playback). Engine levels replace `sources` in the Quality menu.
- **hls.js adapter**: MSE first, native HLS without MSE (or with `preferNative`); one retry per
  fatal network / media error before the error state; Retry re-attaches.
- **Floating** remembers the in-page height from the IntersectionObserver entry so the page doesn't
  jump when the player docks.
- **Fullscreen the root, not the video**, so the branded controls survive; iOS falls back to native.
- **Menus render inside the root** so they work in fullscreen.
- **Big crimson play is a start affordance only** — after the first play, pause shows no overlay
  (keeps the frame clean; YouTube-style).
- `className` → root, `ref` → `<video>` (approved, Q23).
- ~~Streaming, thumbnails, chapters out of v1~~ — superseded by Q22: chapters and thumbnails are
  Tier 1; streaming is a Tier 3 `engine` adapter.
- **Q22 scope, Nuevo parity in three tiers** (approved, Q23): core in the component, parts as children,
  vendor SDKs as adapters behind `sukuna-ui/video/*` subpaths with optional peers. Each new SDK is a
  separate dependency approval (Q16 precedent).
- **Ads use `--sk-premium`** (champagne) for their badge and progress. Ads aren't a brand moment,
  so no crimson.
- **Chapters render as bar segments** with 3px gaps; the hovered segment thickens. The current
  chapter's name sits beside the time and opens the chapters panel.
- **One gear menu** holds quality, speed, captions, caption style, picture, sleep timer, loop,
  snapshot and download (Nuevo splits these into several buttons); each row shows its current value.
- **Settings and panels live inside the root** (portal target = root) so they work in fullscreen.

## Appendix A. Nuevo parity map

Scouted 2026-09-27: nuevodevel.com home, `/nuevo/doc`, `/nuevo/showcase/` (~80 demos),
`/nuevo/playlist`, chapters and chapters-list demos.

| Nuevo feature | Tier | Our part / prop |
|---|---|---|
| Chapters + chapter markers with tooltips | 1 | `tracks` kind chapters / `chapters`; segmented bar |
| Chapters list with thumbnails | 2 | `VideoPlayerPanel` chapters tab |
| Preview thumbnails (sprite, VTT) | 1 | `thumbnails` |
| Captions/subtitles, multi-language, separate CC menu | 1 | `tracks`; CC button + Subtitles/CC settings page |
| Caption settings | 1 | settings → Caption style |
| Transcript | 2 | `VideoPlayerPanel` transcript tab |
| Quality picker (multi-res MP4, HLS/DASH levels), HD icon | 1 / 3 | `sources[].res`; levels from `engine` |
| HLS, fMP4, MPEG-DASH, hls.js / dash.js handlers | 3 | `engine` (`sukuna-ui/video/hls`, `/dash`) |
| DRM (EME) | 3 | via `engine` |
| Live streaming, DVR, live clock, offline image | 2 | `live`; offline = error-cover variant |
| Speed rates (custom) | 1 | `playbackRates` |
| Rewind / forward buttons | 1 | `skipSeconds` |
| Next / previous with thumbnails; playlist (auto-advance, repeat, remember item) | 2 | `VideoPlayerPlaylist` |
| UpNext | 2 | `VideoPlayerUpNext` |
| Related container, related gallery slider, end action | 2 | `VideoPlayerEndScreen` |
| Sharing container, embed code | 2 | `VideoPlayerShare` |
| Video title info, watermark logo | 1 | `title`, `info`, `logo` |
| Zoom (wheel / slider), mirror view, video filters | 2 | settings → Picture |
| Snapshot image, download button | 2 | `settings` rows |
| Frame-by-frame | 1 | `,` `.` keys, `frameRate` |
| Loop section | 2 | settings → Loop section; champagne range on the bar |
| Intro skip | 2 | `VideoPlayerSkip` |
| Resume video, start time | 2 / 1 | `resume`, `startTime` |
| Watch limit | 2 | `watchLimit` |
| Sleep timer | 2 | settings → Sleep timer |
| Theater mode | 2 | `theater` + `onTheaterChange` |
| Context menu | 1 | `contextMenu` |
| Keyboard shortcuts | 1 | `hotkeys` |
| Touch controls; iOS pseudo-fullscreen; Android landscape lock | 1 | `touchControls`; orientation lock inside the fullscreen handler |
| Multiple players pause each other | 2 | `syncGroup` |
| Autoplay per browser policy | 1 | `autoplayPolicy` |
| Floating player on scroll | 2 | `floating` |
| Language / i18n | 1 | `labels` |
| Chromeless player / API | 1 | `useVideoPlayer()` |
| Events & analytics (Matomo) | 3 | `onAnalytics` (tracker-agnostic) |
| Audio playback, visualizer, ID3 tags | 2 / 3 | `VideoPlayerAudio`; ID3 parser adapter |
| Overlay plugin, banner ad on pause, promo icons, news ticker | 2 | `VideoPlayerOverlay` variants |
| Chromecast (+ subtitles) | 3 | `cast` adapter |
| AirPlay | 1 | Safari `webkitShowPlaybackTargetPicker`, no SDK |
| VR / 360° | 3 | `renderer` adapter |
| VAST, VMAP, pre/mid/post-roll, nonlinear, companions, outstream, waterfall | 3 | `ads` adapter + our ad chrome |
| Google IMA, Google DAI | 3 | `ads` adapter (`sukuna-ui/video/ima`) |
| VPAID | — | not planned |
| YouTube tech | — | not planned |
| Subtitle auto-translation | — | not planned |
| 13 skins | — | one Sukuna skin; `--sk-*` tokens are the theming surface |

## Appendix B. Delivery waves (approved, Q23)

| Wave | Contents | New deps |
|---|---|---|
| W1 ✅ | v1 core + chapters (segments, label) + thumbnails + settings menu (quality, speed, captions, caption style) + ±10s + frame step + context menu + touch controls + AirPlay + `labels` + `useVideoPlayer` | none |
| W2 ✅ | Panel (chapters / playlist / transcript), Playlist, UpNext, EndScreen, Share, Skip, resume, startTime, syncGroup, theater, floating | none |
| W3 ✅ | Picture (zoom, mirror, filters), snapshot, download, loop section, sleep timer, watch limit, live UI, overlays, audio + visualizer | none |
| W4 ◐ | Engine seam + hls.js ✅ (`sukuna-ui/video/hls`); dash.js → IMA / VAST → Cast → VR (three.js) → analytics wait on Q26, one approval each | optional peers |

Size budgets: core and each part get their own `.size-limit.json` entry so a part never inflates
`VideoPlayer` alone.
