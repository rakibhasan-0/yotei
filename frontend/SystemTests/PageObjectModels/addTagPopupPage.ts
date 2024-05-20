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
		tag.tagName && await this.page.getByPlaceholder("Sök eller skapa tagg").fill(tag.tagName)
		await this.page.locator("#tag-add-button").click()
		await this.page.locator("#save-and-close-button").click()
		// generate code with codegen in the next step
	}

	async deleteTag(name: string) {
		await this.page.getByRole("button", { name: "Spara" }).click()
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(name)
		await this.page.getByTestId("EditableListItem-link").getByLabel("").uncheck()
		await this.page.locator("#save-and-close-button").click()
		await this.page.getByRole("button", { name: "Spara" }).click()
		await this.page.goto(this.url)
		await this.page.getByRole("button", { name: "Hantera tagg" }).click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").click()
		await this.page.getByPlaceholder("Sök eller skapa tagg").fill(name)
		await this.page.locator("#close-icon").click()
		await this.page.getByRole("button", { name: "Ta bort" }).click()
		await this.page.locator("#save-and-close-button").click()
		// generate code with codegen in the next step
	}


}