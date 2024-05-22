import { type Page } from "@playwright/test"
import { TagComponent } from "../Types/systemTestsTypes"

/**
 *  Tests related to addTagPopup, in this test the window is tested on a technique. 
 * 	Should work just fine on any other place where tags are used. 
 *  @author Team Durian (Group 3)
 *  @since 2024-05-22
 *  @version 1.0
 */

export class AddTagPopupPage {
	readonly page: Page
	readonly url: string = "/technique/1/edit"

	public constructor(page: Page) {
		this.page = page
	}

	async visit() {
		await this.page.goto(this.url)
	}

	/**
	 * Adds a tag to a technique. 
	 * @param tag The tag to be added. 
	 */
	async addTag(tag: TagComponent) {
		//Open the popup and search for the tag name.
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)
		
		//Add the tag. 
		const tagAddButton = this.page.locator("#tag-add-button")
		await tagAddButton.waitFor({ state: "visible" })
		await tagAddButton.click()

		//Close the window and save the newly added tag.
		const saveAndCloseButton = this.page.locator("#save-and-close-button")
		await saveAndCloseButton.waitFor({ state: "visible" })
		await saveAndCloseButton.click()

		//Save the technique so the newly added tag is saved with it. 
		await this.page.getByRole("button", { name: "Spara" }).click()
		await this.page.goto("/technique/1")
	}

	async deleteTag(tag: TagComponent) {
		//Open the popup and search for the tag to be deleted. 
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)

		//Uncheck the tag.
		await this.page.getByTestId("EditableListItem").locator("label").waitFor({state: "visible"})
		await this.page.getByTestId("EditableListItem").locator("label").uncheck()

		//Close the popup and save the technique
		await this.page.locator("#save-and-close-button").click()
		await this.page.getByRole("button", { name: "Spara" }).click()

		//Go back and open the popup and search for the tag. 
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)
		await this.page.getByTestId("EditableListItem").locator("label").waitFor({state: "visible"})

		//Wait for result to appear.
		await this.page.getByTestId("EditableListItem").locator("label").waitFor({state: "visible"})

		//Remove the tag from the database. 
		await this.findComponents(tag, "#close-icon")
		await this.page.getByRole("button", { name: "Ta bort" }).click()
		await this.page.locator("#save-and-close-button").click()
	}

	/**
	 * Finds the component to click within the EditableListItem. 
	 * @param tag The tag that exist in the EditableListItem. 
	 * @param name The name of the component to be clicked. 
	 */
	async findComponents(tag, name) {
		let locator = this.page.getByText(tag.tagName, { exact: true })

		
		locator = locator.locator("..")
		
		
		await locator.locator(name).click()
	}
}
