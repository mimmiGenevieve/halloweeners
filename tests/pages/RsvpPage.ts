import { Page, Locator, expect } from '@playwright/test'
import { TokenAccessForm } from './TokenAccessForm'

type RsvpInput = {
    name?: string
    email?: string
    bringingCompanion: boolean
    companionName?: string
    cipherAnswer?: string
}

export class RsvpPage {
    readonly page: Page
    readonly tokenForm: TokenAccessForm
    readonly heading: Locator
    readonly nameInput: Locator
    readonly emailInput: Locator
    readonly companionYes: Locator
    readonly companionNo: Locator
    readonly companionNameInput: Locator
    readonly cipherInput: Locator
    readonly submitButton: Locator
    readonly successMessage: Locator
    readonly errorMessage: Locator
    readonly firstTimeCopy: Locator
    readonly returningCopy: Locator
    readonly rsvpLink: Locator

    constructor(page: Page) {
        this.page = page
        this.tokenForm = new TokenAccessForm(page)
        this.heading = page.getByTestId('rsvp-heading')
        this.nameInput = page.locator('[name="name"]')
        this.emailInput = page.locator('[name="email"]')
        this.companionNameInput = page.locator('[name="companionName"]')
        this.cipherInput = page.locator('[name="cipherAnswer"]')
        this.companionYes = page.locator('input[name="bringingCompanionYes"]')
        this.companionNo = page.locator('input[name="bringingCompanionNo"]')
        this.submitButton = page.getByRole('button', { name: /Submit/ })
        this.successMessage = page.getByText(
            /spirits have received your answer/
        )
        this.errorMessage = page.getByText(
            'The spirits could not receive your answer. Please try again.'
        )
        this.firstTimeCopy = page.getByTestId('rsvp-first-time')
        this.returningCopy = page.getByTestId('rsvp-returning')
        this.rsvpLink = page.getByTestId('rsvp-link')
    }

    async goto(token?: string) {
        await this.page.goto(token ? `/?token=${token}` : '/')
        await expect(this.rsvpLink).toBeVisible()
        await this.rsvpLink.click()
    }

    async fillAndSubmit(input: RsvpInput) {
        if (input.name) await this.nameInput.fill(input.name)
        if (input.email) await this.emailInput.fill(input.email)
        await (
            input.bringingCompanion ? this.companionYes : this.companionNo
        ).click()
        if (input.bringingCompanion && input.companionName) {
            await this.companionNameInput.fill(input.companionName)
        }
        if (input.cipherAnswer) await this.cipherInput.fill(input.cipherAnswer)
        await this.submitButton.click()
    }

    async expectSuccess() {
        await expect(this.successMessage).toBeVisible()
    }
}
