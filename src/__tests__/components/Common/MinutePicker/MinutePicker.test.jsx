/** @jest-environment jsdom */
import React from "react"
import {configure, fireEvent, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import MinutePicker from "../../../../components/Common/MinutePicker/MinutePicker"
configure({testIdAttribute: "id"})

test("Test1, should render component to screen", async() => {
	// ARRANGE
	const updateMock = jest.fn()
	render(<MinutePicker id="1" time={""} updateTime={updateMock} />)
	expect(screen.getByTestId("1")).toBeInTheDocument()
})
test("Test 2, Alphabetic input value not valid.", async() => {
	// ARRANGE
	const updateMock = jest.fn()
	render(<MinutePicker id="1" time={""} updateTime={updateMock} />)
	const input = screen.getByTestId("1")

	// ACT
	//Try to change the input to abc
	fireEvent.change(input, { target: { value: "abc" } })

	// ASSERT
	expect(updateMock).toHaveBeenCalledTimes(1)
	// UpdateMock will be called with "", since "abc" is not a valid input.
	expect(updateMock).toHaveBeenCalledWith("")
})

test("Test 3, Number in inputfield", async() => {
	// ARRANGE
	const updateMock = jest.fn()
	render(<MinutePicker id="1" time={""} updateTime={updateMock} />)
	const input = screen.getByTestId("1")

	// ACT
	//Try to change the input to 123
	fireEvent.change(input, { target: { value: "123" } })

	// ASSERT
	expect(updateMock).toHaveBeenCalledTimes(1)
	// UpdateMock will be called with "123", since "123" is a valid input.
	expect(updateMock).toHaveBeenCalledWith("123")
})
