import { resetRsvpForToken } from './db'
import { test, expect } from './fixtures'

const GUEST_TOKEN = process.env.E2E_GUEST_TOKEN!
const WINNER_TOKEN = process.env.E2E_GUEST_TOKEN_WINNER!

test.describe('previous-year winner banner', () => {
    test('winner sees the champion reminder', async ({ detailsPage }) => {
        await detailsPage.goto(WINNER_TOKEN)
        await detailsPage.expectAuthenticated()
        await detailsPage.expectWinnerBanner(true)
    })

    test('non-winner does not', async ({ detailsPage }) => {
        await detailsPage.goto(GUEST_TOKEN)
        await detailsPage.expectAuthenticated()
        await detailsPage.expectWinnerBanner(false)
    })
})

test.describe('RSVP submission', () => {
    test.beforeAll(async () => {
        await resetRsvpForToken(GUEST_TOKEN)
    })

    test('non-winner can submit a first-time RSVP', async ({ rsvpPage }) => {
        await rsvpPage.goto(GUEST_TOKEN)
        await expect(rsvpPage.firstTimeCopy).toBeVisible()

        await rsvpPage.fillAndSubmit({
            email: 'e2e-guest@example.com',
            bringingCompanion: true,
            companionName: 'E2E Companion',
            cipherAnswer: 'shadow',
        })

        await rsvpPage.expectSuccess()
    })

    test('resubmitting pre-fills the form', async ({ rsvpPage, page }) => {
        await rsvpPage.goto(WINNER_TOKEN)

        await expect(rsvpPage.returningCopy).toBeVisible()
        await expect(rsvpPage.emailInput).toHaveValue('e2e-guest@example.com')
        await expect(rsvpPage.companionNameInput).toHaveValue('E2E Companion')
    })

    test('submitting without editing anything is blocked', async ({
        rsvpPage,
    }) => {
        await rsvpPage.goto(GUEST_TOKEN)
        await expect(rsvpPage.submitButton).toBeDisabled()
    })
})
