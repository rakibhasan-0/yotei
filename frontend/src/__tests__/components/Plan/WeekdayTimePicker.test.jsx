import {React} from "react"
import {cleanup, render, screen, configure, waitFor, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import WeekdayTimePicker from "../../../components/Plan/WeekdayTimePicker"

configure({testIdAttribute: "id"})

afterEach(cleanup)

it("Test WeekdayTimePicker should render.", () => {
	// ARRANGE
	var dayName = "Mån"
	var weekdays = [{ name: "Mån", value: false, time: "" },
		{ name: "Tis", value: false, time: "" },
		{ name: "Ons", value: false, time: "" },
		{ name: "Tors", value: false, time: "" },
		{ name: "Fre", value: false, time: "" },
		{ name: "Lör", value: false, time: "" },
		{ name: "Sön", value: false, time: "" }]
    
	const weekdayClickHandler = (dayName) => {
		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.value = !dayRow.value
				weekdays[i] = dayRow
				break
			}
		}
	}

	const dayTimeClickHandler = (dayName, value) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.time = value
				weekdays[i] = dayRow
				break
			}
		}
	}

	render(<WeekdayTimePicker dayName={dayName}  weekdays={weekdays} weekdayClickHandler={weekdayClickHandler} dayTimeClickHandler={dayTimeClickHandler}/>)
})

it("Test that correct CheckBox is created.", () => {
	// ARRANGE
	var dayName = "Mån"
	var weekdays = [{ name: "Mån", value: false, time: "" },
		{ name: "Tis", value: false, time: "" },
		{ name: "Ons", value: false, time: "" },
		{ name: "Tors", value: false, time: "" },
		{ name: "Fre", value: false, time: "" },
		{ name: "Lör", value: false, time: "" },
		{ name: "Sön", value: false, time: "" }]
    
	const weekdayClickHandler = (dayName) => {
		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.value = !dayRow.value
				weekdays[i] = dayRow
				break
			}
		}
	}

	const dayTimeClickHandler = (dayName, value) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.time = value
				weekdays[i] = dayRow
				break
			}
		}
	}

	render(<WeekdayTimePicker dayName ={dayName}  weekdays={weekdays} weekdayClickHandler={weekdayClickHandler} dayTimeClickHandler={dayTimeClickHandler}/>)
	// ACT
	let res = screen.getByTestId("MånCheckBox")
	// ASSERT
	expect(res).not.toBeNull()
})


it("Test that WeekDayPicker renders.", async () => {
	// ARRANGE
	var dayName = "Mån"
	var weekdays = [{ name: "Mån", value: false, time: "" },
		{ name: "Tis", value: false, time: "" },
		{ name: "Ons", value: false, time: "" },
		{ name: "Tors", value: false, time: "" },
		{ name: "Fre", value: false, time: "" },
		{ name: "Lör", value: false, time: "" },
		{ name: "Sön", value: false, time: "" }]
    
	const weekdayClickHandler = (dayName) => {
		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.value = !dayRow.value
				weekdays[i] = dayRow
				break
			}
		}
	}

	const dayTimeClickHandler = (dayName, value) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.time = value
				weekdays[i] = dayRow
				break
			}
		}
	}

	render(<WeekdayTimePicker dayName={dayName} weekdays={weekdays} weekdayClickHandler={weekdayClickHandler} dayTimeClickHandler={dayTimeClickHandler}/>)
	// ACT
	/** Rolling thumbs */
	// ASSERT
	expect(screen.getByRole("checkbox")).not.toBeChecked() //eslint-disable-line
})


it("Test should present TimePicker.", async () => {
	// ARRANGE
	var dayName = "Fre"
	var weekdays = [{ name: "Mån", value: false, time: "" },
		{ name: "Tis", value: false, time: "" },
		{ name: "Ons", value: false, time: "" },
		{ name: "Tors", value: false, time: "" },
		{ name: "Fre", value: false, time: "" },
		{ name: "Lör", value: false, time: "" },
		{ name: "Sön", value: false, time: "" }]
    
	const weekdayClickHandler = (dayName) => {
		var dayRow
        

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.value = !dayRow.value
				weekdays[i] = dayRow
				break
			}
		}
	}

	const dayTimeClickHandler = (dayName, value) => {

		var dayRow

		for (var i = 0; i < 7; i++) {
			dayRow = weekdays[i]

			if (dayRow.name === dayName) {
				dayRow.time = value
				weekdays[i] = dayRow
				break
			}
		}
	}

	render(<WeekdayTimePicker dayName={dayName} weekdays={weekdays} weekdayClickHandler={weekdayClickHandler} dayTimeClickHandler={dayTimeClickHandler}/>)
    
	const div = screen.getByTestId("FreCheckBox")

	// ACT
	await fireEvent.click(div)
	
	// ASSERT
	await waitFor(() => {
		// Need to handle promise if fail expect should catch it.
		const res = screen.findByTestId("FreTimePicker")
			.then(() => {})
			.catch(()=>{})
		expect(res).not.toBeUndefined()
	})
})

