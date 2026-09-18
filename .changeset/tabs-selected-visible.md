---
"sukuna-ui": patch
---

Tabs: the selected tab is now clearly styled. It keyed off `data-[selected]`, but Base UI's
`Tabs.Tab` uses `aria-selected` (there is no `data-selected`), so the active tab previously had no
distinct styling. The selected tab now shows crimson text and a crimson underline.
