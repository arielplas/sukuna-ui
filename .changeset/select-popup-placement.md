---
"sukuna-ui": patch
---

Select: the popup now opens below the trigger (flipping above when cramped) instead of Base UI's
macOS-style "align selected item with trigger" mode, so the mouse wheel scrolls the list rather
than growing/moving the popup. The popup is at least as wide as the trigger and caps its height at
the space available on its side (`--available-height`), so a Select near the bottom of the
viewport no longer runs off the page. Storybook gains a `ManyItems` story (100 numeric options).
