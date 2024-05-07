import { expect, request } from "@playwright/test"
import { Account } from "../types/systemTestsTypes"

/**
 * Fixtures related to handling creation and deletion of a user. 
 *
 *  @author Team Mango (Group 4)
 *  @since 2024-05-6
 *  @version 2.0
 */
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
		const response = await ctx.post("/api/users/verify", {
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
	static async register_user(user: Account) {
		const ctx = await UserApi.make_ctx()
		const response = await ctx.post("/api/users", {
			data: {
				username: user.username,
				password: user.password,
				userRole: user.role,
			},
		})

		expect(response.status()).toBe(200)
		return response.json()
	}

	/**
     * Ta bort en användare.
     * 
     * @param username 
     */
	static async remove_user(username: string) {
		const ctx = await UserApi.make_ctx()
		await ctx.delete("/api/users/" + username)
	}
}
