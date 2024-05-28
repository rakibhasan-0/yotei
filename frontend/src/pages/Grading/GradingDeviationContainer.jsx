import styles from "./GradingDeviations.module.css"
import React from "react"
import { useState } from "react"


/**
 * This file contains the GradingDeviationContainer component which is used to display grading deviations.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-07
 */


/**
 * 
* @param
*  - id: The unique identifier for the grading deviation.
*  - name: The name of the technique.
*  - comment: The comment for the grading.
*  - pairComment: The pair comment for the grading deviation.
*  - generalComment: The general comment for the whole groups grading.
*  - passed: A boolean indicating whether the grading has been passed.
* @returns A site where the user can check the examinees grading and if there are any deviations and comments etc.
*/

function GradingDeviationContainer({ id, name, comment, pairComment, generalComment, passed }) {
	const [toggled, setToggled] = useState(false)

	/**
	 * Checks for invalid id
	 * @param {int} id 
	 * @returns boolean value which states whether the ID is valid or not
	 */
	function checkID(id) {
		if (id === null || id === undefined) {
			console.error("ID is invalid")
			return false
		}

		return true
	}


	/**
	 * Gets amount of comments for the technique shown in this container
	 * @returns The amount of comments for the technique shown in this container
	 */
	function getNrComments() {
		let count = 0
		if(comment != undefined && comment != "") {
			count++
		}
		if(pairComment != undefined && pairComment != "") {
			count++
		}
		if(generalComment != undefined && generalComment != "") {
			count++
		}
		return count
	}

	/**
	 * Gets a small bubble notification if the technique has any comments, else nothing
	 * @returns a small bubble notification if the technique has any comments, else nothing
	 */
	function getCommentNotification() {
		return (
				getNrComments() > 0 ? (
					<div className={styles.outerCircle}>
						<div className={styles.innerCircle}>
							<p className={styles.counterText}>
								{getNrComments()}
							</p>
						</div>
					</div>
				) : null
		)
	}

	/**
	 * Gets the container which holds all comments
	 * @returns The container which holds all comments
	 */
	function getCommentContainer() {
		return (
			<div id={`${id}-content`} className={styles["sc23-session-container-content"]}>

				<div className={styles["sc23-session-container-child"]} style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
					{ (comment != "" && comment != undefined) &&
						<div>
							<h2 className={styles["commentStyle2"]}>Kommentar:</h2>
							{
								<h2 id="commentDisplay" className={styles["commentStyle"]}>
									{comment}
								</h2>
							}
						</div>
					}
					{
						(pairComment != "" && pairComment != undefined) &&
						<div>
							<h2 className={styles["commentStyle2"]}>Parkommentar:</h2>
							{
								<h2 id="commentPairDisplay" className={styles["commentStyle"]}>
									{pairComment}
								</h2>
							}
						</div>
					}
					{
						(generalComment != "" && generalComment != undefined) &&
						<div>
							<h2 className={styles["commentStyle2"]}>Gruppkommentar:</h2>
							{
								<h2 id="commentGeneralDisplay" className={styles["commentStyle"]}>
									{generalComment}
								</h2>
							}
						</div>
					}
				</div>
			</div>
		)
	}

	return (

		checkID(id) ?
			(
				<div id={id} className={styles["sc23-session-container"]}>
					<div id={`${id}-header`} className={passed ? styles["sc23-session-container-header-passed"] : styles["sc23-session-container-header-failed"]}>
						<div className={styles["sc23-outline-sub"]}>

							<div id={`${id}-clickable`} className={styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
								<h2 id="nameDisplay" className={styles["techniqueName"]}>
									{name}
								</h2>
								{getCommentNotification()}
							</div>
							{getCommentContainer()}
						</div>
					</div>
				</div>
			)
			:
			(
				<div id="session-container-error">Kunde inte ladda in tillfället</div>
			)
	)
}


export default GradingDeviationContainer