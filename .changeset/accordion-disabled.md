---
"sukuna-ui": patch
---

Accordion: a disabled item is now visibly dimmed. Base UI keeps a disabled trigger focusable with
`data-disabled`/`aria-disabled` and no native `disabled`, so the `disabled:` styles never applied
(same trap as Tabs, D27). Unit + Playwright guards added.
