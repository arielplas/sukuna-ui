---
"sukuna-ui": minor
---

Button is now polymorphic: `<Button as="a" href="…">` renders an anchor with the same styling for
"link that looks like a button". A disabled link maps to `aria-disabled` + `tabindex={-1}` +
non-interactive styles (anchors have no native `disabled`). Default (no `as`) is unchanged.
