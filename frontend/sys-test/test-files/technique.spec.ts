import { test, expect } from '../fixtures';
import { TechniquePage } from 'page-object-models/technique_page';

/**
 *
 *  @author Team Mango (Group 4)
 *  @since 2024-05-8
 *  @version 2.0
 */
test.describe('ST-2 Technique', () => {
	let techniquePage

	test.beforeEach('navigate to technique section', async ({page}) => {
		techniquePage = new TechniquePage(page)
		await techniquePage.visit()
		await expect(page.getByPlaceholder('Sök efter tekniker')).toBeVisible()
	})

  test('1. Create technique', async ({ page }) => {
		const name = Math.random().toString(36).slice(2, 7) // Will generate a random string of 5 characters
		await techniquePage.createTechnique({description: 'description description description', name: name, time: 12})
		await expect(page.getByText(`Tekniken ${name} skapades`)).toBeVisible()
    await page.waitForURL('**/activity')
		await techniquePage.deleteTechnique(name)
    await page.getByRole('link', { name: `${name}`}).isHidden()
  })
})