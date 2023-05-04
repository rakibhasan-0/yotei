import React from "react"
import "./Button.css"

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
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function Button({onClick, outlined, children, width, id}) {
	const style = width ? { width } : { width: "100%", maxWidth: "150px" }
	return (
		<div id={id} onClick={onClick} className={ ["button", outlined ? "button-back" : "button-normal"].join(" ") } style={style}>
			{children}
		</div>
	)
}
