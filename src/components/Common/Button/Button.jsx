import React from "react"
import styles from "./Button.module.css"

/**
 * A default button that should be used throughout the project.
 * 
 * The props object accepts an onClick handler for button presses.
 * Contents should be specified as a child, which can be any type 
 * of element, such as text or an icon.
 * 
 *   Props:
 *    id 		@type {String}   An id for the button
 *    outlined 	@type {Boolean}  A boolean to choose between the two styles of button 
 * 	  isToggled @type {Function} A toggle function when a belt is selected (both child and adult)
 *    children  @type {JSX} 	 A jsx-element to be shown in the button 
 *    width	   	@type {String}   A custom width to overrun default width
 *    type 	   	@type {String}   Change type of component from default button
 *    disabled 	@type {Boolean}  An overide to disable the button and change it's graphics
 * 
 * Example Usage:
 * const [disabled, setDisabled] = useState(false)
 * <Button
 * 		id="hello-world-button"
 *  	width={"200%"}
 *  	disabled={disabled}
 *		onClick={()=>{console.log("Hello world"), setDisabled(true)}}>
 *		<h2>Print Hello World</h2>
 * </Button>

 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function Button({onClick, outlined, children, width, id, disabled, type, isToggled}) {
	const style = width ? { width } : { width: "100%", maxWidth: "150px" }
	return (
		<button id={id} disabled={disabled}
			type={type || "button"} 
			onClick={onClick} 
			className={`${styles.yoteiButton} ${outlined ? styles.yoteiButtonBack : styles.yoteiButtonNormal} ${isToggled ? styles.toggled : undefined}`} style={style}>
			{children}
		</button>
	)
}
