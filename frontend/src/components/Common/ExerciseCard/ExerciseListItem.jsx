import { ChevronRight } from "react-bootstrap-icons"
import "./ExerciseListItem.module.css"
import { Link } from "react-router-dom"

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
 * @updated 2023-05-30 Chimera, updated documentation
 * @version 1.1
 */
export default function ExerciseListItem({ item, text, detailURL, id, index, checkBox }) {

	return (
		<div className="exercise-list-container" data-testid="ExerciseListItem">
			<div className='exercise-list-header' style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				{checkBox}
				<Link to={detailURL + id} data-testid="ExerciseListItem-link" style={{width: "100%"}}>
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						<div style={{display: "flex", alignItems: "center"}}>
							<div className="href-link" style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExerciseListItem-item">{item}</div>
						</div>
						<div className="flex-shrink-0" style={{display: "flex", alignItems: "center"}}>
							<div className="exercise-list-duration" data-testid="ExerciseListItem-text">
								<p>{text}</p>
							</div>
							<ChevronRight size="30px"/>
						</div>
					</div>

				</Link>
			</div>
		</div>
	)
}
