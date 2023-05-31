import React from "react"
import styles from "./TimePicker.module.css"

/**
 * Defines the time picker. 
 * 
 * props = {
 *    selectedTime @type {String}:   the time selected with the picker
 * 	  ref 		   @type {ref}:      a reference to the component
 *    onChange 	   @type {Function}: function to run when time picker is used
 *    id 		   @type {String}:   ID for the component
 * }
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-02
 * @update 2023-05-30 Chimera, updated documentation
 * @version 2.1 
 */
export default function TimePicker({onChange, ref, selectedTime, id}) {
	return (
		<input 
			id={id}
			type="time" 
			value={selectedTime} 
			onChange={onChange}
			className={styles.timePicker}
			ref={ref}
		/>
	)
}
