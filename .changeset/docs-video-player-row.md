---
"@sukunagg/ui": patch
---

Docs: the README component table and the agent docs (`llms.txt`, `llms-full.txt`) list `VideoPlayer`
again (46 components). The 0.10.0 package rename left the re-exported player out of the generated
docs; the generator now fails if a re-exported package component goes missing.
