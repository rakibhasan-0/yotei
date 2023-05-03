import React from "react"
import "./TimePicker.css"

/**
 * Defines the time picker. 
 * 
 * props = {
 *    selectedTime: string,
 *    onChange: function
 *    id: string
 * }
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-02
 * @version 2.0 
 */
export default function TimePicker({onChange, selectedTime, id}) {
	return (
		<div id={id}>
			<input 
				type="time" 
				value={selectedTime} 
				onChange={onChange}
				className={"time-picker"}
			/>
		</div>
	)
}
