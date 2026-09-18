---
"sukuna-ui": minor
---

Accessibility pass (contrast + focus). Retuned color tokens so every text color clears WCAG AA in
both themes: `text-faint` (was ~3:1, it colors all placeholders), and light-theme `premium`,
`premium-dim` and `success`. The focus ring is now a **solid** color via a new `--sk-focus-ring`
token (the translucent `--sk-accent-glow` failed the 3:1 non-text bar as the sole focus indicator);
`--sk-accent-glow` remains for decorative glow. Menu/Select/Combobox keyboard highlight is now a
crimson inset ring that meets 3:1 (was a near-invisible 6%-opacity fill). Avatar defaults `alt=""`
when omitted, Progress defaults an accessible name when unlabeled, and the Toast close button is a
larger touch target (24→32px). Override any `--sk-*` token to re-tune.
