import { ChevronRight } from "react-bootstrap-icons"
import styles from "./Examinee.module.css"
import { Link } from "react-router-dom"
import { Trash, Pencil, X as CloseIcon  } from "react-bootstrap-icons"

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
 * 		  detailURL @type {string} 	- The base URL for exercises
 * 		  id @type {integer} 			- The ID for this particular exercise in database
 * 		  index @type {integer} 		- The ID for this particular exercise on current page (Used for coloring)
 * 
 * Example usage:
 * 		<Examinee
 * 			item={the exercise name}
 * 			text={exercise duration + " min"}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 * 			detailURL={the base URL for exercises}
 * 			index={The index for the exercise in the list containing fetched exercises}>
 * 
 * 			"Description"
 * 		</Examinee>
 * 
 * @author Team 1
 * @since 2024-05-06
 */
export default function Examinee({ item, text, detailURL, id, index, checkBox, onRemove, onEdit }) {

	return (
		<div className={styles["examinee-list-container"]} data-testid="ExamineeListItem">
			<div className={styles["examinee-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				{checkBox}
				<div to={detailURL + id} data-testid="ExamineeListItem-link" style={{width: "100%"}}>
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						<div style={{display: "flex", alignItems: "center"}}>
							<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExamineeListItem-item">{item}</div>
						</div>
						<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
							<div className={styles["examinee-list-duration"]} data-testid="ExamineeListItem-text">
								<p>{text}</p>
							</div>
							<Pencil
							onClick={() => {onEdit}
							}
							size="24px"
							style={{ color: "var(--red-primary)" }}
              />
              <CloseIcon
                onClick={() => onRemove}
                size="24px"
                style={{ color: "var(--red-primary)" }}
              />

						</div>
					</div>

				</div>
			</div>
		</div>
	)
}
