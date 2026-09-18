---
"sukuna-ui": minor
---

Checkbox: new `label` prop renders the text inside a real `<label>` beside the box, so clicking
the text toggles it and names it for assistive tech. Enter now toggles the box like Space does;
the component prevents the default so Enter never implicitly submits a surrounding form (a
consumer `onKeyDown` that calls `preventDefault()` opts out).
