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
	// renderFreeText() should not be able to render free text??
	
	// Act
	const elem = screen.getByTestId(510)

	// Assert
	expect(elem.id).toEqual("510")
})



// Istället för att kolla drop-down så behöver vi kolla pop-up, de heter "popup-list-item-tech"
// och "popup-list-item-exer". Hur kollar man pop-ups?

test("Should display pop-up when clicking on a technique in activity list", async () => {
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

	
	// Kan denna kolla så att "länken" till popup funkar?
	const linkToPopup = screen.getByRole("link-to-popup")
	fireEvent.click(linkToPopup)
	// Kolla så att kryss knappen fungerar i popupen
	// Kolla så att man får reload knappen om man får ett id som inte finns??

	
	//const popUpElem = screen.getByRole("popup-list-item-tech")
	
	expect(linkToPopup).toHaveClass("link-activity-list")


	/*
	// Act
	const toggleElem = screen.getByRole("optional-toggle")
	fireEvent.click(toggleElem)
	const descElem = screen.queryByRole("description-div")

	// Assert
	expect(toggleElem).toHaveClass("toggleIcon")
	expect(descElem).toHaveTextContent("Technique description!")
	*/

})

test("Should display pop-up when clicking on an exercise in activity list", async () => {
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

	/*
	// Act
	const toggleElem = screen.getByRole("optional-toggle")
	fireEvent.click(toggleElem)
	const descElem = screen.queryByRole("description-div")

	// Assert
	expect(toggleElem).toHaveClass("toggleIcon")
	expect(descElem).toHaveTextContent("Exercise description!")
	*/

})

