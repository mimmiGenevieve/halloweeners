import { test, expect } from './fixtures'

const ADMIN_TOKEN = process.env.E2E_ADMIN_TOKEN!

test('non-admin guest cannot reach admin data', async ({ page }) => {
    await page.goto('/admin?token=invalid-token')

    const response = await page.request.get('/api/admin-data/invited')
    const body = await response.json()

    expect(body?.guests).toBeUndefined()
    expect(body?.winners).toBeUndefined()
})

test('admin token can reach admin data', async ({ adminPage }) => {
    await adminPage.goto(ADMIN_TOKEN)
    await adminPage.adminLink.click()
    await expect(adminPage.adminContent).toBeVisible()
})
