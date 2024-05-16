/** @jest-environment jsdom */

import {configure, fireEvent, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import MinutePicker from "../../../../components/Common/MinutePicker/MinutePicker.jsx"

configure({testIdAttribute: "id"})

describe("MinutePicker component", () => {
	test("Test1, should render component to screen", async () => {
		// ARRANGE
		const updateMock = jest.fn()
		render(<MinutePicker id="1" callback={updateMock}/>)
		expect(screen.getByTestId("minute-picker-1")).toBeInTheDocument()
	})
	test("2, Alphabetic input value not valid.", async () => {
		// ARRANGE
		const updateMock = jest.fn()
		render(<MinutePicker id="1" callback={updateMock}/>)
		const input = screen.getByTestId("minute-picker-1")

		// ACT
		//Try to change the input to abc
		fireEvent.change(input, {target: {value: "abc"}})

		// ASSERT
		expect(updateMock).toHaveBeenCalledTimes(0)
	})

	test("3, Number in inputfield", async () => {
		// ARRANGE
		const updateMock = jest.fn()
		render(<MinutePicker id="1" callback={updateMock}/>)
		const input = screen.getByTestId("minute-picker-1")

		// ACT
		//Try to change the input to 123
		fireEvent.change(input, {target: {value: "123"}})

		// ASSERT
		expect(updateMock).toHaveBeenCalledTimes(1)
		// UpdateMock will be called with "123", since "123" is a valid input.
		expect(updateMock).toHaveBeenCalledWith("1", "123")
	})

	test("temp", () => {
		expect(true).toBe(true)
	})

})