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
 * 			2024-05-28  by Team Mango: Separated technique and exercises permissions. Also updated permissions list and functions to include new permissions.
 *									   Groups and sessions are now combined). Removed technique and exercise own in checks because variable do not exist.
 * 			2024-05-29	by Team Mango: Added BETA_ACCESS permission and relevant hasBetaAccess function.st.
 */

/**
 * isAdminUser() - Checks if a user has the permission to edit users.
 * @param {} context AccountContext from user.
 * @returns True if user is alloowed to edit users, else false.
 */
export function isAdminUser(context) {
	if (!context.permissions) return false
	return context.permissions.includes(USER_PERMISSION_CODES.ADMIN_RIGHTS)
}

/**
 * hasBetaAccess() - check if a user has access to beta features.
 * @param {*} context AccountContext from user. 
 * @returns 
 */
export function hasBetaAccess(context) {
	if (!context.permissions) return false
	return (context.permissions.includes(USER_PERMISSION_CODES.BETA_ACCESS))
}

/**
 * canCreateSessionsAndGroups() - check if a user can create a group or session.
 * @param {*} context AccountContext from user.
 * @returns true if user can create a group, else false.
 */
export function canCreateSessionsAndGroups(context) {
	if (!context.permissions) return false
	return (
		context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_ALL) ||
		context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_OWN)
	)
}

/**
 * canEditSessionsAndGroups() - checks if a user can edit a group or session. If not all, check if user can edit own and if so let user edit their own.
 * @param {*} context AccountContext from user.
 * @param {*} groupCreatorId The Id of the user that created the group.
 * @returns true if user can edit a group or session.
 */
export function canEditSessionsAndGroups(context, groupCreatorId) {
	if (!context.permissions) return false

	return (
		context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_ALL) ||
		(context.permissions.includes(USER_PERMISSION_CODES.SESSION_GROUP_OWN) && context.userId === groupCreatorId)
	)
}

/**
 * canCreateWorkouts() - check if a user can create a workout.
 * @param {*} context AccountContext from user.
 * @returns true if user can create a workout, else false.
 */
export function canCreateWorkouts(context) {
	if (!context.permissions) return false
	return (
		context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_ALL) ||
		context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_OWN)
	)
}

/**
 * canEditWorkout() - Check if a user can edit a workout.
 * @param {*} context AccountContext from user.
 * @param {*} workoutId The id of the user that created the workout.
 * @returns true if user can edit a workout, else false.
 */
export function canEditWorkout(context, workoutId) {
	if (!context.permissions) return false //If the user's context disappears they lose all permissions and must log in again.
	//True if the user may edit all workouts or "owns" the workout and is able to edit their own workouts.
	return (
		context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_ALL) ||
		(context.permissions.includes(USER_PERMISSION_CODES.WORKOUT_OWN) && context.userId === workoutId)
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
	//True if the user is an admin or "owns" the comment.
	return context.userId === commentId
} //PERMISSION TODO: Should there be a permission for deleting others' comments without being an admin? And should everyone be able to write comments?

/**
 * canCreateAndEditTechnique() - Check if user can create an technique.
 * @param {*} context Accountcontext from user.
 * @returns true if user can create/edit an technique.
 */
export function canCreateAndEditTechnique(context) {
	if (!context.permissions) return false
	return context.permissions.includes(USER_PERMISSION_CODES.TECHNIQUE_ALL)
}

/**
 * canCreateAndEditExercise() - Check if user can create an exercise.
 * @param {*} context Accountcontext from user.
 * @returns true if user can create/edit an exercise.
 */
export function canCreateAndEditExercise(context) {
	if (!context.permissions) return false
	return context.permissions.includes(USER_PERMISSION_CODES.EXERCISE_ALL)
}

/**
 * canHandleGradings() - Check if user can create a grading.
 * @param {*} context Accountcontext from user.
 * @returns true if user can create a grading.
 */

export function canHandleGradings(context) {
	if (!context.permissions) return false
	return context.permissions.includes(USER_PERMISSION_CODES.GRADING_ALL)
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
	BETA_ACCESS: 2,
	SESSION_GROUP_OWN: 3, //Edit your own groups and sessions.
	SESSION_GROUP_ALL: 4, //Edit all groups and sessions.
	WORKOUT_OWN: 5,
	WORKOUT_ALL: 6,
	TECHNIQUE_ALL: 7,
	EXERCISE_ALL: 8,
	GRADING_ALL: 9,
}

export const USER_PERMISSION_LIST_ALL = [1, 2, 3, 4, 5, 6, 7, 8]

/**
 * Scrolls an element with given id into view.
 * This util function exists because the implementation of this might change.
 * Browser support for scrollIntoView with ScrollOptions is unclear.
 * @param {string} id - The id of the element to scroll into view.
 */
export function scrollToElementWithId(id) {
	document.getElementById(id).scrollIntoView({ behavior: "smooth" })
}

/**
 * Parses the data from the listCreateInfo state to a format that the API accepts.
 *
 * @param {*} data
 * @returns The parsed data.
 */
export const parseActivityListToDTO = (data, userId) => {
	let activities = []
	data.activities.forEach((a) => {
		const activity = {
			entryId: a.entryId ? a.entryId : null,
			type: a.type,
			id: a.id,
			duration: a.duration,
		}
		activities.push(activity)
	})

	return {
		id: data.id,
		name: data.name,
		desc: data.desc,
		hidden: data.hidden,
		author: userId,
		activities: activities,
		users: data.users.map((user) => user.userId),
	}
}
