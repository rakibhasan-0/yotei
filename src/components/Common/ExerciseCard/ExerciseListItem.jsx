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
export default function ExerciseListItem({ item, text, detailURL, id, index}) {

	return (
		<a className="exercise-link" href={detailURL + id}>
			<div className="exercise-list-container" data-testid="ExerciseListItem">
				<div className='exercise-list-header' style={{backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)"}}>
					<div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
						<div className="exercise-list-item">
							<div className="href-link" style={{wordBreak:"break-word", textAlign:"left"}} data-testid="ExerciseListItem-item">{item}</div>
						</div>
						<div className="exercise-list-duration" data-testid="ExerciseListItem-text">
							<p>{text}</p>
						</div>
					</div>
					<div>
						<div className="technique-arrow-container">
							<ChevronDown />
						</div>
					</div>
				</div>
			</div>
		</a>
	)
}
