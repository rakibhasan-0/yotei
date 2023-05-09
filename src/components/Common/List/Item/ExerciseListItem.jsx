import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import "./ExerciseListItem.css"

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
 * @author Chimera dv21aag, dv21oby + improved by Phoenix bois
 * @since 2023-04-25
 * @version 1.0
 */
export default function ExerciseListItem({ item, text, children, detailURL, id, index}) {
	const [toggled, setToggled] = useState(false)

	return (
		<div className="list-container" data-testid="ExerciseListItem">
			<div className='list-header' style={{backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)"}}>
				<div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
					<div className="list-item">
						<a href={detailURL + id} className="href-link" style={{wordBreak:"break-word"}} data-testid="ExerciseListItem-item">{item}</a>
					</div>
					<div className="list-duration" data-testid="ExerciseListItem-text">
						<p>{text}</p>
					</div>
				</div>
				<div className={["list-toggle", toggled ? "list-rotate" : ""].join(" ")}>
					<ChevronDown data-testid="ExerciseListItem-toggle" size={28} onClick={() => setToggled(!toggled)} />
				</div>
			</div>
			{ toggled && 
				<div className="list-child" data-testid="ExerciseListItem-children">
					{children}
				</div> 
			}
		</div>
	)
}
