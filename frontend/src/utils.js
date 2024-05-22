import { Cookies } from "react-cookie"
import { toast } from "react-toastify"

/**
 * @author UNKNOWN & Team Tomato & Team Mango
 * @updated 2024-04-26  by Tomato
 * 			2024-05-20  by Team Mango: Updated permissions functions.
 *  		2024-05-21  by Team Mango: Commented functions, changed names and added more permissions functions.
 *  		2024-05-22  by Team Mango: Added some more permissions functions and removed all old permission code.
 */

/**
 * canEditSession() - Check for if this user can edit the given session or not.
 * 					  IMPORTANT: The creatorId seems to be based on the group id of the group connected to the session and should be changed!
 * 								 Solution idea: Add a userId to the sessions in the database.
 * @params [int] creatorId - The id for the session to be checked against the userId.
 * @params context - AccountContext with info about user.
 * @returns true if the user has permission to edit all sessions, or if the user has permission to edit their own sessions and the creatorId of
 * 		    the session is the same as the userId. Otherwise false is returned.
 */
export function canEditSessions(context, creatorId) {
	//if (user.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
	if (!context.permissions) { //Safety check for undefined which is always false.
		return false
	}
	return (context.permissions.includes(USER_PERMISSION_CODES.SESSION_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.SESSION_OWN) &&
	(context.userId === creatorId)))
}

/**
 * canCreateSession() - Check for if this user can create a session or not.
 * @params context - AccountContext with info about user.
 * @returns true if the user has permission to create/edit all sessions or their own sessions. Otherwise false is returned.
 */
export function canCreateSessions(context) {
	//if (context.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
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
	//if (user.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
	return (context.permissions.includes(USER_PERMISSION_CODES.PLAN_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.PLAN_OWN)))
}

/**
 * canEditGroups() - checks if a user can edit a group. If not all, check if user can edit own and if so let user edit their own.
 * @param {*} context AccountContext from user.
 * @param {*} group Group info.
 * @returns true if user can edit a group.
 */
export function canEditGroups(context, group) {
	if (!context.permissions) return false

	return (context.permissions.includes(USER_PERMISSION_CODES.PLAN_ALL) ||
	(context.permissions.includes(USER_PERMISSION_CODES.PLAN_OWN) &&
	(context.userId === group.userId)))
}

/**
 * canCreateWorkouts() - check if a user can create a group.
 * @param {*} context AccountContext from user.
 * @returns true if user can create a workout, else false.
 */
export function canCreateWorkouts(context) {
	if (!context.permissions) return false
	//if (user.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
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
	if (context.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
	//True if the user is an admin or "owns" the workout and is able to edit any workouts.
	//Both permissions must be checked since having one does not imply having the other.
	return ((context.userId === workoutId) && (
		context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_OWN) ||
	context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_ALL)
	)
	)
}

/**
 * canDeleteComment() - Check if a user can delete a comment.
 * @param {*} context AccountContext from user.
 * @param {*} commentId The id of the user that created the comment.
 * @returns true if user can delete a comment, otherwise false.
 */
export function canDeleteComment(context, commentId) {
	if (!context.permissions) return false //If the user's context disappears they lose all permissions and must log in again.
	if (context.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)) return true
	//True if the user is an admin or "owns" the comment.
	return (context.userId === commentId)
} //PERMISSION TODO: Should there be a permission for deleting others' comments without being an admin? And should 



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
 * canCreateGradings() - Check if user can create a grading.
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
	PLAN_OWN: 4, // Plan = groups
	PLAN_ALL: 5,
	WORKOUT_OWN: 6,
	WORKOUT_ALL: 7,
	TECHNIQUE_EXERCISE_OWN: 8, // Techniques and exercices. This one is not used. Right now only all or nothing.
	TECHNIQUE_EXERCISE_ALL: 9, //Old name: ACTIVITY_ALL (Was a potential conflict in the database naming, so we changed it.)
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
