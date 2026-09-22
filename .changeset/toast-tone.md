---
"sukuna-ui": minor
---

Add `tone` to `Toast` (`ToastOptions.tone: 'info' | 'success' | 'warning' | 'danger'`), mirroring
`Alert`'s tone map exactly (same tokens, same left accent border) so a notification and an inline
alert for the same event read the same. No default — untoned toasts are unchanged. `tone` is sent
to Base UI as the toast `type`, so a free-form `type` naming a tone is styled too. Exports
`ToastTone`. Adds a variant = minor.
