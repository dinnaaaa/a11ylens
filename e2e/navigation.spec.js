
import { test, expect } from '@playwright/test'

test.describe('A11yLens navigation', () => {
  test('should display the main application layout', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'A11yLens' })
    ).toBeVisible()

    await expect(
      page.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible()

    await expect(
      page.getByText('Local Workspace')
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: 'Dashboard Overview' }).first()
    ).toBeVisible()
  })

  test('should navigate between all six menu pages', async ({ page }) => {
    await page.goto('/')

    const navigationCases = [
      { label: 'Accessibility Audit', heading: 'Accessibility Audit', url: '/audit' },
      { label: 'Contrast Checker', heading: 'Contrast Checker', url: '/contrast-checker' },
      { label: 'Issue Management', heading: 'Issue Management', url: '/issues' },
      { label: 'WCAG Checklist', heading: 'WCAG Checklist', url: '/wcag-checklist' },
      { label: 'Audit History & Reports', heading: 'Audit History & Reports', url: '/audit-history' },
      { label: 'Dashboard Overview', heading: 'Dashboard Overview', url: '/' },
    ]

    for (const item of navigationCases) {
      await page.getByRole('link', { name: item.label }).click()

      await expect(page).toHaveURL(item.url)

      await expect(
        page.getByRole('heading', { name: item.heading }).first()
      ).toBeVisible()
    }
  })

  test('should mark the current navigation menu as active', async ({ page }) => {
    await page.goto('/')

    const dashboardLink = page.getByRole('link', {
      name: 'Dashboard Overview',
    })

    await expect(dashboardLink).toHaveAttribute('aria-current', 'page')

    await page.getByRole('link', {
      name: 'Accessibility Audit',
    }).click()

    await expect(
      page.getByRole('link', { name: 'Accessibility Audit' })
    ).toHaveAttribute('aria-current', 'page')
  })
})
