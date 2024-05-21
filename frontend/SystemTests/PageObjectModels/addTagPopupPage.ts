import { type Page } from "@playwright/test"
import { TagComponent } from "../Types/systemTestsTypes"

export class AddTagPopupPage {
	readonly page: Page
	readonly url: string = "/technique/138/edit"

	public constructor(page: Page) {
		this.page = page
	}

	async visit() {
		await this.page.goto(this.url)
	}

	async addTag(tag: TagComponent) {
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		if (tag.tagName) {
			await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)
		}

		const tagAddButton = this.page.locator("#tag-add-button")
		await tagAddButton.waitFor({ state: "visible" })
		await this.waitForEnabled(tagAddButton)

		await tagAddButton.click()

		const saveAndCloseButton = this.page.locator("#save-and-close-button")
		await saveAndCloseButton.waitFor({ state: "visible" })
		await this.waitForEnabled(saveAndCloseButton)

		await saveAndCloseButton.click()
	}

	async deleteTag(tag: TagComponent) {
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)

		await this.page.getByTestId("EditableListItem-link").locator("label")
		//await editableListItem.waitFor({ state: "visible" })

		//await editableListItem.uncheck()

		await this.page.locator("#save-and-close-button").click()
		await this.page.getByRole("button", { name: "Spara" }).click()
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)
		await this.page.getByTestId("trash-icon" + tag.tagId).click()
		await this.page.getByRole("button", { name: "Ta bort" }).click()
		await this.page.locator("#save-and-close-button").click()
	}

	async waitForEnabled(locator) {
		await locator.waitFor({ state: "visible" })
		for (let i = 0; i < 20; i++) {
			if (await locator.isEnabled()) {
				return
			}
			await this.page.waitForTimeout(100)
		}
		throw new Error("Element not enabled in time")
	}
}
