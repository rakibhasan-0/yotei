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

		const editButton = Math.floor(Math.random() * (10000 - 1 + 1))

		const deleteButton = Math.floor(Math.random() * (10000 - 1 + 1))

		const addButton = Math.floor(Math.random() * (10000 - 1 + 1))

		const checkbox = Math.floor(Math.random() * (10000 - 1 + 1))

		const tagId = Math.random()

		await addTagPopupPage.addTag({tagName: tagName, tagId: tagId, editButton: editButton, deleteButton: deleteButton, addButton: addButton, checkbox: checkbox})

		await expect(page.getByText(tagName)).toHaveCount(1)

		await addTagPopupPage.deleteTag(tagName)

		await expect(page.getByText(tagName)).toHaveCount(0)


		// Act by calling methods in POM and assert by using expect.
		// Do not forget to delete data in the database that was created during the test.  
	})
})