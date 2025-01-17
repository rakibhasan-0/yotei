import { test, expect } from "../fixtures"
import { AddTagPopupPage } from "../PageObjectModels/addTagPopupPage"

/**
 *  Tests related to addTagPopup, in this test the window is tested on a technique. 
 * 	Should work just fine on any other place where tags are used. 
 *  @author Team Durian (Group 3)
 *  @since 2024-05-22
 *  @version 1.0
 */

test.describe("Test AddTagPopup", () => {
	let addTagPopupPage
    
	test.beforeEach("Navigate to a technique and edit it", async ({page}) => {
		addTagPopupPage = new AddTagPopupPage(page)
		await addTagPopupPage.visit()
		await expect(page.getByText("Taggar")).toBeVisible()
	})
    
	//Tests the functionality of the tag system by adding and removing a tag.
	test("Add and remove a tag", async ({ page }) => {
		const tagName = Math.random().toString(36).slice(2, 7) 
		const tagId = Math.floor(Math.random() * (10000 - 1 + 1))

		await addTagPopupPage.addTag({tagName: tagName, tagId: tagId})
		await expect(page.getByText(tagName)).toBeVisible()
		//await expect(page.getByText(tagName)).toHaveCount(1)

		await addTagPopupPage.deleteTag({tagName: tagName, tagId: tagId})
		//await expect(page.getByText(tagName)).toHaveCount(0)
		await expect(page.getByText(tagName)).toBeHidden()
	})
})