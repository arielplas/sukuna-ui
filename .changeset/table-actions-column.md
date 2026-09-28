---
"sukuna-ui": minor
---

Table actions column. Menu and ContextMenu options accept an `icon` (decorative, `aria-hidden`
leading icon). New `RowActions` component: a square ghost ⋯ button that opens a Menu of row
actions (`items`, row-specific `aria-label`, opens aligned to the end). Table gains static
`Table.ActionsHeaderCell` (visually hidden "Actions" column name) and `Table.ActionsCell`
(narrow, right-aligned); Table itself stays a zero-JS server component. Adds props/parts/component
→ minor.
