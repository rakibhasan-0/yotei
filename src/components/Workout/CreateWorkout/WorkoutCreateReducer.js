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
	REMOVE_ACTIVITY_ITEM: "REMOVE_ACTIVITY_ITEM",
	SET_ACTIVITY_ITEMS: "SET_ACTIVITY_ITEMS",
	SET_ACTIVITIES: "SET_ACTIVITIES",
	SET_TAGS: "SET_TAGS",
	SET_DATE: "SET_DATE",
	SET_INITIAL_STATE: "SET_INITIAL_STATE",
	INIT_WITH_DATA: "INIT_WITH_DATA",
	INIT_EDIT_DATA: "INIT_EDIT_DATA",
	RESET: "RESET",
	CLOSE_POPUP: "CLOSE_POPUP",
	OPEN_FREE_TEXT_POPUP: "OPEN_FREE_TEXT_POPUP",
	OPEN_ACTIVITY_POPUP: "OPEN_ACTIVITY_POPUP",
	OPEN_CHOOSE_ACTIVITY_POPUP: "OPEN_CHOOSE_ACTIVITY_POPUP",
	OPEN_EDIT_ACTIVITY_POPUP: "OPEN_EDIT_ACTIVITY_POPUP",
	SET_CURRENTLY_EDITING: "SET_CURRENTLY_EDITING",
	UPDATE_ACTIVITY_TIME: "UPDATE_ACTIVITY_TIME",
	UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
	CHECK_CATEGORY: "CHECK_CATEGORY",
	CHECK_CATEGORY_BY_ID: "CHECK_CATEGORY_BY_ID",
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
			editActivityPopup: false,
		},
		currentlyEditing: null
	},
	addedCategories: [
		{ id: 0, name: null, checked: true }, 
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
	case "SET_INITIAL_STATE": 
		return JSON.parse(JSON.stringify(WorkoutCreateInitialState))
	case "INIT_WITH_DATA":
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

			let category = {
				name: activityItem.categoryName,
				checked: false,
			}
			let categoryId = null
			if(tempState.addedCategories.find(cat => cat.name === category.name)){
				categoryId = tempState.addedCategories.find(cat => cat.name === category.name).id
			} else {
				categoryId = tempState.numCategories++
				tempState.addedCategories.push({ id: categoryId, name: category.name, checked: false })
			}

			return {
				id: categoryId,
				name: category.name,
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

		tempState.data = JSON.parse(JSON.stringify(data))
		tempState.originalData = JSON.parse(JSON.stringify(data))

		return tempState
	}
	case "RESET":
		return JSON.parse(JSON.stringify(WorkoutCreateInitialState))
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
	case "REMOVE_ACTIVITY_ITEM": {
		const id = action.payload.id
		for (let i = 0; i < tempState.data.activityItems.length; i++) {
			tempState.data.activityItems[i].activities = tempState.data.activityItems[i].activities.filter(activity => activity.id !== id)
			
			if(tempState.data.activityItems[i].activities.length === 0) {
				tempState.data.activityItems.splice(i, 1)
			}
		}
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
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = false

		tempState.addedCategories.forEach((category) => {
			
			if(category.id === 0) {
				category.checked = true
			}
			else {
				category.checked = false
			}
		})
		return tempState
	case "OPEN_FREE_TEXT_POPUP":
		tempState.popupState.types.freeTextPopup = true
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_ACTIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = true
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_CHOOSE_ACTIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = true
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_EDIT_ACTIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = true
		tempState.popupState.isOpened = true
		return tempState
	case "SET_CURRENTLY_EDITING": {
		const activityId = action.payload.id
		tempState.popupState.currentlyEditing = activityId
		return tempState
	}
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
	case "UPDATE_ACTIVITY": {
		const newActivity = action.payload.activity
		let changedCategory = true
		let newCategory = true 
		let categoryId 

		tempState.addedCategories.forEach((category) => {
			if(category.checked === true) {
				categoryId = category.id
			}
		})
		
		tempState.data.activityItems.forEach((category, categoryIndex) => {
			category.activities.forEach((activity, index) => {
				if(activity.id === newActivity.id) {
					
					if(category.id === categoryId) {
						changedCategory = false
						newCategory = false
						category.activities[index] = newActivity
					}
					else {
						category.activities.splice(index, 1)
						if(tempState.data.activityItems[categoryIndex].activities.length === 0) {
							tempState.data.activityItems.splice(categoryIndex, 1)
						}
					}
				}
			})

			if(changedCategory && category.id === categoryId) {
				newCategory = false
				tempState.data.activityItems[categoryIndex].activities.push(newActivity)
			}
		})

		if(newCategory){
			const category = tempState.addedCategories.find(category => category.checked)
			const activityItem = {
				id: category.id,
				name: category.name,
				activities: [newActivity],
			}

			tempState.data.activityItems.push(activityItem)

		}
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
	case "CHECK_CATEGORY_BY_ID": {
		const id = action.payload.id
		tempState.addedCategories.forEach((category) => category.checked = category.id === id)
		return tempState
	}
	case "ADD_CATEGORY": {
		// Can't add a category with the same name
		if (tempState.addedCategories.some(c => c.name === action.payload.name)) return tempState

		const category = {
			id: tempState.numCategories++,
			...action.payload,
		}

		tempState.addedCategories.push(category)
		tempState
		tempState.addedCategories.forEach(category => {
			category.checked = false
		})
		tempState.addedCategories[tempState.addedCategories.length - 1].checked = false
		return tempState
	}
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
