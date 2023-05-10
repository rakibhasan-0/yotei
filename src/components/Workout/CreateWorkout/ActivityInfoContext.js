import { createContext } from "react"

export const ActivityInfoContext = createContext(null)
export const ActivityInfoDispatchContext = createContext(null)

export const activityReducer = (state, action) => {
	const tempState = {...state}
	switch (action.type) {
	case "ADD_ACTIVITIY":
		tempState.activities.push({
			description: action.payload,
			time: 0
		})
		return tempState
	case "UPDATE_ACTIVITY_TIME":
		tempState.activities[action.payload.id].time = action.payload.time
		return tempState
	case "CHECK_CATEGORY": {
		tempState.categories.forEach(category => {
			category.checked = false
		})

		let index = action.payload.id === -1 ? tempState.categories.length - 1 : action.payload.id
		tempState.categories[index].checked = true
		tempState.chosenCategory = tempState.categories[index].name
		return tempState
	}
	case "ADD_CATEGORY":
		tempState.categories.push(action.payload)
		tempState.categories.forEach(category => {
			category.checked = false
		})
		tempState.categories[tempState.categories.length - 1].checked = false
		return tempState
	case "UPDATE_ACTIVITY_DESCRIPTION":
		tempState.activities[action.payload.id].description = action.payload.description
		return tempState
	default:
		return tempState
	}
}