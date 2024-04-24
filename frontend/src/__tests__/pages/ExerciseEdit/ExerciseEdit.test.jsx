//import React from "react"
import { render, configure, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExerciseEdit from "../../../pages/Exercise/ExerciseEdit"
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from "react-router-dom"
import { rest } from "msw"
import { server } from "../../server"
configure({ testIdAttribute: "id" })

/**
 * Unit-test for the ExerciseEdit page, 
 * init tests
 *
 * @author Team Mango (Group 4) (2024-04-24)
 * @since 2024-04-18
 * @version 1.0 
 */

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

jest.mock("react-router", () => ({
	...jest.requireActual("react-router"),
	useNavigate: () => jest.fn(),
	unstable_useBlocker: () => jest.fn(),
	useParams: () => ({
		"excerciseId": "1"
	})
}))

describe("ExerciseEdit should render", () => {

	beforeEach(async () => {
		const router = createMemoryRouter(
			createRoutesFromElements(
				<Route path="/*" element={<ExerciseEdit/>} />
			)
		)
		render( //eslint-disable-line
			<RouterProvider router={router} />
		)
		// Used to wait for the page to fully load, otherwise it will just render the loading spinner
		await waitFor(() => {
			expect(document.title).toBe("Redigera övning")
		})
	})

	server.use(
		rest.get("/api/exercises/1", async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{
						"exercise_id": 1,
						"name": "TestName",
						"description": "TestDescription",
						"duration": 50
					}
				])
				
			)
		})
	)

	test("Input field of name", () => {
		expect(screen.getByTestId("exerciseNameInput")).toBeInTheDocument()
	})

	test("Input field of description", () => {
		expect(screen.getByTestId("exerciseDescriptionInput")).toBeInTheDocument()
	})

	test("Input field of minutepicker", () => {
		expect(screen.getByTestId("minute-picker-minuteSelect")).toBeInTheDocument()
	})

	//test("Duration input field should have value by default", () => {
	//	const minutePickerInput = screen.getByTestId("minute-picker-minuteSelect")
	//	expect(minutePickerInput).toHaveValue("20")
//
	//	expect(requestSpy).toHaveBeenCalledTimes(5)
	//})
})