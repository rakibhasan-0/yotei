import React from "react"
import "./DatePicker.css"

/**
 * Defines the date picker. 
 * 
 * 
 * Show the properties that can be set in the props object below:
 * props = {
 *     selectDate: string
 *     onChange: function,
 *     id: string
 * }
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function DatePicker({onChange, selectedDate, id}) {
	return (
		<div >
			<input 
				id={id}
				type="date" 
				value={selectedDate} 
				onChange={onChange}
				className={"date-picker"}
			/>
		</div>
	)
}
