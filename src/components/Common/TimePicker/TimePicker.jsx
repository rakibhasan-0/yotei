import React from "react"
import "./TimePicker.css"

/**
 * Defines the time picker. 
 * 
 * props = {
 *    selectedTime: string,
 * 	  ref: ref
 *    onChange: function
 *    id: string
 * }
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-02
 * @version 2.0 
 */
export default function TimePicker({onChange, ref, selectedTime, id}) {
	return (
		<input 
			id={id}
			type="time" 
			value={selectedTime} 
			onChange={onChange}
			className={"time-picker"}
			ref={ref}
		/>
	)
}
