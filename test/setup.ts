// SECOND preload — runs after test/register-dom.ts, so happy-dom's `document` already exists
// when Testing Library is imported here (and `screen` binds correctly). Registers the matcher sets
// and clears the DOM between tests.
import { afterEach, expect } from 'bun:test'
import * as jestDom from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

// `toHaveNoViolations` is an object `{ toHaveNoViolations: fn }`, so spread it.
// The cast: our test/matchers.d.ts augmentation types the matchers for call sites, which then
// makes `expect.extend` want the third-party implementation signatures to match exactly — they
// don't (jest-dom/jest-axe have their own arg types). The runtime is correct; bypass the impl
// type-check here only.
const matchers = { ...jestDom, ...toHaveNoViolations }
expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0])
afterEach(cleanup)
