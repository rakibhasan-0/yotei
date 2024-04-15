/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import "@testing-library/jest-dom"
import PrintButton from "../../../../components/Common/PrintButton/PrintButton"

configure({testIdAttribute: "id"})

test("Should have a printbutton", () => {
	// ARRANGE
	const workoutData = {
		activityCategories: [
			{
				name: "Test Workout",
				author: {
					username: "Test User"
				},
				duration: 30,
				created: "2023-05-01",
				changed: "2023-05-05",
				description: "This is a test workout"
			}
		],
	}

	render(<PrintButton id={0} workoutData={workoutData}/>)
	let printButton = screen.getByRole("print")

	// ASSERT
	expect(printButton).toBeInTheDocument()
})
