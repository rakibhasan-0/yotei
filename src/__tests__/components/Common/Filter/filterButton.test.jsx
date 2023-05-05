import React from "react"
import {render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import FilterButton from "../../../../components/Common/Filter/FilterButton/FilterButton"


configure({testIdAttribute: "id"})

test("that the button exists when rendered", async() => {
	render(
		<div>
			<FilterButton id={"testButton"} status={true} />
		</div>
	)
	const html = screen.getByTestId("testButton")
	expect(html).toBeInTheDocument()
	
})

test("Tests interaction with button", async() => {
	// ARRANGE
	let clicked = 0
    
	render(
		<div>
			<FilterButton onClick={()=> {clicked=1}} id={"testButton"} status={true} />
		</div>
	)

	// ACT
	screen.getByTestId("testButton").click()

	// ASSERT
	expect(clicked).toEqual(1)
})

test("Tests that the state should change correctly with two clicks", async() => {
	// ARRANGE
	let clicked = false
    
	render(
		<div>
			<FilterButton onClick={()=> {!clicked}} id={"testButton"} status={true} />
		</div>
	)

	// ACT
	screen.getByTestId("testButton").click()
	screen.getByTestId("testButton").click()

	// ASSERT
	expect(clicked).toEqual(false)
})

test("Classname should change to filterButton-pressed when status is false", async() => {

	render(
		<FilterButton id={"testButton"} status={false} />
	)

	const className  = screen.getByTestId("testButton").className
	expect(className).toBe("filterButton-pressed")
})