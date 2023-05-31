import React, { useContext } from "react"
import styles from "./SessionWorkout.module.css"
import { StopwatchFill } from "react-bootstrap-icons"
import { Pencil } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"
import { useNavigate } from "react-router"

/**
 * The SessionWorkout component is used to display information about a Sessions
 * connected workout if it exists, if no workout is connected: placeholders are
 * rendered and the if the currently logged in user is the creator of the Session
 * a button to connect a workout is displayed. The edit button is only displayed if
 * the current user is the creator of the plan which includes the session, otherwise
 * the edit-button is hidden.
 * 
 * @param 	id 					@type { string } 				- An ID to identify the component
 * @param	workout				@type { string }				- 
 * @param	sessionID			@type { int }					- An integer representing the unique id for the session
 * @param	creatorID			@type { int }					- ID of the user that created the workout which includes the session
 * 
 * Example usage:
 * <SessionWorkout id ="testSessionWorkout" workout={workout} sessionID=1 creatorID=workout.author/>
 * 
 * @returns A SessionWorkout component
 * 
 * @author Griffin DV21JJN C19HLN
 */

function SessionWorkout({ id, workout, sessionID, creatorID }) {
	const workoutId = setWorkoutID()
	const title = setWorkoutTitle()
	const description = setWorkoutDescription()
	const sessionId = setSessionID()
	const userContext = useContext(AccountContext)
	const { userId } = userContext
	const navigate = useNavigate()

	const navigateAndClose = async path => {
		navigate(path)
	}

	function setWorkoutID() {
		if (checkWorkout() || isSpecifiedWorkoutID())
			return workout.id

		return null
	}

	function isSpecifiedWorkoutID() {
		if (checkWorkout()) {
			return !(workout.id === null || workout.id === undefined)
		}

		return false
	}


	function checkWorkout() {
		return !(workout === null || workout === undefined)
	}


	function userIsCreator() {
		if (userId == creatorID)
			return true

		return false
	}


	function userIsAdmin() {
		return isAdmin(userContext)
	}


	function setSessionID() {
		if (sessionID === null || sessionID === undefined) {
			console.error("Missing Session ID")
			return null
		}

		return sessionID
	}

	function isSpecifiedTitle() {
		if (checkWorkout()) {
			return !(workout.name === null || workout.name === undefined)
		}

		return false
	}

	function isSpecifiedDesc() {
		if (checkWorkout()) {
			return !(workout.desc === null || workout.desc === undefined)
		}

		return false
	}

	function setWorkoutTitle() {
		if (checkWorkout() && isSpecifiedTitle())
			return workout.name

		return "Ingen titel"
	}

	function setWorkoutDescription() {

		if (checkWorkout() && isSpecifiedDesc())
			return workout.desc

		return "Passet saknar beskrivning"
	}


	function checkID() {
		if (id === null || id === undefined) {
			console.error("Missing ID in SessionWorkout")
			return false
		}

		return true
	}



	return (
		checkID() ?
			<div id={id} className={styles.sc23_session_workout}>
				{
					checkWorkout() ?
						<div className={styles.sc23_session_workout_info}>
							<h2 className={styles.sc23_session_workput_text}>{title}</h2>
							<p className={styles.sc23_session_workput_text}>{description}</p>
						</div>

						:

						<div id={`${id}-no-workout`} className={styles.sc23_session_workout_info}>
							<h2 className={styles.sc23_session_workput_text}>Det finns inget pass.</h2>
							<p className={styles.sc23_session_workput_text}>Du kan trycka på pennan för att lägga till ett.</p>
						</div>
				}

				<div className={styles.sc23_session_workout_buttons}>
					{
						checkWorkout() ?
							<Link id="session-workout-workout-button" className={styles.sc23_session_workout_links} to={`/workout/${workoutId}`}>
								<StopwatchFill aria-label="Workout detail" role="details" className={styles.sc23_session_workout_svg} />
							</Link>
							: 
							<div />
					}

					{
						(userIsAdmin() || userIsCreator()) &&
						<div>
							<Pencil
								aria-label="Edit Session"
								role="edit"
								className={styles.sc23_session_workout_svg}
								onClick={() => navigateAndClose(`/session/edit/${sessionId}`)}
							/>
						</div>
					}
				</div>

			</div>
			:

			<div id="SessionWorkoutError" ><p>Kunde inte ladda in passet</p></div>


	)
}


export default SessionWorkout