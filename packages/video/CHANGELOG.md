# @sukunagg/video

## 0.1.0

### Minor Changes

- 9507a1c: First release: the sukuna-ui `VideoPlayer` as a standalone package (Q27). Everything the player and
  its parts do, plus `@sukunagg/video/hls`, with no dependency on sukuna-ui or Tailwind. Import the
  prebuilt stylesheet once (`import '@sukunagg/video/video.css'`); every class is `vp:`-prefixed so it
  can't clash with the host app, and the look is themed through `--vp-*` CSS variables (Sukuna dark by
  default).
