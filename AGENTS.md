# AGENTS.md

This project's operating rules for any AI coding agent live in [`CLAUDE.md`](./CLAUDE.md).
Read it first, then `docs/plan-human.md`, `docs/plan-agentic.md`, and `docs/roadmap.md`, and
start from the first unchecked box in the roadmap.

The rules that matter most: **Bun only; never push or publish without an explicit human
instruction; SSR-safe zero-runtime styling; docs before code; every unit of work ends with
`bun run check && bun test --coverage && bun run build && bun run check:pkg` green at ≥90%
coverage.** The full set, plus the breaking-change table, is in `CLAUDE.md`.
