/** @jest-environment jsdom */
import React from "react"
import {render, screen, configure} from "@testing-library/react"
import Button from "../../../../components/Common/Button/Button"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("Button: function should run once on one click", async() => {
	// ARRANGE
	let clicked = false
	render(<div><Button onClick={
		()=> clicked=!clicked} id={"testbutton"}></Button></div>)

	// ACT
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("Button: function should run twice on two(2) clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><Button onClick={
		()=> clicked=!clicked} id={"testbutton"}></Button></div>)

	// ACT
	screen.getByTestId("testbutton").click()
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(false)
})

test("Button: nothing should happen on no clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><Button onClick={
		()=> clicked=!clicked} id={"testbutton"}></Button></div>)

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(clicked).toEqual(false)
})