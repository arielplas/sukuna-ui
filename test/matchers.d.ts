// Teach `bun:test`'s `expect` about the matchers we register in test/setup.ts:
// jest-dom (toHaveAttribute, toBeDisabled, toHaveFocus, …) and jest-axe (toHaveNoViolations).
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'bun:test' {
  interface Matchers<T = unknown> extends TestingLibraryMatchers<unknown, T> {
    toHaveNoViolations(): T
  }
  interface AsymmetricMatchers extends TestingLibraryMatchers<unknown, void> {
    toHaveNoViolations(): void
  }
}
