//import React from "react"
import { render, configure, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseEdit from "../../../pages/Exercise/ExerciseEdit"
import GroupIndex from "../../../pages/Plan/GroupIndex/GroupIndex"
import { MemoryRouter } from "react-router"
import { JustifyLeft } from "react-bootstrap-icons"
configure({ testIdAttribute: "id" })

jest.mock("react-router", () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => jest.fn(),
	unstable_useBlocker: () => jest.fn(),
	useParams: () => ({
		"excerciseId": "290"
	})
}))

describe("ExerciseEdit should render", () => {

	beforeEach(async () => {
		render(<ExerciseEdit/>)

		// Used to wait for the page to fully load, otherwise it will just render the loading spinner
		await waitFor(() => {
			expect(document.title).toBe("Redigera övning")
		})
	})

	test("Input field of name", () => {
		expect(screen.getByTestId("exerciseNameInput")).toBeInTheDocument()
	})

	test("Input field of description", () => {
		expect(screen.getByTestId("exerciseDescriptionInput")).toBeInTheDocument()
	})

	test("Input field of minutepicker", () => {
		expect(screen.getByTestId("minute-picker-minuteSelect")).toBeInTheDocument()
	})
})