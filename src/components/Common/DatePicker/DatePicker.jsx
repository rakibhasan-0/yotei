import React from "react"
import styles from "./DatePicker.module.css"

/**
 * Defines the date picker. 
 * 
 * 
 * Show the properties that can be set in the props object below:
 * props = {
 *     selectDate: string
 * 	   ref: ref
 *     onChange: function,
 *     id: string
 * }
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function DatePicker({onChange, ref, selectedDate, id}) {
	return (
		<input 
			id={id}
			type="date" 
			value={selectedDate} 
			onChange={onChange}
			className={styles.datePicker}
			ref={ref}
		/>
	)


}

/**
 * Retrieve todays date as a string on the format "yyyy-mm-dd".
 * @returns 
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