---
"sukuna-ui": patch
---

Tabs: a disabled tab is now visibly dimmed with a `not-allowed` cursor. It relied on the native
`:disabled` pseudo-class, but Base UI keeps a disabled tab focusable and marks it with
`data-disabled` (no native `disabled` attribute), so the dim styling never applied. Now gated on
`data-disabled` too.
