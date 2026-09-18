---
"sukuna-ui": minor
---

Button primary label now meets WCAG AA contrast. The near-white label on the crimson gradient was
~3.1:1; the primary label uses a new `--sk-on-accent` token (white, both themes, so it no longer
flips to dark in light mode) and the dark-theme gradient's light stop is darkened `#FF3B4E → #D8253A`
so white clears 4.95:1. Still a crimson gradient. The shared `--sk-gradient-accent` (wordmark/hero)
darkens slightly with it; override the token to customize.
