---
"sukuna-ui": minor
---

Documented for AI agents and search. Every exported component and prop now carries rich TSDoc in
the published `.d.ts` — purpose, `@remarks` (SSR/RSC posture, accessibility and keyboard behaviour,
every variant with its default), `@default`, and copy-pasteable `@example`s — so IDE hover and
agents reading `node_modules/sukuna-ui` are self-sufficient. New generated agent-facing docs
(`llms.txt`, `llms-full.txt`, `docs/llms/<component>.md`) are built from the component specs by
`bun run docs:build` and drift-checked in CI. The README is rewritten code-first with a "For AI
agents" section and a generated component table; `package.json` gains `keywords`/`author` and a
sharper description. The showcase example is now a deployable, prerendered, SEO-complete site
(meta/Open Graph/JSON-LD `SoftwareApplication`, sitemap, robots, favicon, llms files). No runtime
behaviour changes.
