# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets). Every
PR that changes shipped code adds a changeset (`bun run changeset`). Docs/CI-only PRs may
use an empty changeset.

Classify the bump with the breaking-change table in [`docs/questions.md`](../docs/questions.md)
Q6 and state the reasoning in the PR. Pre-1.0 the project is on `0.x`: **minor = breaking,
patch = everything else** until all ten v1 components ship.
