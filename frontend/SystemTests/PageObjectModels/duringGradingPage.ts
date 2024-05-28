import { type Page } from '@playwright/test'
import { test, expect } from '@playwright/test';

import { Examinee, Comment } from '../Types/systemTestsTypes'


export class DuringGradingPage {
    readonly page: Page
    readonly url: string = '/grading/:gradingId:/2'

    public constructor(page: Page) {
        this.page = page
    }

    async visit() {
        await this.page.goto(this.url)
    }

    async addGroupComment(comment: Comment) {
        await this.page.locator('#infoPanel i').click();
        await this.page.locator('#TextareaTestId').click();
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    async addExamineeComment(comment: Comment) {
        await this.page.locator('fieldset').filter({ hasText: /^TestPerson2$/ }).locator('i').click();
        await this.page.locator('#TextareaTestId').click();
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    async addPairComment(comment: Comment) {

        await this.page.getByText('P1TestPerson21TestPerson1').click();
        await this.page.locator('#TextareaTestId').click();
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    async setPassResultForExaminee(examinee: Examinee) {
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
    }

    async setFailResultForExaminee(examinee: Examinee) {
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
    }

    async setDefaultResultForExaminee(examinee: Examinee) {
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
        await this.page.locator('div').filter({ hasText: examinee.name }).nth(2).click();
    }

    async moveToNextTechnique() {
        await this.page.locator('#next_technique').getByRole('img').click();

    }

    async moveToPreviousTechnique() {
        await this.page.locator('#prev_technique').getByRole('img').click();
    }

    async moveToRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'YAKUSOKU GEIKO ELLER RANDORI' }).click();
    }

    async moveBackFromRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'Tillbaka till 5. Stryptag' }).click();
    }
}