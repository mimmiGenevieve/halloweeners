import { Page, Locator, expect } from '@playwright/test'

export class TokenAccessForm {
    readonly page: Page
    readonly tokenInput: Locator
    readonly submitButton: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        this.page = page
        this.tokenInput = page.getByTestId('token-input')
        this.submitButton = page.getByTestId('token-submit')
        this.errorMessage = page.getByText(
            'The spirits do not recognize that token'
        )
    }

    async submit(token: string) {
        await this.tokenInput.fill(token)
        await this.submitButton.click()
    }

    async expectError() {
        await expect(this.errorMessage).toBeVisible()
    }

    async expectNotShown() {
        await expect(this.tokenInput).not.toBeVisible()
    }
}
