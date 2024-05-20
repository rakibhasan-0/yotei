import { ChevronRight } from "react-bootstrap-icons"
import styles from "./techniquechainCard.module.css"
import { Link } from "react-router-dom"

/**
 * An TechniquechainCard that can be used in an list view.
 * It displays the title of an chain,
 * also the description belonging to the chain when the
 * drop-down is toggled.
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the exercise
 *     	children @type {string} 	- Text displaying the description of the exercise
 * 		detailURL @type {string} 	- The base URL for exercises
 * 		id @type {integer} 			- The ID for this particular exercise in database
 * 		index @type {integer} 		- The ID for this particular exercise on current page (Used for coloring)
 * 		path @type {string}			- The path to the specific exercise (only used if the exercise is in a list)
 * 
 * Example usage:
 * 		<TechniquechainCard
 * 			item={the exercise name}
 * 			text={exercise duration + " min"}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 * 			detailURL={the base URL for chains}
 * 			index={The index for the exercise in the list containing fetched exercises}>
 * 
 * 			"Description"
 * 		</TechniquechainCard>
 * 
 * @author Durian Team 3
 * @since 2024-05-20
 * @version 1.0
 * based on earlyer code by Chimera, Phoenix
 */
export default function TechniquechainCard({ item, detailURL, id, index, checkBox , path}) {

	// Fixes the path regardless if the exercise is in a list or not.
	const tempPath = (path === undefined) ? id : path
	const handleClick = () =>{
		localStorage.setItem("stored_techniquechain", id)
	}

	return (
		<div className={styles["exercise-list-container"]} data-testid="ExerciseListItem" onClick={handleClick} id={id}>
			<div className={styles["exercise-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				{checkBox}
				<Link to={detailURL + tempPath} data-testid="ExerciseListItem-link" style={{width: "100%"}}>
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						<div style={{display: "flex", alignItems: "center"}}>
							<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExerciseListItem-item">{item}</div>
						</div>
						<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
							<ChevronRight size="30px"/>
						</div>
					</div>

				</Link>
			</div>
		</div>
	)
}
