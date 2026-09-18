---
"sukuna-ui": minor
---

Export `Tabs` (and its `TabItem` / `TabsProps` types) from the package entry. The component
shipped, was documented and tested, but was never re-exported from `src/index.ts`, so
`import { Tabs } from "sukuna-ui"` failed. It's now importable like every other component, guarded
by a test that asserts every component directory is re-exported.
