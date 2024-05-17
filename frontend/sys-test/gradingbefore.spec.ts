import { expect } from "@playwright/test"
import { test } from "@fixtures/login_page"


test.describe("GradingBefore tests", () => {

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.login_admin()
    await loginPage.page.goto("/grading/create")
    await loginPage.page.locator('#Gult').click()

	})

  test('.1 Lägga till användare', async ({ page }) => {
    await page.locator('#add-examinee').press('Enter')

		await page.locator('#add-examinee').fill('jan')
    await page.locator('#add-examinee').press('Enter')
    await expect(page.locator('#add-examinee')).toBeEmpty
    await expect(page.getByText('jan')).toHaveCount(1)

    await page.locator('#add-examinee').fill('erikåäö')
    await page.locator('#add-examinee').press('Enter')
    await expect(page.getByText('erikåäö')).toHaveCount(1)

    await page.locator('#add-examinee').fill('jan')
    await page.locator('#plus-icon').click()
    await expect(page.locator('#add-examinee')).toBeEmpty
    await expect(page.getByText('jan')).toHaveCount(2)

    await expect(page.locator('#checkbox-element')).toHaveCount(3)
    await expect(page.locator('#close-icon')).toHaveCount(3)
    await expect(page.locator('#pencil-icon')).toHaveCount(3)
	});

  test('.2 Tabort användare', async ({ page }) => {

		await page.locator('#add-examinee').fill('jan')
    await page.locator('#add-examinee').press('Enter')

    await page.getByText('jan').locator('#close-icon').click
    await expect(page.getByText('jan')).toHaveCount(0)
    
	});


  test('.3 Redigera användarnamn', async ({ page }) => {

		await page.locator('#add-examinee').fill('jan')
    await page.locator('#add-examinee').press('Enter')

    await page.locator('#pencil-icon').dispatchEvent('click');
    await page.locator('#edit-element').fill('jan-åke')
    await page.locator('#accept-icon').dispatchEvent('click');

    await expect(page.getByText('jan-åke')).toHaveCount(1)
    
	});

})
