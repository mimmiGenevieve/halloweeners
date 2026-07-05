import { test, expect } from '@playwright/test'

test('calendar route rejects unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/calendar')
    expect(response.status()).toBe(404)
    const body = await response.text()
    expect(body).not.toContain('address') // loose smoke check against leakage
})

test('calendar route works with a valid token param', async ({ request }) => {
    const response = await request.get(
        `/api/calendar?token=${process.env.E2E_GUEST_TOKEN}`
    )
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/calendar')
    const body = await response.text()
    expect(body).toContain('BEGIN:VCALENDAR')
})
