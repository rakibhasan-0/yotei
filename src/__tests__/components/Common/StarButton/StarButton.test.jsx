/** @jest-environment jsdom */
import React from "react"
import { render, screen, configure } from "@testing-library/react"
import StarButton from "../../../../components/Common/StarButton/StarButton"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

test("StarButton: function should run once on one click", async() => {
	// ARRANGE
	let clicked = false
	render(<div><StarButton onClick={
		()=> clicked=!clicked} id={"testbutton"}></StarButton></div>)

	// ACT
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(true)
})

test("StarButton: function should run twice on two(2) clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><StarButton onClick={
		()=> clicked=!clicked} id={"testbutton"}></StarButton></div>)

	// ACT
	screen.getByTestId("testbutton").click()
	screen.getByTestId("testbutton").click()

	// ASSERT
	expect(clicked).toEqual(false)
})

test("StarButton: nothing should happen on no clicks", async() => {
	// ARRANGE
	let clicked = false
	render(<div><StarButton onClick={
		()=> clicked=!clicked} id={"testbutton"}></StarButton></div>)

	// ACT
	// *cricket sounds*

	// ASSERT
	expect(clicked).toEqual(false)
})