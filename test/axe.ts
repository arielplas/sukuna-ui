import { axe } from 'jest-axe'

/** Assert an element subtree has zero axe violations. */
export const expectAccessible = async (container: HTMLElement) =>
  expect(await axe(container)).toHaveNoViolations()
