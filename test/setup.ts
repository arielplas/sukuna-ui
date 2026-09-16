import { afterEach, expect } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import * as jestDom from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

GlobalRegistrator.register()
;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
// `toHaveNoViolations` is an object `{ toHaveNoViolations: fn }`, so spread it.
expect.extend({ ...jestDom, ...toHaveNoViolations })
afterEach(cleanup)
