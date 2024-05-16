import React from "react"
import { render, screen, configure, fireEvent } from "@testing-library/react"
import DatePicker from "../../../../components/Common/DatePicker/DatePicker"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

//implement before each

test("Should render to page", async() => {
	const dateChangeHandler = jest.fn()
	// ARRANGE
	let date = Date.parse("2019-01-01")
	render(<DatePicker
		style={{ marginLeft: "100px"}}
		selectedDate={date}
		onChange={dateChangeHandler}
		id={"test-datepicker"}
	/>)

	expect(screen.getByTestId("test-datepicker")).toBeInTheDocument()
})

test("Should change date", async() => {
	// ARRANGE
	const dateChangeHandler = jest.fn()
	const initialDate = "2019-01-01"

	render(
		<DatePicker
			style={{ marginLeft: "100px"}}
			selectedDate={initialDate}
			onChange={dateChangeHandler}
			id={"test-datepicker"}
		/>
	)

	// ACT
	const datePickerInput = screen.getByTestId("test-datepicker") // Get the input field by role
	fireEvent.change(datePickerInput, { target: { value: "2015-12-10" } })

	//ASSERT
	expect(dateChangeHandler).toHaveBeenCalledWith(expect.any(Object))
})