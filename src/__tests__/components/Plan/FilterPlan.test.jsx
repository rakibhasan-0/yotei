import { render, screen, configure, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import FilterPlan, {dateFormatter} from "../../../pages/Plan/FilterPlan"

configure({testIdAttribute:"id"})

test("FilterPlan: Should exist FilterContainer", async () => {
	// TODO
})

test("Filterplan: FormatDate should convert date to YYYY-MM-DD format", async () => {
	// ARRANGE
	const unformattedDate = new Date("2023-12-24")
	const expected = "2023-12-24"

	// ACT & ASSERT
	expect(dateFormatter(unformattedDate)).toBe(expected)
})

test("FilterPlan: Start date should be todays date", async() => {
	// ARRANGE
	render(<FilterPlan/>)

	// ACT
	const start = screen.getByTestId("startDatePicker").value
	const currentDate = dateFormatter(new Date())

	// ASSERT
	expect(start).toBe(currentDate)
})


//TEST INTE KLART!
test("FilterPlan: Start date and end date correct order", async() => {
	// ARRANGE
	render(<FilterPlan/>)


	// ACT

	//set dates.
	fireEvent.change(screen.getByTestId("startDatePicker"), {
		target: { value: "2023-05-05" }
	})

	fireEvent.change(screen.getByTestId("endDatePicker"), {
		target: { value: "2023-05-08" }
	})

	//get dates.
	const start = screen.getByTestId("startDatePicker").value
	const end = screen.getByTestId("endDatePicker").value    

	// ASSERT
	expect(Date.parse(start)).toBeLessThan(Date.parse(end))
})

test("FilterPlan: checkbox will display all", async() => {
	//waitFor

	// ARRANGE

	// ACT

	// ASSERT [all belts should have their checkboxes checked.]
})

test("FilterPlan: can display group 'green'", async() => {
	// ARRANGE

	// ACT

	// ASSERT
})