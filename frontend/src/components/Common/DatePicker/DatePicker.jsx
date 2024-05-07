import React, { useState } from "react"
import styles from "./DatePicker.module.css"
import { setError } from "../../../utils"

/**
 * A component for a default beltpicker. 
 * 
 * props = {
 * selectDate @type {String}   a date to be changed with the DatePicker
 * ref        @type {ref}      a reference to the component
 * onChange   @type {Function} onChange function to be run by DatePicker when value is changed
 * id 		  @type {String}   id for the component
 * minDate 	  @type {String}   Earliest date one can choose. All dates before will be blocked.
 * maxDate 	  @type {String}   Latest date one can choose. All dates after will be blocked. Default is 9999-12-31
 * }
 * 
 * Example usage:
 * const [selectDate, setSelectedDate] = useState("")
 * 
 * <DatePicker 
 *	id="start-date-picker"
 *	onChange={(e) => { setSelectedDate(e.target.value)}} 
 *	minDate={"2023-05-01"} 
 *	selectedDate={selectedDate}
 *	maxDate={"2023-05-07"}  
 * 	/>
 * 
 * @author Chimera, Kiwi
 * @since 2023-05-02
 * @updated 2023-05-09 Griffin, added minDate, maxDate, 
 * @updated 2023-05-30 Chimera Updated Documentation
 * @updated 2023-04-22 Kiwi, Added better UX for niche mobiles and desktop input.
 * @version 2.1 
 */
export default function DatePicker({onChange, ref, selectedDate, id, minDate, maxDate}) {
	const [invalid, setInvalid] = useState(false)
	let countErrors = 0
	let pressedKey

	function handleChange(event) {
		
		if(!event.target.value) {
			if(countErrors == 2 || pressedKey != 48){
				setError("Felaktigt datum.", "datepicker-error")
				setInvalid(true)
				countErrors = 0
			}
		}
		else {
			countErrors = 0
			setInvalid(false)
			onChange(event)
		}
	}

	function handleKeyDown(event){
		pressedKey = event.keyCode
	}

	return (
		<input 
			id={id}
			data-testid="date-picker-input"
			type="date" 
			value={selectedDate} 
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			className={`${invalid && styles.invalid} ${styles.datePicker}`}
			ref={ref}
			min={minDate}
			max={maxDate ? maxDate : "6969-04-20"}
		/>
	)


}

/**
 * Retrieve todays date as a string on the format "yyyy-mm-dd".
 * 
 * @returns  todays date as a string on the format "yyyy-mm-dd" :) (I love documentation I love documentation I love documentation)
 */
export function getFormattedDateString(date) {
	return `${leftPad(date.getFullYear(), 4)}-${leftPad(date.getMonth() + 1, 2)}-${leftPad(date.getDate(), 2)}`
}

/**
 * Convert a given number to a zero-leftpadded string. 
 * Usage example: leftPad(4, 2) 
 *       returns: "04" 
 * @param {*} number The number to convert to a padded string
 * @param {*} minLen The minimum length of the padded string
 * @returns A string starting with a number of zeroes required to reach 
 * the desired length followed by the input number.
 */
function leftPad(number, minLen) {
	let result = ""
	let diff = (minLen - 1) - number / 10
	for(let i = 0; i < diff; i++) {
		result += "0"
	}
	return result + number
}