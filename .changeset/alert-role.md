---
"sukuna-ui": minor
---

Alert: the ARIA role now derives from `tone` — `role="alert"` (assertive) for `danger`/`warning`,
`role="status"` (polite) otherwise — so urgent alerts interrupt screen readers appropriately. An
explicit `role` prop still overrides.
