/** @jest-environment jsdom */
// React/Jest imports
import React from "react"
import { render, screen, configure, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { BrowserRouter } from "react-router-dom"
import WorkoutActivityListItem from "../../../../components/Workout/WorkoutActivityListItem/WorkoutActivityListItem"

configure({testIdAttribute: "id"})

test("Should have correct id in DOM", async () => {
	// Arrange
	renderFreeText()
	
	// Act
	const elem = screen.getByTestId(510)

	// Assert
	expect(elem.id).toEqual("510")
})

test("Should not link to non exercise/technique", async () => {
	// Arrange
	renderFreeText()
	
	// Act
	const elem = screen.getByText("Waki gatame")
	
	// Assert
	expect(elem.pathname).toEqual("/")
})

test("Shoud link to exercise/technique", async () => {
	// Arrange
	const id = 510
	const activity = {
		"duration" : 2,
		"exercise" : {
			"description" : "Placera ena foten framför den andra och upprepa!",
			"duration" : 10,
			"id" : 285,
			"name" : "Springa"
		},
		"id" : 21,
		"name" : "name",
		"order" : 2,
		"technique" : null,
		"text" : "t"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)
	// Act
	const elem = screen.getByText("name")

	// Assert
	expect(elem.pathname).toEqual("/exercise/exercise_page/285")
})

test("Should not display dropdown if there is no exercise description", async () => {
	// Arrange
	const id = 21
	const activity = {
		"duration" : 2,
		"exercise" : {
			"description" : "",
			"duration" : 10,
			"id" : 285,
			"name" : "Springa"
		},
		"id" : 21,
		"name" : "name",
		"order" : 2,
		"technique" : null,
		"text" : "test"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)

	// Act
	const elem = screen.queryByRole("optional-toggle")
	
	// Assert
	expect(elem).toBeNull()
})

test("Should not display dropdown if there is no technique description", async () => {
	// Arrange
	const id = 21
	const activity = {
		"duration" : 2,
		"exercise" : null,
		"id" : 21,
		"name" : "name",
		"order" : 2,
		"technique" : {
			"description" : "",
			"duration" : 10,
			"id" : 285,
			"name" : "Springa"
		},
		"text" : "test"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)

	// Act
	const elem = screen.queryByRole("optional-toggle")
	
	// Assert
	expect(elem).toBeNull()

})

test("Should not display dropdown for free text items", async () => {
	// Arrange
	const id = 21
	const activity = {
		"duration" : 2,
		"exercise" : null,
		"id" : 21,
		"name" : "Fri text",
		"order" : 2,
		"technique" : null, 
		"text" : "test"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)

	// Act
	const elem = screen.queryByRole("optional-toggle")
	
	// Assert
	expect(elem).toBeNull()

})

test("Should display dropdown if there is a technique description", async () => {
	// Arrange
	const id = 21
	const activity = {
		"duration" : 2,
		"exercise" : null,
		"id" : 21,
		"name" : "name",
		"order" : 2,
		"technique" : {
			"description" : "Technique description!",
			"duration" : 10,
			"id" : 285,
			"name" : "Springa"
		},
		"text" : "test"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)

	// Act
	const toggleElem = screen.getByRole("optional-toggle")
	fireEvent.click(toggleElem)
	const descElem = screen.queryByRole("description-div")

	// Assert
	expect(toggleElem).toHaveClass("toggleIcon")
	expect(descElem).toHaveTextContent("Technique description!")

})

test("Should display dropdown if there is an exercise description", async () => {
	// Arrange
	const id = 21
	const activity = {
		"duration" : 2,
		"exercise" : {
			"description" : "Exercise description!",
			"duration" : 10,
			"id" : 285,
			"name" : "Springa"
		},
		"id" : 21,
		"name" : "name",
		"order" : 2,
		"technique" : null,
		"text" : "test"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)

	// Act
	const toggleElem = screen.getByRole("optional-toggle")
	fireEvent.click(toggleElem)
	const descElem = screen.queryByRole("description-div")

	// Assert
	expect(toggleElem).toHaveClass("toggleIcon")
	expect(descElem).toHaveTextContent("Exercise description!")

})


function renderFreeText(){
	const id = 510
	const activity = {
		"duration" : 15,
		"exercise" : null,
		"id" : 16,
		"name" : "Waki gatame",
		"order" : 4,
		"technique" : null,
		"text" : "Avsluta med Waki gatame i 15 minuter"
	}
	render(
		<BrowserRouter>
			<WorkoutActivityListItem id={id} activity={activity} index={1}/>
		</BrowserRouter>
	)
}