import { test, expect } from '../fixtures';
import { TechniquePage } from '../PageObjectModels/techniquePage';

/**
 *  Tests related to technique tab at the page /activity.  
 *  @author Team Mango (Group 4)
 *  @since 2024-05-17
 *  @version 2.0
 */
test.describe('Technique test', () => {
	let techniquePage

	test.beforeEach('navigate to technique section', async ({page}) => {
		techniquePage = new TechniquePage(page)
		await techniquePage.visit()
		await expect(page.getByPlaceholder('Sök efter tekniker')).toBeVisible()
	})

  test('1. create technique with description, name and time should display success toast', async ({ page }) => {
		// Create a new technique 
		const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters
		await techniquePage.createTechnique({description: 'description description description', name: name, time: 12})
		await expect(page.getByText(`Tekniken ${name} skapades`)).toBeVisible()

		// Delete the newly created technique
    await page.waitForURL('**/activity')
		await techniquePage.deleteTechnique(name)
    await expect(page.getByRole('link', { name: `${name}`})).toBeHidden()
  })
})