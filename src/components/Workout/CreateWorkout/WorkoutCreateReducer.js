/**
 * Workout create types
 */
export const WORKOUT_CREATE_TYPES = {
	SET_NAME: "SET_NAME",
	SET_DESCRIPTION: "SET_DESCRIPTION",
	SET_IS_PRIVATE: "SET_IS_PRIVATE",
	SET_USERS: "SET_USERS",
	ADD_ACTIVITY: "ADD_ACTIVITY",
	REMOVE_ACTIVITY: "REMOVE_ACTIVITY",
	SET_ACTIVITY_ITEMS: "SET_ACTIVITY_ITEMS",
	SET_ACTIVITIES: "SET_ACTIVITIES",
	SET_TAGS: "SET_TAGS",
	SET_DATE: "SET_DATE",
	INIT: "INIT",
	INIT_EDIT_DATA: "INIT_EDIT_DATA",
	RESET: "RESET",
	CLOSE_POPUP: "CLOSE_POPUP",
	OPEN_FREE_TEXT_POPUP: "OPEN_FREE_TEXT_POPUP",
	OPEN_ACTIVITY_POPUP: "OPEN_ACTIVITY_POPUP",
	OPEN_CHOOSE_ACTIVITY_POPUP: "OPEN_CHOOSE_ACTIVITY_POPUP",
	UPDATE_ACTIVITY_TIME: "UPDATE_ACTIVITY_TIME",
	CHECK_CATEGORY: "CHECK_CATEGORY",
	ADD_CATEGORY: "ADD_CATEGORY",
	UPDATE_ACTIVITY_NAME: "UPDATE_ACTIVITY_NAME",
	CREATE_ACTIVITY_ITEMS: "CREATE_ACTIVITY_ITEMS",
	CLEAR_ADDED_ACTIVITIES: "CLEAR_ADDED_ACTIVITIES",
	SET_ACTIVITIES_WITH_PARSING: "SET_ACTIVITIES_WITH_PARSING",
}

/**
 * Initial state for the workout create reducer
 */
export const WorkoutCreateInitialState = {
	data: {
		name: "",
		description: "",
		isPrivate: false,
		users: [],
		author: null,
		activityItems: [],
		tags: [],
		date: "",
	},
	originalData: {
		name: "",
		description: "",
		isPrivate: false,
		users: [],
		author: null,
		activityItems: [],
		tags: [],
		date: "",
	},
	popupState: {
		isOpened: false,
		types: {
			freeTextPopup: false,
			activityPopup: false,
			chooseActivityPopup: false,
		}
	},
	addedCategories: [
		{ id: 0, name: "Ingen kategori", checked: true }, 
		{ id: 1, name: "Uppvärmning", checked: false },
		{ id: 2, name: "Stretchning", checked: false }
	],
	addedActivities: [],
	numActivities: 0,
	numCategories: 3,
}

/**
 * Compares the current state to the original state.
 * 
 * @param {*} current 
 * @param {*} original 
 * @returns True if the current state is equal to the original state, otherwise false
 */
export function compareCurrentToOriginal(current, original){
	return JSON.stringify(original) === JSON.stringify(current)
}

/**
 * Workout create reducer
 */
export function workoutCreateReducer(state, action) {
	const tempState = {...state}
	switch (action.type) {
	case "INIT":
		return action.payload
	case "INIT_EDIT_DATA": {
		const workoutData = action.payload.workoutData
		const userData = action.payload.userData

		const activityItems = workoutData.activityCategories.map(activityItem => {
			const activities = activityItem.activities.map(activity => {
				return {
					id: tempState.numActivities++,
					originalId: activity.id,
					name: activity.name,
					duration: activity.duration,
					isEditable: activity.exercise === null && activity.technique === null,
					description: activity.description,
				}
			})

			return {
				id: tempState.numCategories++,
				name: activityItem.name,
				activities,
			}
		})

		const users = userData.map(user => {
			return {
				userId: user.user_id,
				username: user.username,
			}
		})
		
		const data = {
			id: workoutData.id,
			name: workoutData.name,
			description: workoutData.description,
			isPrivate: workoutData.hidden,
			author: workoutData.author.user_id,
			date: workoutData.date.split("T")[0],
			created: workoutData.created.split("T")[0],
			duration: workoutData.duration,
			users,
			activityItems,
			tags: workoutData.tags,
		}

		tempState.data = data
		tempState.originalData = {...data}

		return tempState
	}
	case "RESET":
		return WorkoutCreateInitialState
	case "SET_NAME":
		tempState.data.name = action.name
		return tempState
	case "SET_DESCRIPTION":
		tempState.data.description = action.description
		return tempState
	case "SET_IS_PRIVATE":
		tempState.data.isPrivate = action.isPrivate
		return tempState
	case "SET_USERS":
		tempState.data.users = action.users
		return tempState
	case "REMOVE_ACTIVITY": {
		const id = action.payload.id
		tempState.addedActivities = tempState.addedActivities.filter(activity => activity.id !== id)
		return tempState
	}
	case "SET_ACTIVITY_ITEMS":
		tempState.data.activityItems = action.activityItems
		return tempState
	case "SET_ACTIVITIES": {
		tempState.data.activityItems[action.id].activities = action.activities
		return tempState
	}
	case "SET_ACTIVITIES_WITH_PARSING": {
		const results = action.payload.result
		tempState.addedActivities = results.map(result => {
			return {
				id: tempState.numActivities++,
				name: Object.prototype.hasOwnProperty.call(result, "name") ? result.name : "",
				isEditable: false,
				duration: Object.prototype.hasOwnProperty.call(result,"duration") ? result.duration : 0,
				exerciseId: Object.prototype.hasOwnProperty.call(result,"type") && result.type === "exercise" ? result.id : null,
				techniqueId: Object.prototype.hasOwnProperty.call(result,"type") && result.type === "technique" ? result.techniqueID : null,
			}
		})
		return tempState
	}
	case "SET_TAGS":
		tempState.data.tags = action.tags
		return tempState
	case "SET_DATE":
		tempState.data.date = action.date
		return tempState
	case "CLOSE_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.isOpened = false
		return tempState
	case "OPEN_FREE_TEXT_POPUP":
		tempState.popupState.types.freeTextPopup = true
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_ACTIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = true
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_CHOOSE_ACTIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = true
		tempState.popupState.isOpened = true
		return tempState
	case "ADD_ACTIVITY": {
		const name = action.payload.name
		const id = tempState.numActivities++
		tempState.addedActivities.push({ id, duration: 0, name })
		return tempState
	}
	case "UPDATE_ACTIVITY_TIME": {
		const index = action.payload.index
		const time = action.payload.time
		tempState.addedActivities[index].duration = Number.parseInt(time)
		return tempState
	}
	case "CHECK_CATEGORY": {
		tempState.addedCategories.forEach((category) => {
			category.checked = false
		})
		const index = action.payload.index === -1 ? tempState.addedCategories.length - 1 : action.payload.index
		tempState.addedCategories[index].checked = true
		return tempState
	}
	case "ADD_CATEGORY":
		tempState.addedCategories.push(action.payload)
		tempState
		tempState.addedCategories.forEach(category => {
			category.checked = false
		})
		tempState.addedCategories[tempState.addedCategories.length - 1].checked = false
		return tempState
	case "UPDATE_ACTIVITY_NAME":
		tempState.addedActivities[action.payload.index].name = action.payload.name
		return tempState
	case "CREATE_ACTIVITY_ITEMS": {
		if(state.addedActivities.length === 0) return state

		const isFreeText = action.payload.isFreeText
		const categoryName = tempState.addedCategories.find(category => category.checked).name

		let activities = tempState.addedActivities.map(activity => {
			return {
				id: activity.id,
				name: activity.name,
				isEditable: isFreeText,
				duration: activity.duration,
				exerciseId: isFreeText ? null : activity.exerciseId,
				techniqueId: isFreeText ? null : activity.techniqueId,
			}
		})
			
		let activityItem
		if (tempState.data.activityItems.some(item => item.name === categoryName)) {
			activityItem = tempState.data.activityItems.find(item => item.name === categoryName)
			activityItem.activities = [...activityItem.activities, ...activities]
		} else {
			activityItem = {
				id: tempState.addedCategories.find(category => category.checked).id,
				name: categoryName,
				activities: activities,
			}

			tempState.data.activityItems.push(activityItem)
		}

		tempState.addedActivities = []
		return tempState
	}
	case "CLEAR_ADDED_ACTIVITIES":
		tempState.addedActivities = []
		return tempState
	default:
		return state
	}
}


