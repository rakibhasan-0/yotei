import { Cookies } from "react-cookie"

/**
 * Logs out the user and returns to the logIn screen
 */
export function logOut() {
	new Cookies().remove("token")
	document.location.replace("/")
}