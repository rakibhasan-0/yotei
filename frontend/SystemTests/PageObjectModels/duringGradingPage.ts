import { type Page } from '@playwright/test'
import { Examinee, Comment } from '../Types/systemTestsTypes'

/**
 *  
 *  Page Object Model for the grading during page with url /groups/${gradingId}/2.
 * 
 *  @author Team Orange (Group 5, c19jen, ens21ljn)
 *  @since 2024-05-29
 *  @version 1.0
 */
export class DuringGradingPage {
    readonly page: Page

    /**
     * Constructor for creating new instances.
     * @param page to be created.
     */
    public constructor(page: Page) {
        this.page = page
    }

    /**
     * Function to go to a desired url.
     * @param url url to the grading page.
     */
    async visit(url: string) {
        await this.page.goto(url)
    }

    /**
     * Creates a grading to be used for the tests.
     */
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

    /**
     * Adds a group comment on a specified technique.
     * @param comment comment entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async addGroupComment(comment: Comment) {
        await this.page.waitForTimeout(500);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    /**
     * Navigates to the group comment popup.
     */
    async navigateToGroupComment(){
        await this.page.locator('#infoPanel i').click();
        await this.page.waitForTimeout(100);
    }

    /**
     * Adds an examinee comment on a specified technique and person.
     * @param comment comment entity which can be viewed in the 'systemTestsTypes.ts' 
     */
    async addExamineeComment(comment: Comment) {
        await this.page.waitForTimeout(100);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    /**
     * Navigates to a specific examinee's popup.
     * @param comment comment entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async navigateToExamineeComment(comment: Comment){
        await this.page.getByTestId(comment.examineeName + "systest").locator('i').click();
        await this.page.waitForTimeout(100);
    }
    
    /**
     * Adds a pair comment on a specified technique and pair.
     * @param comment comment entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async addPairComment(comment: Comment) {
        await this.page.waitForTimeout(100);
        await this.page.locator('#TextareaTestId').fill(comment.content);
        await this.page.getByRole('button', { name: 'Lägg till' }).click();
    }

    /**
     * Navigates to the pair comment popup.
     * @param comment comment entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async navigateToPairComment(comment: Comment){
        await this.page.getByTestId(comment.pairId).locator('i').click();
        await this.page.waitForTimeout(100);
    }

    /**
     * Closes the pair popup window.
     */
    async closePairPopup(){
        await this.page.locator('#pair-comment-popup').getByRole('button').first().click();
    }

    /**
     * Closes the examinee popup window.
     */
    async closeExamineePopup(){
        await this.page.locator('#examinee-comment-popup').getByRole('button').first().click();
    }

    /**
     * Closes the group popup window.
     */
    async closeGroupPopup(){
        await this.page.locator('#group-comment-popup').getByRole('button').first().click();
    }

    /**
     * Sets the result for a specific examinee to a passing grade
     * @param examinee examinee entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async setPassResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    /**
     * Sets the result for a specific examinee to a failing grade
     * @param examinee examinee entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async setFailResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    /**
     * Sets the result for a specific examinee to a default (not anything) grade
     * @param examinee examinee entity which can be viewed in the 'systemTestsTypes.ts'
     */
    async setDefaultResultForExaminee(examinee: Examinee) {
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
        await this.page.waitForTimeout(100);
        await this.page.getByText(examinee.name, { exact: true }).first().click();
    }

    /**
     * Moves the page to the next technique.
     */
    async moveToNextTechnique() {
        await this.page.locator('#next_technique').getByRole('img').click();
        await this.page.waitForTimeout(100);

    }

    /**
     * Moves the page to the previous technique.
     */
    async moveToPreviousTechnique() {
        await this.page.locator('#prev_technique').getByRole('img').click();
        await this.page.waitForTimeout(100);
    }

    /**
     * Moves to the technique YAKUSOLU GEIKO ELLER RANDORI.
     * (This is not tested, yet)
     */
    async moveToRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'YAKUSOKU GEIKO ELLER RANDORI' }).click();
    }

    /**
     * Moves back to the technique the page was at before moving to randori.
     * (This is not tested, yet)
     */
    async moveBackFromRandori() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'Tillbaka till 5. Stryptag' }).click();
    }

    /**
     * Used for dissecting the url to get the created gradingId.
     * @returns the gradingId of the newly created grading.
     */
    async getCurrentUrl(): Promise<string> {
        const parts = this.page.url().split('/')
        const gradingId = parts[4];
        return gradingId
    }

    /**
     * Saves a grading so it will be set at a finished status.
     */
    async saveGrading() {
        await this.page.getByRole('button', { name: 'Tekniker', exact: true }).click();
        await this.page.getByRole('button', { name: 'Fortsätt till summering' }).click();
        await this.page.getByRole('button', { name: 'Spara och avsluta' }).click();
    }

    /**
     * Removes a grading from the database so it doesn't linger after the test has been run.
     */
    async removeGrading() {
        await this.page.waitForTimeout(500);
        const targetText = 'Systest123'; 
        const targetDiv = this.page.locator(`text=${targetText}`).locator('..');
        const trashIcon = targetDiv.locator('[data-testid="trash-icon"]');
        await trashIcon.click();
        await this.page.getByRole('button', { name: 'Ja' }).click();
    }
}