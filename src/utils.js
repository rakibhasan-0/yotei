import { Cookies } from "react-cookie"
import { Roles } from "./context"

/**
 * Use:
 * const context = useContext(AccountContext)
 * isAdmin(context)
 * 
 * If you want to use destructuring you can do this:
 * const context = useContext(AccountContext)
 * const { token, userId } =  context
 * ...
 * isAdmin(context)
 */
export function isAdmin(context) {
	return checkRole(context, Roles.admin)
}

/**
 * Use:
 * const context = useContext(AccountContext)
 * isEditor(context)
 */
export function isEditor(context) {
	return isAdmin(context) || checkRole(context, Roles.editor)
}

function checkRole(context, role) {
	return context?.role === role
}

/**
 * Logs out the user and returns to the logIn screen
 */
export function logOut() {
	new Cookies().remove("token")
	document.location.replace("/")
}

export const HTTP_STATUS_CODES = {
	OK: 200,
	SUCCESS: 201,
	NOT_FOUND: 404,
	NOT_ACCEPTABLE: 406,
	CONFLICT: 409,
	TEAPOT: 418,
	INTERNAL_SERVER_ERROR: 500,
}