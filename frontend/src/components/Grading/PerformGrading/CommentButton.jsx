import React from "react"
import  "react-bootstrap-icons"
import styles from "./CommentButton.module.css"

/**
 * This component is representing a comment button during
 * grading an examination
 *
 * @author Team Apelsin (Group 5)
 * @version 1.0
 * @since 2024-05-02
 */


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function CommentButton( {id, onClick, hasComment}) {
	return (
		<div id={id} onClick={onClick} className={styles.buttonContainer}>
			<div>
				<i className="bi bi-file-text h3"  />
				{hasComment && <span className={styles.notificationCircle} id={"notification-circle"}>1</span>}
			</div>
		</div>
	)
}