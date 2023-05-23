import React from "react"
import styles from "./Button.module.css"

/**
 * A default button that should be used throughout the project.
 * 
 * The props object accepts an onClick handler for button presses.
 * Contents should be specified as a child, which can be any type 
 * of element, such as text or an icon.
 * 
 * Show the properties that can be set in the props object below:
 * props = {
 *     onClick: function,
 *     outlined: boolean
 *     id: string
 * 	   disabled: boolean
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function Button({onClick, outlined, children, width, id, disabled, isToggled}) {
	const style = width ? { width } : { width: "100%", maxWidth: "150px" }
	return (
		<button id={id} disabled={disabled} onClick={onClick} className={`${styles.yoteiButton} ${outlined ? styles.yoteiButtonBack : isToggled ? styles.yoteiButtonToggle : styles.yoteiButtonNormal}`} style={style}>
			{children}
		</button>
	)
}
