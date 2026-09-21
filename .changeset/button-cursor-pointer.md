---
"sukuna-ui": patch
---

Button now shows `cursor: pointer` on hover, matching every other interactive component (switch, tabs, accordion, menu items, etc.). The `disabled`/`aria-disabled`/`aria-busy` cursor states are unchanged and still override it. Visual-behavior fix with no API or layout change — patch per the breaking-change table.
