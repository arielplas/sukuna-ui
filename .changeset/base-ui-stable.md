---
"sukuna-ui": patch
---

Upgrade the headless layer from `@base-ui-components/react@1.0.0-rc.0` to the stable, renamed
`@base-ui/react@^1.8.0` (eight releases of fixes). No public API change; ScrollArea keeps its
scrollbars mounted (`keepMounted`) so layout matches the rc behavior. Internal headless-lib bump
→ patch (breaking-change table).
