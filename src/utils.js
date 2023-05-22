import { Cookies } from "react-cookie"
import { Roles } from "./context"
import {toast} from "react-toastify"

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

export function checkRole(context, role) {
	if(!context) return false
	if(context.role) {
		return context.role === role.toUpperCase()
	} else {
		return context.userRole === role.toUpperCase()
	}
}

/**
 * Logs out the user and returns to the logIn screen
 */
export function logOut() {
	new Cookies().remove("token")
	document.location.replace("/")
}

/**
 * Sets the message of a toast error message and displays it.
 */
export function setError(msg) {
	toast.error(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true, 
		draggable: false,
		progress: undefined,
		theme: "colored",
	})
}

/**
 * Sets the message of a toast success message and displays it.
 */
export function setSuccess(msg) {
	toast.success(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

export const HTTP_STATUS_CODES = {
	OK: 200,
	SUCCESS: 201,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	CONFLICT: 409,
	NOT_ACCEPTABLE: 406,
	UNAUTHORIZED: 401,
	TEAPOT: 418,
	INTERNAL_SERVER_ERROR: 500,
}

/**
 * Scrolls an element with given id into view.
 * This util function exists because the implementation of this might change.
 * Browser support for scrollIntoView with ScrollOptions is unclear.
 * @param {string} id - The id of the element to scroll into view. 
 */
export function scrollToElementWithId(id) {
	document.getElementById(id).scrollIntoView({behavior: "smooth"})
}
