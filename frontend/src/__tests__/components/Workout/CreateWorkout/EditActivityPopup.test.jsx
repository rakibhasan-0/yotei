/** @jest-environment jsdom */
import React from "react"
import { render, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import Popup from "../../../../components/Common/Popup/Popup"
import EditActivityPopup from "../../../../components/Workout/CreateWorkout/EditActivityPopup"
import { WorkoutCreateContext } from "../../../../components/Workout/CreateWorkout/WorkoutCreateContext.js"

configure({ testIdAttribute: "id" })

const useWorkoutCreateContext = () => {
	const workoutCreateInfo = {data: {
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
		isOpened: true,
		types: {
			freeTextPopup: false,
			activityPopup: false,
			chooseActivityPopup: false,
			editActivityPopup: true,
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
	} // Mock initial state

	const workoutCreateInfoDispatch = jest.fn() // Mock dispatch function

	return { workoutCreateInfo, workoutCreateInfoDispatch }
}

test("Should display buttons", async () => {
	// ARRANGE	
	const contextValue = useWorkoutCreateContext()

	const view = render(<WorkoutCreateContext.Provider value={contextValue}>
		<Popup id="popup" isOpen={ true }>
			<EditActivityPopup id={"Test-Popup"}></EditActivityPopup>
		</Popup>
	</WorkoutCreateContext.Provider>)

	const saveButton = view.queryByRole("button", {name: "Spara"})
	const deleteButton = view.container.querySelector("#popup_delete_button") //eslint-disable-line

	///ASSERT
	expect(saveButton).toBeVisible()
	expect(deleteButton).toBeVisible()
})