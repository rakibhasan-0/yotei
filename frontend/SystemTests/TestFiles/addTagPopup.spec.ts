import { test, expect } from "../fixtures"
import { AddTagPopupPage } from "../PageObjectModels/addTagPopupPage"

test.describe("Test AddTagPopup", () => {
	let addTagPopupPage
    
	test.beforeEach("Navigate to a technique and edit it", async ({page}) => {
		addTagPopupPage = new AddTagPopupPage(page)
		await addTagPopupPage.visit()
		await expect(page.getByText("Taggar")).toBeVisible()
	})
    
	test("Add and remove a tag", async ({ page }) => {
		const tagName = Math.random().toString(36).slice(2, 7) 
		const tagId = Math.floor(Math.random() * (10000 - 1 + 1))

		await addTagPopupPage.addTag({tagName: tagName, tagId: tagId})
		await expect(page.getByText(tagName)).toHaveCount(1)

		await addTagPopupPage.deleteTag({tagName: tagName, tagId: tagId})
		await expect(page.getByText(tagName)).toHaveCount(0)
	})
})