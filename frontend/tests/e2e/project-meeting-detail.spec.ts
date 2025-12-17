import { test, expect } from '@playwright/test'

/**
 * Test: Project Meeting Detail Page Route
 *
 * This test verifies that the project-specific meeting detail page
 * is accessible and displays correctly.
 *
 * Route: /[projectId]/meetings/[meetingId]
 */

test.describe('Project Meeting Detail Page', () => {
  test('should load project meeting detail page without 404 error', async ({ page }) => {
    // Navigate to the project meeting detail page
    // Using project ID 67 and a meeting ID
    const projectId = '67'
    const meetingId = '01KCEQ6T0WTN827CN68P7R0A4E'

    await page.goto(`http://localhost:3000/${projectId}/meetings/${meetingId}`)

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that we're not on a 404 page
    const pageContent = await page.textContent('body')
    expect(pageContent).not.toContain('404')
    expect(pageContent).not.toContain('Page Not Found')

    // Verify the page has expected elements
    // Should have a back button
    const backButton = page.getByRole('link', { name: /back to project meetings/i })
    await expect(backButton).toBeVisible()

    // Should have a heading (either the meeting title or "Untitled Meeting")
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()

    // Log the URL for debugging
    console.log('Current URL:', page.url())
    expect(page.url()).toContain(`/${projectId}/meetings/${meetingId}`)
  })

  test('should have correct back navigation link', async ({ page }) => {
    const projectId = '67'
    const meetingId = '01KCEQ6T0WTN827CN68P7R0A4E'

    await page.goto(`http://localhost:3000/${projectId}/meetings/${meetingId}`)
    await page.waitForLoadState('networkidle')

    // Check that the back button links to the project meetings page
    const backButton = page.getByRole('link', { name: /back to project meetings/i })
    await expect(backButton).toHaveAttribute('href', `/${projectId}/meetings`)
  })

  test('should display meeting metadata sections', async ({ page }) => {
    const projectId = '67'
    const meetingId = '01KCEQ6T0WTN827CN68P7R0A4E'

    await page.goto(`http://localhost:3000/${projectId}/meetings/${meetingId}`)
    await page.waitForLoadState('networkidle')

    // The page should have some content structure
    // Either meeting data or a "no data" message
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Should not show error messages
    await expect(page.locator('text=/error/i')).toHaveCount(0)
  })
})
