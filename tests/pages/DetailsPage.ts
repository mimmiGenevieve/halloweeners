import { Page, Locator, expect } from '@playwright/test'
import { TokenAccessForm } from './TokenAccessForm'

export class DetailsPage {
    readonly page: Page
    readonly tokenForm: TokenAccessForm
    readonly heading: Locator
    readonly championBanner: Locator
    readonly directionsLink: Locator

    constructor(page: Page) {
        this.page = page
        this.tokenForm = new TokenAccessForm(page)
        this.heading = page.getByText('Essential Details for the Night')
        this.championBanner = page.getByTestId('prev-winner-info')
        this.directionsLink = page.getByRole('link', { name: 'Directions.' })
    }

    async goto(token?: string) {
        await this.page.goto(token ? `/?token=${token}` : '/')
    }

    async expectAuthenticated() {
        await expect(this.heading).toBeVisible()
    }

    async expectWinnerBanner(visible: boolean) {
        visible
            ? await expect(this.championBanner).toBeVisible()
            : await expect(this.championBanner).not.toBeVisible()
    }
}
