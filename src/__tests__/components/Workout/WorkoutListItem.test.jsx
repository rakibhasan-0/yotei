/** @jest-environment jsdom */
// React/Jest imports
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom"

import WorkoutListItem from "../../../components/Workout/WorkoutListItem"

configure({testIdAttribute: "id"})

test("Should have correct name", async() => {
	// ARRANGE
	const workout = {
		"name":"asd",
		"id":1,
		"created":"2023-05-08",
		"author":1
	}

	render(
		<BrowserRouter>
			<WorkoutListItem workout={workout} isFavorite={false}/>
		</BrowserRouter>
	)

	// ACT
	let link = screen.getByText(workout.name)

	// ASSERT
	expect(link).toBeDefined()
	expect(link.textContent).toBe(workout.name)
})

test("Should have correct link", async() => {
	// ARRANGE
	const workout = {
		"name":"asd",
		"id":1,
		"created":"2023-05-08",
		"author":1
	}

	render(
		<BrowserRouter>
			<WorkoutListItem workout={workout} isFavorite={false}/>
		</BrowserRouter>
	)

	// ACT
	let link = screen.getByText(workout.name)

	// ASSERT
	expect(link).toBeDefined()
	expect(link.href).toContain("/workout/" + workout.id)
})