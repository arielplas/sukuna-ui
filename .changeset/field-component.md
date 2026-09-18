---
"sukuna-ui": minor
---

New `Field` component — a form-control wrapper (compound: `Field` + `Field.Label` / `Field.Control`
/ `Field.Description` / `Field.Error`) built on Base UI Field. It wires label association,
`aria-describedby` for description and error, and `aria-invalid`, so a labelled/validated input is
correct by construction. Set `invalid` and the error shows and links automatically.
