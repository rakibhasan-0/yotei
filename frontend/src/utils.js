import { Cookies } from "react-cookie"
import { toast } from "react-toastify"

/**
 * @author UNKNOWN & Team Tomato & Team Mango & Team Coconut
 * @updated 2024-04-26  by Tomato
 * 			2024-05-20  by Team Mango: Updated permissions functions.
 *  		2024-05-21  by Team Mango: Commented functions, changed names and added more permissions functions.
 *  		2024-05-22  by Team Mango: Added some more permissions functions and removed all of the old permission code.
 * 			2024-05-23  by Team Mango: Separated admin permission function from the rest,
 * 										making it more readable that they are different.
 * 			2024-05-27  by Team Coconut: Tweaking number of toasts and disabled the progess bar on customers wishes
 * 										 every toast function no longer takes a second argument and uses the message sent as ID instead
 * 										 this automatically ensures that the same message is not displayed multiple times.
 * 			2024-05-28  by Team Mango: Updated permissions list and functions to include new permissions (e.g. groups and sessions are now combined).
 */

/**
 * canEditSession() - Check for if this user can edit the given session or not.
 * 					  IMPORTANT: The creatorId seems to be based on the group id of the group connected to the session and should be changed!
 * 								 Solution idea: Add a userId to the sessions in the database.
 * @params [int] creatorIdOfGroup - The user id for the group connected to the session to be checked against the userId.
 *                                  That is, the user id of the user who creted the group connected to this session.
 * @params context - AccountContext with info about user.
 * @returns true if the user has permission to edit all sessions, or if the user has permission to edit their own sessions and the creatorId of
 * 		    the session is the same as the userId. Otherwise false is returned.
 */
export function canEditSessions(context, creatorIdOfGroup) {
	if (!context.permissions) { //Safety check for undefined which is always false.
		return false
	}
	return (context.permissions.includes(USER_PERMISSION_CODES.SESSION_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.SESSION_OWN) &&
	(context.userId === creatorIdOfGroup)))
}

/**
 * canCreateSession() - Check for if this user can create a session or not.
 * @params context - AccountContext with info about user.
 * @returns true if the user has permission to create/edit all sessions or their own sessions. Otherwise false is returned.
 */
export function canCreateSessions(context) {
	if (!context.permissions) { //Safety check for undefined which is always false.
		return false
	}
	//Even if a user has a permission to edit all sessions, they may not have the permission set to edit their own sessions, so both must be checked here in the frontend.
	//(You cannot just check for the SESSION_OWN permission. Perhaps this should be changed, but then you need to coordinate well with the backend.)
	return (context.permissions.includes(USER_PERMISSION_CODES.SESSION_ALL) || context.permissions.includes(USER_PERMISSION_CODES.SESSION_OWN))
}

/**
 * isAdminUser() - Checks if a user has the permission to edit users.
 * @param {} context AccountContext from user.
 * @returns True if user is alloowed to edit users, else false. 
 */
export function isAdminUser(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS))
}


/**
 * canCreateGroups() - check if a user can create a group.
 * @param {*} context AccountContext from user.
 * @returns true if user can create a group, else false.
 */
export function canCreateGroups(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_OWN)))
}

/**
 * canEditGroups() - checks if a user can edit a group. If not all, check if user can edit own and if so let user edit their own.
 * @param {*} context AccountContext from user.
 * @param {*} groupCreatorId The Id of the user that created the group.
 * @returns true if user can edit a group.
 */
export function canEditGroups(context, groupCreatorId) {
	if (!context.permissions) return false

	return (context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_OWN) &&
	(context.userId === groupCreatorId)))
}

/**
 * canCreateWorkouts() - check if a user can create a group.
 * @param {*} context AccountContext from user.
 * @returns true if user can create a workout, else false.
 */
export function canCreateWorkouts(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_OWN)))
}

/**
 * canEditWorkout() - Check if a user can edit a group.
 * @param {*} context AccountContext from user.
 * @param {*} workoutId The id of the user that created the workout.
 * @returns true if user can edit a workout, else false.
 */
export function canEditWorkout(context, workoutId) {
	if (!context.permissions) return false //If the user's context disappears they lose all permissions and must log in again.
	//True if the user may edit all workouts or "owns" the workout and is able to edit their own workouts.
	return (context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_OWN) &&
	(context.userId === workoutId)))
}

/**
 * canDeleteComment() - Check if a user can delete a comment.
 * @param {*} context AccountContext from user.
 * @param {*} commentId The id of the user that created the comment.
 * @returns true if user can delete a comment, otherwise false.
 */
export function canDeleteComment(context, commentId) {
	if (!context.permissions) return false //If the user's context disappears they lose all permissions and must log in again.
	//True if the user is an admin or "owns" the comment.
	return (context.userId === commentId)
} //PERMISSION TODO: Should there be a permission for deleting others' comments without being an admin? And should everyone be able to write comments?



/**
 * canCreateAndEditActivity() - Check if user can create an activity. An activity is an exercise or technique.
 * @param {*} context Accountcontext from user. 
 * @returns true if user can create an activity (exercise and technique).
 */
export function canCreateAndEditActivity(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.TECHNIQUE_EXERCISE_ALL))
}

/**
 * canHandleGradings() - Check if user can create a grading.
 * @param {*} context Accountcontext from user. 
 * @returns true if user can create a grading.
 */

export function canHandleGradings(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.GRADING_ALL))
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
export function setError(msg) {

	toast.error(msg, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "colored",
		toastId: msg,
	})
}

/**
 * Sets the message of a toast success message and displays it.
 */
export function setSuccess(msg) {

	toast.success(msg, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
		toastId: msg,
	})
}

/**
 * Sets the message of a toast error message and displays it.
 */
export function setInfo(msg) {

	toast.info(msg, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "colored",
		toastId: msg,
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

// These attributes have to be in the same order from 1-x as inserted into the database.
export const USER_PERMISSION_CODES = {
	ADMIN_RIGHTS: 1,
	SESSION_GROUP_OWN: 2, //Edit your own groups and sessions.
	SESSION_GROUP_ALL: 3, //Edit all groups and sessions.
	WORKOUT_OWN: 4,
	WORKOUT_ALL: 5,
	TECHNIQUE_EXERCISE_ALL: 6, //Old name: ACTIVITY_ALL (Was a potential conflict in the database naming, so we changed it.)
	GRADING_ALL: 7,
}

export const USER_PERMISSION_LIST_ALL = [1,2,3,4,5,6,7]

/**
 * Scrolls an element with given id into view.
 * This util function exists because the implementation of this might change.
 * Browser support for scrollIntoView with ScrollOptions is unclear.
 * @param {string} id - The id of the element to scroll into view.
 */
export function scrollToElementWithId(id) {
	document.getElementById(id).scrollIntoView({ behavior: "smooth" })
}
