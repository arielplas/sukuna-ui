// FIRST preload. Registers happy-dom's globals BEFORE any test or the main setup imports
// Testing Library. This ordering matters: `@testing-library/dom` binds `screen` to
// `document.body` at module-eval time, and ES imports are hoisted — so if registration and the
// Testing Library import lived in one file, `screen` would bind before `document` existed and
// every `screen.*` query would throw "a global document has to be available". Keeping this in its
// own preload guarantees it runs to completion first (see bunfig.toml `preload` order).
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()
;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
