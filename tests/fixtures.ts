import { test as base } from '@playwright/test'
import { TokenAccessForm } from './pages/TokenAccessForm'
import { DetailsPage } from './pages/DetailsPage'
import { RsvpPage } from './pages/RsvpPage'
import { AdminPage } from './pages/AdminPage'

type Fixtures = {
    tokenForm: TokenAccessForm
    detailsPage: DetailsPage
    rsvpPage: RsvpPage
    adminPage: AdminPage
}

export const test = base.extend<Fixtures>({
    tokenForm: async ({ page }, use) => {
        await use(new TokenAccessForm(page))
    },
    detailsPage: async ({ page }, use) => {
        await use(new DetailsPage(page))
    },
    rsvpPage: async ({ page }, use) => {
        await use(new RsvpPage(page))
    },
    adminPage: async ({ page }, use) => {
        await use(new AdminPage(page))
    },
})

export { expect } from '@playwright/test'
