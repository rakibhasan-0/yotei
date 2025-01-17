import { ChevronRight } from "react-bootstrap-icons"
import styles from "./ExerciseListItem.module.css"
import { Link } from "react-router-dom"
import PopupMini from "../Popup/PopupMini"
import { useState } from "react"
import ExerciseDetailMini from "../../../pages/Activity/Exercise/ExerciseDetailMini"

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
 * 		checkBox @type {Object}     - Chckbox to be rendered in the ListItem
 * 		path @type {string}			- The path to the specific exercise (only used if the exercise is in a list)
 * 		popUp @type {boolean}       - True if it should be a popUp
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
 * @author Chimera, Phoenix, Team Kiwi
 * @since 2023-05-10
 * @updated 2023-05-30 Chimera, updated documentation
 * @updated 2024-05-17 Tomato, Fixed so that an exercise get the correct path if in a list.
 * @updated 2024-05-22 Kiwi, fixed a popup window for when popUp is true, added links so you can better se when something redirects to popups.
 * @updated 2024-05-29 Kiwi, Updated props comment
 * @version 1.1
 */
export default function ExerciseListItem({ item, text, detailURL, id, index, checkBox, path, popUp }) {

	// Fixes the path regardless if the exercise is in a list or not.
	const tempPath = (path === undefined) ? id : path
	const [isOpen, setIsOpen] = useState(false)

	const handleClick = () => {
		if (popUp) {
			setIsOpen(true)
		}
	}

	const setExercise = () =>{
		localStorage.setItem("stored_exercise", id)
	}

	return (
		<>
			<PopupMini title={item} id="pop-up-id-exer" isOpen={isOpen} setIsOpen={setIsOpen} isNested={true}>
				<ExerciseDetailMini id={id}>
				</ExerciseDetailMini>
			</PopupMini>
			<div className={styles["exercise-list-container"]} data-testid="ExerciseListItem" id={id} onClick={setExercise}>
				<div className={styles["exercise-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
					{checkBox ? <div className={styles["technique-checkbox-container"]}>{checkBox}</div> : null}
					{popUp ?

						<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }} onClick={handleClick} >
							<div style={{ display: "flex", alignItems: "center" }}>
								<Link >
									<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExerciseListItem-item">{item}</div>
								</Link>
							</div>
							<div className={styles["flex-shrink-0"]} style={{ display: "flex", alignItems: "center" }}>
								<div className={styles["exercise-list-duration"]} data-testid="ExerciseListItem-text">
									<p>{text}</p>
								</div>
								<Link >
									<ChevronRight size="30px" />
								</Link>
							</div>
						</div>
						:
						<Link to={detailURL + tempPath} data-testid="ExerciseListItem-link" style={{ width: "100%" }}>
							<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExerciseListItem-item">{item}</div>
								</div>
								<div className={styles["flex-shrink-0"]} style={{ display: "flex", alignItems: "center" }}>
									<div className={styles["exercise-list-duration"]} data-testid="ExerciseListItem-text">
										<p>{text}</p>
									</div>
									<Link to={detailURL + tempPath}>
										<ChevronRight size="30px" />
									</Link>
								</div>
							</div>
						</Link>
					}

				</div>
			</div>
		</>

	)
}
