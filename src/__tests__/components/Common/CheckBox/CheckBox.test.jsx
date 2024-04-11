/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import CheckBox from "../../../../components/Common/CheckBox/CheckBox"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("CheckBox: function should run once on one click", async() => {
	// ARRANGE
	let clicked = false
	render(<div><CheckBox onClick={
		()=> clicked=!clicked} id={"testbutton"}></CheckBox></div>)

	// ACT
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("CheckBox: function should run twice on two(2) clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><CheckBox onClick={
		()=> clicked=!clicked} id={"testbutton"}></CheckBox></div>)

	// ACT
	screen.getByTestId("testbutton").click()
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(false)
})

test("CheckBox: nothing should happen on no clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><CheckBox onClick={
		()=> clicked=!clicked} id={"testbutton"}></CheckBox></div>)

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(clicked).toEqual(false)
})

test("CheckBox: disabled checkbox should be not be checked", async() => {
	let checked = false
	let disabled = false

	render(<CheckBox onClick={() => !checked } checked={checked} disabled={disabled} id="test"/>)

	// Enable checkbox.
	screen.getByTestId("test").click()

	disabled = true

	// ASSERT
	expect(checked).toBeFalsy()
})