import { Page, test as base } from "@playwright/test"

class LoginPage {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	async login_admin() {
		await this.page.goto("/")
		await this.page.getByPlaceholder("Användarnamn").fill("admin")
		await this.page.getByPlaceholder("Lösenord").fill("admin")

		await this.page.getByRole("button", {name: "Logga in"}).click()
		await this.page.waitForURL(/\**\/plan/)
	}
}

export const test = base.extend<{ loginPage: LoginPage }>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page))
	},
})
