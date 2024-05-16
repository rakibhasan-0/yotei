import { Page, test as base } from "@playwright/test"

class LoginPage {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	async login_admin() {
		await this.page.goto("/")
		await this.page.locator('input[type="user"]').fill("admin")
		await this.page.locator('input[type="password"]').fill("admin")

    await this.page.locator('#login-button').click();
    await this.page.waitForURL(/\**\/plan/);
	}
}

export const test = base.extend<{ loginPage: LoginPage }>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page))
	},
})
