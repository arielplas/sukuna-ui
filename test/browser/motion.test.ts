import { expect, type Page, test } from '@playwright/test'

// Guards the v1.3 motion wave (docs/motion.md). Asserts on computed styles and geometry, not
// timing, so it stays deterministic.
const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`
const style = (page: Page, selector: string, prop: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)

test.describe('motion', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('popups transition scale + translate (not the unused `transform`) and slide from their side', async ({
    page,
  }) => {
    await page.goto(story('components-menu--with-icons'))
    await page.getByRole('button', { name: 'Options' }).click()
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
    await expect(menu).toHaveAttribute('data-side', 'bottom')
    const props = await style(page, '[role="menu"]', 'transition-property')
    expect(props).toContain('scale')
    expect(props).toContain('translate')
    // Once settled it rests at its natural position and size.
    await expect.poll(() => style(page, '[role="menu"]', 'scale')).toBe('none')
    await expect.poll(() => style(page, '[role="menu"]', 'translate')).toBe('none')
  })

  test('the Tabs indicator slides to the selected tab (horizontal and vertical)', async ({
    page,
  }) => {
    for (const [id, next] of [
      ['components-tabs--default', 'Billing'],
      ['components-tabs--vertical', 'Integrations'],
    ] as const) {
      await page.goto(story(id))
      const indicator = page.locator('[data-sk-indicator]')
      await expect(indicator).toBeVisible()
      await page.getByRole('tab', { name: next }).click()
      await expect
        .poll(async () => {
          const i = await indicator.boundingBox()
          const t = await page.getByRole('tab', { name: next }).boundingBox()
          if (!i || !t) return false
          return id.endsWith('vertical')
            ? Math.abs(i.y - t.y) < 1 && Math.abs(i.height - t.height) < 1
            : Math.abs(i.x - t.x) < 1 && Math.abs(i.width - t.width) < 1
        })
        .toBe(true)
      expect(await style(page, '[data-sk-indicator]', 'transition-property')).toContain('translate')
    }
  })

  test('Accordion panels animate their height', async ({ page }) => {
    await page.goto(story('components-accordion--default'))
    await page.getByRole('button', { name: 'Shipping' }).click()
    const panel = page.getByText(/Orders ship within/).locator('xpath=..')
    await expect(panel).toBeVisible()
    expect(await panel.evaluate((el) => getComputedStyle(el).transitionProperty)).toContain(
      'height',
    )
  })

  test('toasts stack as a deck and fan out on hover', async ({ page }) => {
    await page.goto(story('components-toast--with-description'))
    const show = page.getByRole('button', { name: 'Show toast' })
    await show.click()
    await show.click()
    await show.click()
    const toasts = page.getByRole('region', { name: 'Notifications' }).getByRole('dialog')
    await expect(toasts).toHaveCount(3)
    const tops = async () =>
      Promise.all([0, 1, 2].map(async (i) => (await toasts.nth(i).boundingBox())?.y ?? 0))

    // Collapsed: older toasts peek a few px above the newest (not a full toast height).
    await page.mouse.move(5, 5)
    await expect
      .poll(async () => {
        const [a, b] = await tops()
        return (a ?? 0) - (b ?? 0)
      })
      .toBeLessThan(20)

    // Expanded: hovering fans them out by at least a toast height.
    await toasts.first().hover()
    await expect
      .poll(async () => {
        const [a, b] = await tops()
        return (a ?? 0) - (b ?? 0)
      })
      .toBeGreaterThan(50)
  })

  test('indeterminate Progress slides a bar instead of pulsing', async ({ page }) => {
    await page.goto(story('components-progress--indeterminate'))
    expect(
      await style(page, '[data-indeterminate][class*="animate-indeterminate"]', 'animation-name'),
    ).toBe('sk-indeterminate')
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('indicator, popups and progress stop animating', async ({ page }) => {
    await page.goto(story('components-tabs--default'))
    expect(await style(page, '[data-sk-indicator]', 'transition-property')).toBe('none')

    await page.goto(story('components-progress--indeterminate'))
    expect(
      await style(page, '[data-indeterminate][class*="animate-indeterminate"]', 'animation-name'),
    ).toBe('none')

    await page.goto(story('components-menu--with-icons'))
    await page.getByRole('button', { name: 'Options' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
    expect(await style(page, '[role="menu"]', 'transition-property')).toBe('none')
  })
})
