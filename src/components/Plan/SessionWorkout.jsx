import React, { useContext } from "react"
import "./SessionWorkout.css"
import { StopwatchFill } from "react-bootstrap-icons"
import { Pencil } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"
import MiniPopup from "../Common/MiniPopup/MiniPopup"
import Button from "../Common/Button/Button"
import { useNavigate } from "react-router"
import { useState } from "react"

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

function SessionWorkout({ id, workout, sessionID, creatorID, groupID }) {
	const workoutId = setWorkoutID()
	const title = setWorkoutTitle()
	const description = setWorkoutDescription()
	const sessionId = setSessionID()
	const groupId = setGroupID()
	const userContext = useContext(AccountContext)
	const { userId } = userContext
	const navigate = useNavigate()
	const [isOpenPopup, setIsOpenPopup] = useState(false)

	const navigateAndClose = async path => {
		await setIsOpenPopup(false)
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

	function setGroupID() {
		if (groupID === null || groupID === undefined) {
			console.error("Missing group ID")
			return null
		}

		return groupID
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
			<div id={id} className="sc23-session-workout">
				{
					checkWorkout() ?
						<div className="sc23-session-workout-info">
							<h2 className="sc23-session-workout-text">{title}</h2>
							<p className="sc23-session-workout-text">{description}</p>
						</div>

						:

						<div id={`${id}-no-workout`} className="sc23-session-workout-info">
							<h2 className="sc23-session-workout-text">Det finns inget pass.</h2>
							<p className="sc23-session-workout-text">Du kan trycka på pennan för att lägga till ett.</p>
						</div>
				}

				<div className="sc23-session-workout-buttons">
					{
						checkWorkout() ?
							<Link id="session-workout-workout-button" className="sc23-session-workout-links" to={`/workout/${workoutId}`}>
								<StopwatchFill aria-label="Workout detail" role="details" className="sc23-session-workout-svg" />
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
								className="sc23-session-workout-svg"
								onClick={() => setIsOpenPopup(true)}
							/>
						</div>
					}
				</div>

				<MiniPopup id="sometestid" title={"Redigera"} isOpen={isOpenPopup} setIsOpen={setIsOpenPopup} titleTopMargin={14}>
					<div className="popupContainer">
						<div className="buttonContainer">
							<Button id="newPlan" onClick={() => navigateAndClose(`/plan/edit/${groupId}`)} outlined={false}>Grupp</Button>
							<Button id="newSession" onClick={() => navigateAndClose(`/session/edit/${sessionId}`)} outlined={false}>Tillfälle</Button>
						</div>
					</div>
				</MiniPopup>

			</div>
			:

			<div id="SessionWorkoutError" ><p>Kunde inte ladda in passet</p></div>


	)
}


export default SessionWorkout