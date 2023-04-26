import { expect, request } from "@playwright/test"

export class UserApi {

	private static async make_ctx() {
		const ctx = await request.newContext({
			extraHTTPHeaders: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"token": await UserApi.get_admin_token(),
			},
		})

		return ctx
	}

	static async get_admin_token() {
		const ctx = await request.newContext({
			extraHTTPHeaders: {
				"Content-Type": "application/json",
			}
		})
		const response = await ctx.post("/user/verify", {
			failOnStatusCode: true,
			data: {
				username: "admin",
				password: "admin",
			},
		})

		return (await response.body()).toString()
	}

	/**
     * Skapar en ny användare. Går inte fel om användaren redan finns.
     * 
     * @param username Användarnamn för ny användare
     * @param password Lösenord för ny användare
     * @param is_admin Sant om användaren ska bli admin
     */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static async register_user(username: string, password: string, is_admin: boolean) {
		const ctx = await UserApi.make_ctx()

		await UserApi.remove_user(username)
		const response = await ctx.post("/user/register", {
			data: {
				username: username,
				password: password,
				userRole: 0,
			},
		})
		expect(response.status()).toBeLessThan(400)
	}

	/**
     * Ta bort en användare.
     * 
     * @param username 
     */
	static async remove_user(username: string) {
		const ctx = await UserApi.make_ctx()
		await ctx.delete("/user/remove/" + username)
	}
}
