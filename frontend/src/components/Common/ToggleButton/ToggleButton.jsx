import { useState } from "react"
import styles from "./ToggleButton.module.css"

/**
 * Defines the toggle button. 
 * 
 * props = {
 *    selectedTime @type {String}:   the time selected with the picker
 * 	  ref 		   @type {ref}:      a reference to the component
 *    onChange 	   @type {Function}: function to run when time picker is used
 *    id 		   @type {String}:   ID for the component
 * }
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-08
 * @version 2.1 
 */


export default function ToggleButton() {
	const [toggled, setToggled] = useState(false)

	return (
		<button 
			className={styles.toggleButton + " " + (toggled ? styles.toggled : "")}
			onClick={() => setToggled(!toggled)}
		>
			<div className={styles.thumb}></div>
		</button>
	)
}