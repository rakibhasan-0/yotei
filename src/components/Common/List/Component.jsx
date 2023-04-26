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
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera dv21aag, dv21oby
 * @since 2023-04-25
 * @version 1.0
 */
export default function Component({ item, text, children }) {
	const [toggled, setToggled] = useState(false)
	return (
		<div className="list-container">
			<div className='list-header'>
				<div className="list-item">
					{item}
				</div>
				<p>{text}</p>
				<div className={["list-toggle", toggled ? "list-rotate" : ""].join(" ")}>
					<ChevronDown size={28} onClick={() => setToggled(!toggled)} />
				</div>
			</div>
			{ toggled && 
				<div className="list-child">
					{children}
				</div> 
			}
		</div>
	)
}
