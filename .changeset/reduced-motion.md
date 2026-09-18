---
"sukuna-ui": minor
---

Respect `prefers-reduced-motion: reduce`. Every animated component now drops its movement under the
OS "reduce motion" setting via Tailwind's `motion-reduce:` variant: spinners/skeletons/progress stop
their spin/pulse, overlay enter-exit slide/scale transitions (Dialog, Drawer, Toast, Menu, Select,
Combobox, Tooltip, Accordion, Switch) become instant, and the Button press-scale is disabled.
Color-only transitions are unaffected. Verified with a Playwright test that emulates the preference.
