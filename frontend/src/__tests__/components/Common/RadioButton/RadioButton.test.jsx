import React from "react"
import { render, screen, configure } from "@testing-library/react"
import RadioButton from "../../../../components/Common/RadioButton/RadioButton"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("RadioButton: function should run once on one click", async() => {
	// ARRANGE
	let clicked = false
	render(<div><RadioButton onClick={
		()=> clicked=!clicked} id={"testRadiobutton"}></RadioButton></div>)

	// ACT
	screen.getByTestId("testRadiobutton").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("Nothing happens on no clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><RadioButton onClick={
		()=> clicked=!clicked} id={"testRadiobutton"}></RadioButton></div>)

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(clicked).toEqual(false)
})