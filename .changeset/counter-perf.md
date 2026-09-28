---
"sukuna-ui": minor
---

Counter: the count-up paints straight into its text node instead of setting React state every
frame (zero re-renders while animating, was ~60/s per counter). New `startOnView` prop (default
`false`) holds the count at `from` until the number scrolls into view.
