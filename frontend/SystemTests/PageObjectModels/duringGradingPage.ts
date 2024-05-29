import { type Page } from '@playwright/test'
import { test, expect } from '@playwright/test';

import { Examinee, Comment } from '../Types/systemTestsTypes'


export class DuringGradingPage {
    readonly page: Page


    public constructor(page: Page) {
        this.page = page
    }

    async visit(url: string) {
        await this.page.goto(url)
    }

    async createGrading() {
        await this.page.goto('/grading/create');
        await this.page.getByRole('button', { name: 'KYU GULT BÄLTE' }).click();
        await this.page.getByText('Lägg till ett namn på').click();
        await this.page.locator('#edit-element').fill('Systest123');
        await this.page.getByPlaceholder('Lägg till ny deltagare').click();
        await this.page.getByPlaceholder('Lägg till ny deltagare').fill('TestPerson1');
        await this.page.getByPlaceholder('Lägg till ny deltagare').press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.getByPlaceholder('Lägg till ny deltagare').fill('TestPerson2');
        await this.page.getByPlaceholder('Lägg till ny deltagare').press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.getByPlaceholder('Lägg till ny deltagare').fill('TestPerson3');
        await this.page.getByPlaceholder('Lägg till ny deltagare').press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.getByPlaceholder('Lägg till ny deltagare').fill('TestPerson4');
        await this.page.getByPlaceholder('Lägg till ny deltagare').press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.getByRole('button', { name: 'Fortsätt' }).click();
        await this.page.getByRole('button', { name: 'Ja' }).click();

    }

    async addGroupComment(comment: Comment) {
        await this.page.waitForTimeout(500);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }
    async navigateToGroupComment(){
        await this.page.locator('#infoPanel i').click();
        await this.page.waitForTimeout(100);
    }

    async addExamineeComment(comment: Comment) {
        await this.page.waitForTimeout(100);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }
    async navigateToExamineeComment(comment: Comment){
        await this.page.getByTestId(comment.examineeName + "systest").locator('i').click();
        await this.page.waitForTimeout(100);
    }
    
    async addPairComment(comment: Comment) {
        await this.page.waitForTimeout(100);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }
    async navigateToPairComment(comment: Comment){
        await this.page.getByTestId(comment.pairId).locator('i').click();
        await this.page.waitForTimeout(100);
    }
    async closePairPopup(){
        await this.page.locator('#pair-comment-popup').getByRole('button').first().click();
    }
    async closeExamineePopup(){
        await this.page.locator('#examinee-comment-popup').getByRole('button').first().click();
    }
    async closeGroupPopup(){
        await this.page.locator('#group-comment-popup').getByRole('button').first().click();
    }

    async setPassResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    async setFailResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    async setDefaultResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    async moveToNextTechnique() {
        await this.page.locator('#next_technique').getByRole('img').click();
        await this.page.waitForTimeout(100);

    }

    async moveToPreviousTechnique() {
        await this.page.locator('#prev_technique').getByRole('img').click();
        await this.page.waitForTimeout(100);
    }

    async moveToRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'YAKUSOKU GEIKO ELLER RANDORI' }).click();
    }

    async moveBackFromRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'Tillbaka till 5. Stryptag' }).click();
    }

    async getCurrentUrl(): Promise<string> {
        const parts = this.page.url().split('/')
        const gradingId = parts[4];
        return gradingId
    }
    async saveGrading() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'Fortsätt till summering' }).click();
        await this.page.getByRole('button', { name: 'Spara och avsluta' }).click();
    }
    async removeGrading() {
        await this.page.waitForTimeout(500);
        const targetText = 'Systest123'; 

        const targetDiv = this.page.locator(`text=${targetText}`).locator('..');

        const trashIcon = targetDiv.locator('[data-testid="trash-icon"]');

        await trashIcon.click();
        await this.page.getByRole('button', { name: 'Ja' }).click();
    }
}