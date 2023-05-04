import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import "./Component.css"

/**
 * A generic list item that can be used in a list view,
 * with a customizable optional item on the left of the
 * component text. The component can be expanded, and
 * the children will be displayed.
 * 
 * The width of the component will be set by the parent.
 * 
 * props = {
 *     item: Optional JSX element which will be displayed on the left of the text,
 *     text: Text of the component,
 *     children: JSX element which will be displayed when the component is expanded
 * 	   centered: Boolean to set text as centered
 *     id: string
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function Component({ item, text, children,id }) {
	const [toggled, setToggled] = useState(false)
	return (
		<div id={id} className="list-container">
			<div className='list-header'>
				<div className="list-item">
					{item}
				</div>
				<p className="list-text">{text}</p>
				<div className={["list-toggle", toggled ? "list-rotate" : ""].join(" ")}>
					<ChevronDown id={`${id}-dropdown`} size={28} onClick={() => setToggled(!toggled)} />
				</div>
			</div>
			<div className="list-item-container">
				<div className="list-child" style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
					{children}
				</div> 
			</div>
		</div>
	)
}
