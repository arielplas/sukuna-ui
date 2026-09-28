---
"sukuna-ui": minor
---

New `VideoPlayer` (wave 1 of the Nuevo-parity plan, Q21–Q23): Sukuna-branded controls over the
native `<video>`, always-dark chrome, no player library. Chapter-segmented seek bar with sprite
thumbnail previews, quality menu from `sources`, speed, player-rendered captions with language and
style settings, ±10s, frame stepping, volume, picture-in-picture, AirPlay, fullscreen, touch
controls with double-tap seek, muted-autoplay chip, context menu, keyboard shortcuts (`?` sheet),
`labels` for i18n and a public `useVideoPlayer()` hook for custom parts.

Wave 2 adds opt-in parts (separate exports, tree-shaken when unused): `VideoPlayerPlaylist`,
`VideoPlayerPanel` (chapters / playlist / transcript), `VideoPlayerUpNext`,
`VideoPlayerEndScreen`, `VideoPlayerShare`, `VideoPlayerSkip`; and player props `resume`,
`syncGroup`, `floating` and `theater`.

Wave 3 adds gear rows `picture` (zoom, mirror, brightness/contrast/saturation), `sleep`, `loop`
(whole video, chapter, A–B), `snapshot` and `download`; props `watchLimit`, `live` (DVR window +
LIVE pill), `download`, `onSnapshot`; and parts `VideoPlayerOverlay` and `VideoPlayerAudio`
(Web Audio visualizer).

Wave 4 adds the `engine` prop (`VideoEngine` seam for streaming engines; their levels fill the
Quality menu) and a new entry point `sukuna-ui/video/hls` with `hlsEngine()`. hls.js is an
**optional** peer dependency (`>=1.5`), needed only by apps that import that entry. Adds a prop,
components and an export → minor.
