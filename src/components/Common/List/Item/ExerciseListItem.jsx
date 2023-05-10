import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import "./ExerciseListItem.css"

/**
 * An ExerciseListItem that can be used in an list view.
 * It displays the title of an exercise and its duration,
 * also the description belonging to the exercise when the
 * drop-down is toggled.
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the exercise
 *     	text @type {string} 		- Text displaying the duration of the exercise
 *     	children @type {string} 	- Text displaying the description of the exercise
 * 		detailURL @type {string} 	- The base URL for exercises
 * 		id @type {integer} 			- The ID for this particular exercise in database
 * 		index @type {integer} 		- The ID for this particular exercise on current page (Used for coloring)
 * 
 * Example usage:
 * 		<ExerciseListItem
 * 			item={the exercise name}
 * 			text={exercise duration + " min"}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 * 			detailURL={the base URL for exercises}
 * 			index={The index for the exercise in the list containing fetched exercises}>
 * 
 * 			"Description"
 * 		</ExerciseListItem>
 * 
 * @author Chimera, Phoenix
 * @since 2023-05-10
 * @version 1.0
 */
export default function ExerciseListItem({ item, text, children, detailURL, id, index}) {
	const [toggled, setToggled] = useState(false)

	return (
		<div className="exercise-list-container" data-testid="ExerciseListItem">
			<div className='exercise-list-header' style={{backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)"}}>
				<div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
					<div className="exercise-list-item">
						<a href={detailURL + id} className="href-link" style={{wordBreak:"break-word"}} data-testid="ExerciseListItem-item">{item}</a>
					</div>
					<div className="exercise-list-duration" data-testid="ExerciseListItem-text">
						<p>{text}</p>
					</div>
				</div>
				<div className={["exercise-list-toggle", toggled ? "exercise-list-rotate" : ""].join(" ")}>
					<ChevronDown data-testid="ExerciseListItem-toggle" size={28} onClick={() => setToggled(!toggled)} />
				</div>
			</div>
			{ toggled && 
				<div className="exercise-list-child" data-testid="ExerciseListItem-children">
					{children}
				</div> 
			}
		</div>
	)
}
