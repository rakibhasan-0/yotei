import { test, expect } from "../fixtures"
import { GradingBefore } from "../PageObjectModels/gradingBeforePage"

/**
 *  Tests related to grading before page.
 *  @author Team Pomegrade (Group 1)
 *  @since 2024-05-22
 *  @version 1.0
 */

test.describe("Test gradingBefore", () => {
	let gradingBeforePage
    
	test.beforeEach("Navigate to gradingCreate page", async ({page}) => {
		gradingBeforePage = new GradingBefore(page)
		await gradingBeforePage.visit()
		await expect(page.getByText("Välj graderingsprotokoll")).toBeVisible()
	})
    
	//Tests the functionality of the tag system by adding and removing a tag.
	test("Create grading", async ({ page }) => {

    await page.getByRole('button', { name: 'KYU GRÖNT BÄLTE' }).click()

    // Add examinees
    await gradingBeforePage.addExaminee("a")
    await gradingBeforePage.addExaminee("b")
    await gradingBeforePage.addExaminee("c")

    // Check if examinees have been added
    await expect(page.getByText('a', {exact: true})).toBeVisible()
    await expect(page.getByText('b', {exact: true})).toBeVisible()
    await expect(page.getByText('c', {exact: true})).toBeVisible()

    // Check to see if #pair-icon is visible
    await expect(page.locator('#pair-icon')).toBeVisible()

    // Split up pair and check if #pair-icon is hidden
    await page.locator('#pair-icon').click()
    await expect(page.locator('#pair-icon')).toBeHidden()

    // Create pair and check if #pair-icon is visible again
    await gradingBeforePage.createPair('b','c')
    await expect(page.locator('#pair-icon')).toBeVisible()

    // Remove examinee
    await gradingBeforePage.removeExaminee('a')
    await expect(page.getByText('a', {exact: true})).toBeHidden()

    // Add examinee and set grading name
    await gradingBeforePage.addExaminee('d')
		await gradingBeforePage.setGradingName('test-systest')

    // Exit grading create page by going back and then returning
    await page.getByRole('button', { name: 'Tillbaka' }).click()
    await page.goto('/grading')
    await page.locator('#test-systest0').click()

    // Split up existing pair and create a new pair
    await page.locator('#pair-icon').click()
    await gradingBeforePage.createPair('c','d')

    // Add examinee
    await gradingBeforePage.addExaminee("e")

    // Exit grading create page by starting the grading and then returning
    await page.getByRole('button', { name: 'Fortsätt' }).click()
    await page.getByRole('button', { name: 'Ja' }).click()
    await page.getByRole('button', { name: 'Navigering', exact: true }).click()
    await page.getByRole('button', { name: 'Tillbaka till "Lägg till deltagare"' }).click()

    // Check if #lock-icon exists for the pair and single examinee. 
    await expect(page.locator('#lock-icon')).toHaveCount(3)

    // Delete grading
    await gradingBeforePage.deleteGrading('test-systest')
	})
})