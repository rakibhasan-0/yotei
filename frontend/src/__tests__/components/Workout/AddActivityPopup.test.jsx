import AddActivity from "../../../components/Workout/CreateWorkout/AddActivity.jsx"
import {screen, fireEvent, render, configure} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import { WorkoutCreateContext } from "../../../components/Workout/CreateWorkout/WorkoutCreateContext.js"
import {
	WorkoutCreateInitialState
} from "../../../components/Workout/CreateWorkout/WorkoutCreateReducer.js"

configure({testIdAttribute: "id"})

describe("AddActivity", () => {
	const mockShowActivityInfo = jest.fn()
	beforeEach(() => {
		const workoutCreateInfo = WorkoutCreateInitialState
		const workoutCreateInfoDispatch = () => {}
		// eslint-disable-next-line testing-library/no-render-in-setup
		render(
			<WorkoutCreateContext.Provider value={{ workoutCreateInfo, workoutCreateInfoDispatch }} >
				<AddActivity id="add-activity-popup" setShowActivityInfo={mockShowActivityInfo} />
			</WorkoutCreateContext.Provider>
		)
	})

	test("renders the AddActivity component", () => {
		expect(screen.getByTestId("add-activity-popup")).toBeInTheDocument()
	})

	test("displays search bar for techniques", () => {
		expect(screen.getByPlaceholderText("Sök efter tekniker")).toBeInTheDocument()
	})

	test("displays search bar for exercises", () => {
		expect(screen.getByPlaceholderText("Sök efter övningar")).toBeInTheDocument()
	})


	test("checks/unchecks a technique when checkbox is clicked", () => {
		const techniqueCheckbox = screen.getAllByRole("checkbox")[0]
		fireEvent.click(techniqueCheckbox)
		expect(techniqueCheckbox.checked).toBeTruthy()

		fireEvent.click(techniqueCheckbox)
		expect(techniqueCheckbox.checked).toBeFalsy()
	})

	test("checks/unchecks an exercise when checkbox is clicked", () => {
		const button = screen.getByRole("tab", { name: "Övningar" })
		fireEvent.click(button)

		const exerciseCheckbox = screen.getAllByRole("checkbox")[0]
		fireEvent.click(exerciseCheckbox)
		expect(exerciseCheckbox.checked).toBeTruthy()

		fireEvent.click(exerciseCheckbox)
		expect(exerciseCheckbox.checked).toBeFalsy()
	})
})
