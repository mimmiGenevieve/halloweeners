import { Page, Locator } from '@playwright/test'
import { TokenAccessForm } from './TokenAccessForm'

export class AdminPage {
    readonly page: Page
    readonly tokenForm: TokenAccessForm
    readonly adminContent: Locator
    readonly adminLink: Locator

    constructor(page: Page) {
        this.page = page
        this.tokenForm = new TokenAccessForm(page)
        this.adminContent = page.getByTestId('admin-page-content')
        this.adminLink = page.getByTestId('admin-link')
    }

    async goto(token: string) {
        await this.page.goto(`/?token=${token}`)
    }
}
