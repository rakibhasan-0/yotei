import React from "react"
import { EmojiFrown } from "react-bootstrap-icons"
import styles from "./ErrorState.module.css"

/**
 * A placeholder for an error message when searching for something
 * 
 * Props:
 * 	   id (optional) @type {string} - An id used for testing.
 *     message @type {string}  - An error message to be displayed to the user.
 *
 * Example usage:
 *     <ErrorState 
 * 			id="some-id"
 * 			message="Kunde inte hitta tekniker"
 * 		/>
 *
 * @author Team Kraken
 * @version 1.0
 * @since 2023-05-22
 */

export default function ErrorStateSearch({ id, message }) {
	return (
		<div id={id} className={styles["error-state-container"]} >
			<div className={styles["error-state-icon-container"]}>
				<EmojiFrown size="5rem" color="var(--red-primary)" />
			</div>
			<h2>{message}</h2>
		</div>
	)
}
