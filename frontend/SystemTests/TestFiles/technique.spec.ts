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

  test('1. Create technique', async ({ page }) => {

	  // Will generate a random string of 5 characters
		const name = Math.random().toString(36).slice(2, 7) 
	
		await techniquePage.createTechnique(
			{
				description: 'description description description', 
				name: name, 
				time: 12, 
				tag:"kihon waza",
				mediaLink: "https://www.youtube.com/watch?v=N5znFa4RuVg"
			}
		)
	
		// Asserts technique was created successfully and waits for page to load
		await expect(page.getByText(`Tekniken ${name} skapades`)).toBeVisible()
    	await page.waitForURL('**/activity')
	
		// Deletes the new technique and asserts deletion
		await techniquePage.deleteTechnique(name)
    await expect(page.getByRole('link', { name: `${name}`})).toBeHidden()
  })
})