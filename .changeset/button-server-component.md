---
"sukuna-ui": patch
---

Button is now a server component: it had no hooks, so the `'use client'` directive only forced
hydration. Link and submit buttons now ship zero JS under RSC. A new RSC-boundary test fails if a
hook-free component is ever marked client again (or a hook-using one isn't).
