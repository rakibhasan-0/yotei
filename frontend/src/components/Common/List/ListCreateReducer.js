export const LIST_CREATE_TYPES = {
	SET_NAME: "SET_NAME",
	SET_DESCRIPTION: "SET_DESCRIPTION",
	SET_IS_PRIVATE: "SET_IS_PRIVATE",
	SET_USERS: "SET_USERS",
	REMOVE_ACTIVITY_ITEM: "REMOVE_ACTIVITY_ITEM",
	SET_INITIAL_STATE: "SET_INITIAL_STATE",
	INIT_WITH_DATA: "INIT_WITH_DATA",
	INIT_EDIT_DATA: "INIT_EDIT_DATA",
	CLOSE_POPUP: "CLOSE_POPUP",
	CLOSE_ACIVITY_POPUP: "CLOSE_ACIVITY_POPUP",
	OPEN_ACTIVITY_POPUP: "OPEN_ACTIVITY_POPUP",
	OPEN_CHOOSE_ACTIVITY_POPUP: "OPEN_CHOOSE_ACTIVITY_POPUP",
	UPDATE_ACTIVITY_TIME: "UPDATE_ACTIVITY_TIME",
	UPDATE_ACTIVITY_TIME: "CREATE_ACTIVITY_ITEMS",
	CLEAR_ADDED_ACTIVITIES: "CLEAR_ADDED_ACTIVITIES",
	SET_ACTIVITIES_WITH_PARSING: "SET_ACTIVITIES_WITH_PARSING",
	TOGGLE_CHECKED_ACTIVITY: "TOGGLE_CHECKED_ACTIVITY",
	UPDATE_EDITING_ACTIVITY: "UPDATE_EDITING_ACTIVITY",
}

/**
 * Initial state for the list create reducer
 */
export const ListCreateInitialState = {
	data: {
		activities: [],
		author: null,
		date: "",
		desc: "",
		duration: 0,
		id: 0,
		hidden: false,
		name: "",
		users: [],
	},
	originalData: {
		activities: [],
		author: null,
		created_date: "",
		desc: "",
		duration: 0,
		id: 0,
		hidden: false,
		name: "",
		users: [],
	},
	popupState: {
		isOpened: false,
		types: {
			freeTextPopup: false,
			activityPopup: false,
			chooseActivityPopup: false,
			editActivityPopup: false,
		},
		currentlyEditing: {
			id: null,
			date: null,
		},
	},
	addedActivities: [],
	checkedActivities: [],
	numActivities: 0,
}

/**
 * Compares the current state to the original state.
 *
 * @param {*} current
 * @param {*} original
 * @returns True if the current state is equal to the original state, otherwise false
 */
export function compareCurrentToOriginal(current, original) {
	return JSON.stringify(original) === JSON.stringify(current)
}

export function checkIfActivityInfoPoupChangesMade(info) {
	if (info.popupState.types.chooseActivityPopup && info.checkedActivities.length > 0) {
		return true
	} else {
		if (info.popupState.types.activityPopup && info.addedActivities.length > 0) return true
		if (info.popupState.types.isFreeText && info.addedActivities.some((a) => a.name.length > 0)) return true
	}

	return false
}

/**
 * List create reducer
 * @author Team Tomato (6)
 * @since 2024-05-22
 * Based on WorkoutCreateReducer
 */
export function listCreateReducer(state, action) {
	const tempState = { ...state }
	switch (action.type) {
	case "SET_INITIAL_STATE":
		return JSON.parse(JSON.stringify(ListCreateInitialState))
	case "INIT_WITH_DATA":
		return action.payload
	case "INIT_EDIT_DATA": {
		const listData = action.payload.listData
		const users = listData.users.map((user) => {
			return {
				userId: user.id,
				username: user.username,
			}
		})
		// Prepare data object
		const data = {
			id: listData.id,
			name: listData.name,
			desc: listData.desc,
			hidden: listData.hidden, // === "Private",
			author: listData.author, //.author_id,
			date: listData.date.split("T")[0],
			users: users,
			activities: listData.activities,
		}
		const listCreateInfo = {
			popupState: listData.popUpState,
			numActivities: listData.size,
			data: data,
			originalData: data,
		}
		tempState.data = JSON.parse(JSON.stringify(listCreateInfo.data))
		tempState.originalData = JSON.parse(JSON.stringify(listCreateInfo.data))

		return tempState
	}
	case "SET_NAME":
		tempState.data.name = action.name
		return tempState
	case "SET_DESCRIPTION":
		tempState.data.desc = action.desc
		return tempState
	case "SET_IS_PRIVATE":
		tempState.data.hidden = action.hidden
		return tempState
	case "SET_USERS":
		tempState.data.users = action.users
		return tempState
	case "REMOVE_ACTIVITY_ITEM": {
		const index = action.payload.index
		// Remove the activity with the given index/position in the list
		tempState.data.activities = tempState.data.activities.filter((activity, idx) => idx !== index)
		tempState.numActivities = tempState.data.activities.length
		return tempState
	}
	case "SET_ACTIVITIES_WITH_PARSING": {
		const results = action.payload.result
		console.log("Results:")
		console.log(results)
		tempState.addedActivities = results.map((result) => {
			return {
				type: result.type,		
				id: result.id? result.id:result.techniqueID,
				name: Object.prototype.hasOwnProperty.call(result, "name") ? result.name : "",
				duration: Object.prototype.hasOwnProperty.call(result, "duration") ? result.duration : 0,
			}
		})
		return tempState
	}
	case "CLOSE_POPUP":
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = false
		tempState.checkedActivities = []
		return tempState
	case "CLOSE_ACIVITY_POPUP":
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = true
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_ACTIVITY_POPUP":
		tempState.popupState.types.activityPopup = true
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true

		return tempState
	case "OPEN_CHOOSE_ACTIVITY_POPUP":
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = true
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "UPDATE_ACTIVITY_TIME": {
		const index = action.payload.index
		const time = action.payload.time
		tempState.addedActivities[index].duration = Number.parseInt(time)
		return tempState
	}

	case "CREATE_ACTIVITY_ITEMS": {
		if (state.addedActivities.length === 0) return tempState
		let activities = tempState.addedActivities.map((activity, idx) => {
			return {
				id: activity.id,
				index: idx,
				name: activity.name,
				duration: activity.duration,
				type: activity.type,
			}
		})

		activities.forEach((activity) => {
			tempState.data.activities.push(activity)
		})

		tempState.addedActivities = []
		return tempState
	}
	case "CLEAR_ADDED_ACTIVITIES":
		tempState.addedActivities = []
		return tempState
	case "TOGGLE_CHECKED_ACTIVITY": {
		const type = action.payload.type
		const id = type === "technique" ? action.payload.techniqueID : action.payload.id

		if (type === "technique") {
			const index = tempState.checkedActivities.findIndex((activity) => activity.techniqueID === id)
			if (index === -1) {
				tempState.checkedActivities = [...tempState.checkedActivities, action.payload]
			} else {
				tempState.checkedActivities = tempState.checkedActivities.filter(
					(activity) => activity.techniqueID !== id
				)
			}
		} else {
			const index = tempState.checkedActivities.findIndex((activity) => activity.id === id)
			if (index === -1) {
				tempState.checkedActivities = [...tempState.checkedActivities, action.payload]
			} else {
				tempState.checkedActivities = tempState.checkedActivities.filter((activity) => activity.id !== id)
			}
		}

		return tempState
	}
	default:
		return state
	}
}
