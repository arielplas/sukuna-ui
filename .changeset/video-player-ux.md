---
"sukuna-ui": patch
---

VideoPlayer: the settings menu no longer closes when you pick an option; a choice returns to the
main list (YouTube-style) and the menu closes only from the gear, an outside click or Escape.
Tapping ±10s (or anything) restarts the inactivity timer instead of hiding the controls: on touch
screens a finger lifting no longer counts as the pointer leaving, and focus left by a click or tap
no longer pins the controls open (keyboard focus still does). Behavior fix, no API change → patch.
