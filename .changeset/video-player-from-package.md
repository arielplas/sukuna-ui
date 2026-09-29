---
"@sukunagg/ui": minor
---

The `VideoPlayer` (and its parts, `useVideoPlayer`, and `@sukunagg/ui/video/hls`) now comes from the new
`@sukunagg/video` package, which `@sukunagg/ui` depends on and re-exports — imports are unchanged.
Its styles now ship as a prebuilt, prefixed stylesheet that `@sukunagg/ui/theme.css` imports and
`@sukunagg/ui/styles.css` includes, so nothing changes in your setup and the player looks the same
(verified element by element). `theme.css` also feeds the player's `--vp-*` variables from your
`--sk-*` tokens.

Behaviour note (why this is a minor on 0.x): the player's utilities are now unlayered, so a
conflicting Tailwind class you pass in the player's `className` (e.g. `rounded-none`) no longer
overrides the built-in one. Use the `--vp-*` variables or an important modifier (`rounded-none!`).
Non-conflicting classes (`max-w-3xl`, margins) work as before.
