import React from "react"
import { render, screen, configure } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom"

import WorkoutActivityList from "../../../../components/Workout/WorkoutActivityList/WorkoutActivityList"

configure({testIdAttribute: "id"})

test("Category with null name should not display legend in fieldSet", async() => {
	// ARRANGE
	let id = "legend-test-id"
    
	render(
		<BrowserRouter>
			<WorkoutActivityList categoryName={null} activities={[]} navigate={null} id={id}></WorkoutActivityList>
		</BrowserRouter>
	)

	// ACT
	const elem = screen.getByTestId(id)
	const legendElement = screen.queryByText(/legend-test-element/i)

	// ASSERT
	expect(elem.id).toEqual(id)
	expect(legendElement).not.toBeInTheDocument()
})

test("Category with name should display legend in fieldSet", async() => {
	// ARRANGE
	let id = "legend-test-id"

	render(
		<BrowserRouter>
			<WorkoutActivityList categoryName={"legend-test-element"} activities={[]} navigate={null} id={id}></WorkoutActivityList>
		</BrowserRouter>
	)

	// ACT
	const elem = screen.getByTestId(id)
	const legendElement = screen.getByText(/legend-test-element/i)

	// ASSERT
	expect(elem.id).toEqual(id)
	expect(legendElement).toBeInTheDocument()
})