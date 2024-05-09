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
	CLOSE_ACIVITY_POPUP: "CLOSE_ACIVITY_POPUP",
	OPEN_FREE_TEXT_POPUP: "OPEN_FREE_TEXT_POPUP",
	OPEN_ACTIVITY_POPUP: "OPEN_ACTIVITY_POPUP",
	OPEN_CHOOSE_ACTIVITY_POPUP: "OPEN_CHOOSE_ACTIVITY_POPUP",
	OPEN_EDIT_ACTIVITY_POPUP: "OPEN_EDIT_ACTIVITY_POPUP",
	SET_CURRENTLY_EDITING: "SET_CURRENTLY_EDITING",
	UPDATE_ACTIVITY_TIME: "UPDATE_ACTIVITY_TIME",
	UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
	/*CHECK_CATEGORY: "CHECK_CATEGORY",
	CHECK_CATEGORY_BY_ID: "CHECK_CATEGORY_BY_ID",
	ADD_CATEGORY: "ADD_CATEGORY",*/
	UPDATE_ACTIVITY_NAME: "UPDATE_ACTIVITY_NAME",
	CREATE_ACTIVITY_ITEMS: "CREATE_ACTIVITY_ITEMS",
	CLEAR_ADDED_ACTIVITIES: "CLEAR_ADDED_ACTIVITIES",
	SET_ACTIVITIES_WITH_PARSING: "SET_ACTIVITIES_WITH_PARSING",
	SET_CHECKED_ACTIVITIES: "SET_CHECKED_ACTIVITIES",
	CLEAR_CHECKED_ACTIVITIES: "CLEAR_CHECKED_ACTIVITIES",
	TOGGLE_CHECKED_ACTIVITY: "TOGGLE_CHECKED_ACTIVITY",
	UPDATE_EDITING_ACTIVITY: "UPDATE_EDITING_ACTIVITY",
}

/**
 * Initial state for the workout create reducer
 */
export const WorkoutCreateInitialState = {
	data: {
		activities: [],
		author: null,
		changed_date: "",
		created_date: "",
		description: "",
		duration: 0,
		id: 0,
		isPrivate: false,
		name: "",
	},
	originalData: {
		activities: [],
		author: null,
		changed_date: "",
		created_date: "",
		description: "",
		duration: 0,
		id: 0,
		isPrivate: false,
		name: "",
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
		}
	},
	/*
	addedCategories: [
		{ id: 0, name: null, checked: false }, 
		{ id: 1, name: "Uppvärmning", checked: false },
		{ id: 2, name: "Tekniker", checked: false }
	],*/
	addedActivities: [],
	checkedActivities: [],
	numActivities: 0,
	//numCategories: 3,
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

export function checkIfActivityInfoPoupChangesMade(info) {
	if (info.popupState.types.chooseActivityPopup && 
		info.checkedActivities.length > 0) {
		return true
	} else {
		if(info.popupState.types.activityPopup && info.addedActivities.length > 0) return true
		if(info.popupState.types.isFreeText &&
			info.addedActivities.some(a => a.name.length > 0)) return true
	}

	return false
}

export function checkIfChangesMade(info) {
	if (!compareCurrentToOriginal(info.data, info.originalData)) return true
	if (checkIfActivityInfoPoupChangesMade(info)) return true

	return false
}

/**
 * Workout create reducer
 */
export function workoutCreateReducer(state, action) {
	console.log("Type: "+action.type)

	const tempState = {...state}
	switch (action.type) {
	case "SET_INITIAL_STATE": 
		return JSON.parse(JSON.stringify(WorkoutCreateInitialState))
	case "INIT_WITH_DATA":
		return action.payload
	case "INIT_EDIT_DATA": {
		const workoutData = action.payload.workoutData;
		// Map activities
		console.log("[ListCreateReducer] Breakpoint 1")
		const activities = workoutData.data.activities.map(activity => {
			return {
			id: activity.id,
			type: activity.type,
			duration: activity.duration,
			technique: activity.type === "technique" ? activity.technique : null,
			exercise: activity.type === "exercise" ? activity.exercise : null,
			};
		});
		console.log("[ListCreateReducer] Breakpoint 2")
		// Map users
		const users = workoutData.data.users.map((user, index) => {
			return {
			userId: index + 1,
			username: user.username,
			};
		});
		console.log("[ListCreateReducer] Breakpoint 3")
		// Prepare category object
		const categoryId = workoutData.list_id; // Using list_id as categoryId
		/*const categoryName = workoutData.list_name;
		
		/*let category = tempState.addedCategories.find(cat => cat.name === categoryName);
		if (!category) {
			category = {
			id: categoryId,
			name: categoryName,
			checked: false,
			};
			tempState.addedCategories.push(category);
		}

		// Return the category object with its activities
		const categoryObject = {
			id: categoryId,
			name: categoryName,
			workoutData,//KAAEFT
		};
*/
		// Prepare data object
		console.log("Reducer, workoutdata print: ")
		console.log(workoutData)
		const data = {
				id: workoutData.data.id,
				name: workoutData.data.name,
				description: workoutData.data.description,
				isPrivate: workoutData.data.isPrivate,// === "Private",
				author: workoutData.data.author,//.author_id,
				date: workoutData.data.changed_date.split("T")[0],
				created: workoutData.data.created_date.split("T")[0],
				duration: workoutData.numActivities,
				users: users,
				activities: activities,
		};
		const listCreateInfo = {
			popupState: workoutData.popUpState,
			numActivities: workoutData.numActivities,
			data: data,
			originalData: data,
		}
		tempState.data = JSON.parse(JSON.stringify(listCreateInfo.data))
		tempState.originalData = JSON.parse(JSON.stringify(listCreateInfo.data))
		console.log("[ListCreateReducer] tempState:")
		console.log(tempState)

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
				tempState.data.activityItems = tempState.data.activityItems.filter(item => item.id !== tempState.data.activityItems[i].id)
			}
		}
		return tempState
	}
	case "SET_ACTIVITY_ITEMS":
		tempState.data.activityItems = action.activityItems.filter(item => item.activities.length > 0)
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

		tempState.addedCategories.forEach((category) => category.checked = false)
		tempState.checkedActivities = []
		return tempState
	case "CLOSE_ACIVITY_POPUP":
		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = true
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true
		return tempState
	case "OPEN_FREE_TEXT_POPUP":
		tempState.addedCategories[0].checked = true

		tempState.popupState.types.freeTextPopup = true
		tempState.popupState.types.activityPopup = false
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true

		return tempState
	case "OPEN_ACTIVITY_POPUP":
		tempState.addedCategories[0].checked = true

		tempState.popupState.types.freeTextPopup = false
		tempState.popupState.types.activityPopup = true
		tempState.popupState.types.chooseActivityPopup = false
		tempState.popupState.types.editActivityPopup = false
		tempState.popupState.isOpened = true

		tempState.addedCategories[0].checked = true
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
		tempState.popupState.currentlyEditing.id = activityId

		let activity = null

		tempState.data.activityItems.forEach((item) => {
			item.activities.forEach((act) => {
				if(act.id === activityId) activity = act
			})
		})

		if (activity === null) return tempState
			
		tempState.popupState.currentlyEditing = {
			id: activityId,
			data: {...activity}
		}

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
		let removIds = []
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
							removIds.push(categoryIndex)
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
		removIds.forEach((number) =>{
			tempState.data.activityItems.splice(number,1)
		})
		return tempState
	}
	/*case "CHECK_CATEGORY": {
		tempState.addedCategories.forEach((category) => category.checked = false)
		const index = action.payload.index === -1 ? tempState.addedCategories.length - 1 : action.payload.index
		tempState.addedCategories[index].checked = true
		return tempState
	}
	case "CHECK_CATEGORY_BY_ID": {
		tempState.addedCategories.forEach((category) => category.checked = category.id === action.payload.id)
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
		tempState.addedCategories.forEach(category => category.checked = false)
		tempState.addedCategories[tempState.addedCategories.length - 1].checked = true
		return tempState
	}*/
	case "UPDATE_ACTIVITY_NAME":
		tempState.addedActivities[action.payload.index].name = action.payload.name
		return tempState
	case "CREATE_ACTIVITY_ITEMS": {
		if(state.addedActivities.length === 0) return tempState

		const isFreeText = action.payload.isFreeText
		const category = tempState.addedCategories.find(category => category.checked)

		// No checked category?
		if(!category) return tempState


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
		if (tempState.data.activityItems.some(item => item.name === category.name)) {
			activityItem = tempState.data.activityItems.find(item => item.name === category.name)
			activityItem.activities = [...activityItem.activities, ...activities]
		} else {
			activityItem = {
				id: tempState.addedCategories.find(category => category.checked).id,
				name: category.name,
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
	case "SET_CHECKED_ACTIVITIES": 
		tempState.checkedActivities = action.payload
		return tempState
	case "CLEAR_CHECKED_ACTIVITIES":
		tempState.checkedActivities = []
		return tempState
	case "TOGGLE_CHECKED_ACTIVITY": {
		const type = action.payload.type
		const id = type === "technique" ? action.payload.techniqueID : action.payload.id

		if (type === "technique") {
			const index = tempState.checkedActivities.findIndex(activity => activity.techniqueID === id)
			if (index === -1) {
				tempState.checkedActivities = [...tempState.checkedActivities, action.payload]
			} else {
				tempState.checkedActivities = tempState.checkedActivities.filter(activity => activity.techniqueID !== id)
			}
		} else {
			const index = tempState.checkedActivities.findIndex(activity => activity.id === id)
			if (index === -1) {
				tempState.checkedActivities = [...tempState.checkedActivities, action.payload]
			} else {
				tempState.checkedActivities = tempState.checkedActivities.filter(activity => activity.id !== id)
			}
		}

		return tempState
	}
	case "UPDATE_EDITING_ACTIVITY": 
		tempState.popupState.currentlyEditing.data = action.payload
		return tempState
	default:
		return state
	}
}
