import { test, expect } from './fixtures'

const GUEST_TOKEN = process.env.E2E_GUEST_TOKEN!

test.describe('token authentication', () => {
    test('link-based entry authenticates', async ({ detailsPage }) => {
        await detailsPage.goto(GUEST_TOKEN)
        await detailsPage.expectAuthenticated()
        await detailsPage.tokenForm.expectNotShown()
    })

    test('form-based entry authenticates', async ({
        detailsPage,
        tokenForm,
    }) => {
        await detailsPage.goto()
        await tokenForm.submit(GUEST_TOKEN)
        await detailsPage.expectAuthenticated()
    })

    test('invalid token shows an error, does not authenticate', async ({
        detailsPage,
        tokenForm,
    }) => {
        await detailsPage.goto()
        await tokenForm.submit('not-a-real-token')
        await tokenForm.expectError()
        await expect(detailsPage.heading).not.toBeVisible()
    })

    test('token with digits is rejected client-side', async ({
        detailsPage,
        tokenForm,
    }) => {
        await detailsPage.goto()
        await tokenForm.submit('token-with-numbers-1234567890')
        await tokenForm.expectError()
        await expect(detailsPage.heading).not.toBeVisible()
    })

    test('session persists across reload', async ({ detailsPage, page }) => {
        await detailsPage.goto(GUEST_TOKEN)
        await detailsPage.expectAuthenticated()
        await page.reload()

        await detailsPage.expectAuthenticated()
    })
})
