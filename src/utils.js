import { Cookies } from "react-cookie"

/**
 * Logs out the user and returns to the logIn screen
 */
export function logOut() {
	new Cookies().remove("token")
	document.location.replace("/")
}

export const HTTP_STATUS_CODES = {
	SUCCESS: 201,
	CONFLICT: 409,
	NOT_ACCEPTABLE: 406,
	TEAPOT: 418,
	INTERNAL_SERVER_ERROR: 500,
}