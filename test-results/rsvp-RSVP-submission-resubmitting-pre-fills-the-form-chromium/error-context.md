# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rsvp.spec.ts >> RSVP submission >> resubmitting pre-fills the form
- Location: tests\rsvp.spec.ts:35:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('rsvp-returning')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('rsvp-returning')

```

```yaml
- main:
  - heading "The Halloweeners" [level=1]
  - paragraph: An Invitation to the Eternal Night.
  - link "Details":
    - /url: /
  - text: "|"
  - link "RSVP":
    - /url: /rsvp
  - paragraph: Essential Details for the Night
  - text: "Date: October 31st, 2026. Time: 6pm to late Location: Kungsportsavenyen 1, 411 36 Göteborg."
  - link "Directions.":
    - /url: https://www.google.com/maps/search/?api=1&query=Kungsportsavenyen%201%2C%20411%2036%20G%C3%B6teborg
  - text: Upon your arrival, call Twoday on the intercom to be granted entry.
  - paragraph: Bring your own elixir of choice, though light snacks will be provided.
  - paragraph: "Prizes will be bestowed in the following categories: Best Duo, Best Single, Scariest, and Most Creative."
  - paragraph: The gathering begins promptly. Tardiness is not advised.
  - paragraph: The night awaits you; let the shadows guide your way.
- contentinfo:
  - paragraph: This site uses a single cookie to remember your invitation token, so you don't have to re-enter it. Your name and email are stored to manage your RSVP and send confirmation details—nothing is shared with third parties.
  - paragraph:
    - text: Questions about your data, or want it removed?
    - link "You know who to ask":
      - /url: mailto:mimmisandgren+halloweeners@gmail.com
    - text: .
- alert
```

# Test source

```ts
  1  | import { test, expect } from './fixtures'
  2  | 
  3  | const GUEST_TOKEN = process.env.E2E_GUEST_TOKEN!
  4  | const WINNER_TOKEN = process.env.E2E_GUEST_TOKEN_WINNER!
  5  | 
  6  | test.describe('previous-year winner banner', () => {
  7  |     test('winner sees the champion reminder', async ({ detailsPage }) => {
  8  |         await detailsPage.goto(WINNER_TOKEN)
  9  |         await detailsPage.expectAuthenticated()
  10 |         await detailsPage.expectWinnerBanner(true)
  11 |     })
  12 | 
  13 |     test('non-winner does not', async ({ detailsPage }) => {
  14 |         await detailsPage.goto(GUEST_TOKEN)
  15 |         await detailsPage.expectAuthenticated()
  16 |         await detailsPage.expectWinnerBanner(false)
  17 |     })
  18 | })
  19 | 
  20 | test.describe('RSVP submission', () => {
  21 |     test('non-winner can submit a first-time RSVP', async ({ rsvpPage }) => {
  22 |         await rsvpPage.goto(GUEST_TOKEN)
  23 |         await expect(rsvpPage.firstTimeCopy).toBeVisible()
  24 | 
  25 |         await rsvpPage.fillAndSubmit({
  26 |             email: 'e2e-guest@example.com',
  27 |             bringingCompanion: true,
  28 |             companionName: 'E2E Companion',
  29 |             cipherAnswer: 'shadow',
  30 |         })
  31 | 
  32 |         await rsvpPage.expectSuccess()
  33 |     })
  34 | 
  35 |     test('resubmitting pre-fills the form', async ({ rsvpPage, page }) => {
  36 |         await rsvpPage.goto(GUEST_TOKEN)
  37 |         await page.reload()
  38 | 
> 39 |         await expect(rsvpPage.returningCopy).toBeVisible()
     |                                              ^ Error: expect(locator).toBeVisible() failed
  40 |         await expect(rsvpPage.emailInput).toHaveValue('e2e-guest@example.com')
  41 |         await expect(rsvpPage.companionNameInput).toHaveValue('E2E Companion')
  42 |     })
  43 | 
  44 |     test('submitting without editing anything is blocked', async ({
  45 |         rsvpPage,
  46 |     }) => {
  47 |         await rsvpPage.goto(GUEST_TOKEN)
  48 |         await expect(rsvpPage.submitButton).toBeDisabled()
  49 |     })
  50 | })
  51 | 
```