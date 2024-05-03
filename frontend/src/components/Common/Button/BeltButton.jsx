import React from "react"
import styles from "./BeltButton.module.css"

/**
 * A button to choose between belts
 * 
 * The props object accepts an onClick handler for button presses.
 * Contents should be specified as a child, which can be any type 
 * of element, such as text or an icon.
 * 
 *   Props:
 *    id 		    @type {String}   An id for the button
 * 	  isToggled @type {Function} A toggle function when a belt is selected (both child and adult)
 *    width	   	@type {String}   A custom width to overrun default width
 *    color     @type {String}   Color of the button
 * 
 * Example Usage:
 * const [disabled, setDisabled] = useState(false)
 * <BeltButton
 * 		id="hello-world-button"
 *  	width={"200%"}
 *		color="#FFFFFF"
 *		<h2>Print Hello World</h2>
 * </BeltButton>

 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Team 1
 * @since 2024-05-02
 * @version 1.0 
 */
export default function Button({onClick, children, width, id, disabled, isToggled, color}) {
	const style = width ? { width, "backgroundColor": color, "borderColor": color } : { width: "100%", maxWidth: "150px", "background-color": color }
	return (
		<button id={id} disabled={disabled}
			type={"button"} 
			onClick={onClick} 
			className={`${styles.yoteiBeltButton} ${styles.yoteiBeltButtonNormal} ${isToggled ? styles.toggled : undefined}`} style={style}>
			{children}
		</button>
	)
}