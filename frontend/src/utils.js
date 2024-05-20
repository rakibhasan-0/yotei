import { Cookies } from "react-cookie"
import { AccountContext, Roles } from "./context"
import { toast } from "react-toastify"

/**
 * @author UNKNOWN & Team Tomato & Team Mango
 * @updated 2024-04-26  by Tomato
 */

const user = useContext(AccountContext)

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
	if (!context) return false
	if (context.role) {
		return context.role === role.toUpperCase()
	} else {
		return context.userRole === role.toUpperCase()
	}
}

//FUNCTIONS FOR THE NEW PERMISSION SYSTEM:

/**
 * canEditSession() - Check for if this user can edit the given session or not.
 * 					  IMPORTANT: The creatorId seems to be based on the group id of the group connected to the session and should be changed!
 * 								 Solution idea: Add a userId to the sessions in the database.
 * @params [int] creatorId - The id for the session to be checked against the userId.
 * @returns true if the user has permission to edit all sessions, or if the user has permission to edit their own sessions and the creatorId of
 * 		    the session is the same as the userId. Otherwise false is returned.
 */
export function canEditSession(creatorId) {
	return (user.permissions.includes(USER_PERMISSION_CODES.SESSION_ALL) ||
	(user.permissions.includes(USER_PERMISSION_CODES.SESSION_OWN) &&
	(user.userId === creatorId)))
}

/**
 * canCreateSession() - Check for if this user can create a session or not.
 * 
 * @returns true if the user has permission to create/edit all sessions or their own sessions. Otherwise false is returned.
 */
export function canCreateSession() {
	//Even if a user has a permission to edit all sessions, they may not have the permission set to edit their own sessions, so both must be checked here in the frontend.
	//(You cannot just check for the SESSION_OWN permission. Perhaps this should be changed, but then you need to coordinate well with the backend.)
	return (user.permissions.includes(USER_PERMISSION_CODES.SESSION_ALL) || user.permissions.includes(USER_PERMISSION_CODES.SESSION_OWN))
}


/**
 * Logs out the user and returns to the logIn screen
 */
export function logOut() {
	new Cookies().remove("token")
	new Cookies().remove("active-tab")
	document.location.replace("/")
}

/**
 * Sets the message of a toast error message and displays it.
 */
export function setError(msg, name) {
	if (name && toast.isActive(name)) return
	toast.error(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "colored",
		toastId: name,
	})
}

/**
 * Sets the message of a toast success message and displays it.
 */
export function setSuccess(msg, name) {
	if (name && toast.isActive(name)) return
	toast.success(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
		toastId: name,
	})
}

/**
 * Sets the message of a toast error message and displays it.
 */
export function setInfo(msg, name) {
	if (name && toast.isActive(name)) return
	toast.info(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "colored",
		toastId: name,
	})
}

export const HTTP_STATUS_CODES = {
	OK: 200,
	SUCCESS: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	CONFLICT: 409,
	NOT_ACCEPTABLE: 406,
	UNAUTHORIZED: 401,
	TEAPOT: 418,
	INTERNAL_SERVER_ERROR: 500,
	FORBIDDEN: 403,
}

export const USER_PERMISSION_CODES = {
	ADMIN_RIGHTS: 1,
	SESSION_OWN: 2, //Edit your own sessions.
	SESSION_ALL: 3, //Edit all sessions.
	PLAN_OWN: 4,
	PLAN_ALL: 5,
	WORKOUT_OWN: 6,
	WORKOUT_ALL: 7,
	ACTIVITY_OWN: 8,
	ACTIVITY_ALL: 9,
	GRADING_OWN: 10,
	GRADING_ALL: 11,
}

export const USER_PERMISSION_LIST_ALL = [1,2,3,4,5,6,7,8,9,10,11]

/**
 * Scrolls an element with given id into view.
 * This util function exists because the implementation of this might change.
 * Browser support for scrollIntoView with ScrollOptions is unclear.
 * @param {string} id - The id of the element to scroll into view.
 */
export function scrollToElementWithId(id) {
	document.getElementById(id).scrollIntoView({ behavior: "smooth" })
}
