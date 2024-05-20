import React, { useContext, useEffect, useState } from "react"
import styles from "./SessionWorkout.module.css"
import { StopwatchFill, ExclamationCircleFill   } from "react-bootstrap-icons"
import { Pencil } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { AccountContext } from "../../context"
import { useNavigate } from "react-router"
import Button from "../../components/Common/Button/Button"
import Review from "../../components/Plan/SessionReview/SessionReviewComponent.jsx"
<<<<<<< HEAD
import {HTTP_STATUS_CODES, canEditSession} from "../../utils"
=======
import {HTTP_STATUS_CODES} from "../../utils"
import { useCookies } from "react-cookie"
>>>>>>> main

/**
 * The SessionWorkout component is used to display information about a Sessions
 * connected workout if it exists, if no workout is connected: placeholders are
 * rendered and if the currently logged in user is the creator of the Session
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
<<<<<<< HEAD
 * @author Griffin DV21JJN C19HLN, Team Mango (2024-05-20)
 * Updates: 2024-05-20: Updated the permission check code.
=======
 * @author Griffin DV21JJN C19HLN, Team Mango (Group 4)
>>>>>>> main
 */

function SessionWorkout({ id, workout, sessionID, creatorID }) {
	const user = useContext(AccountContext) //For new permissions code.
	const workoutId = setWorkoutID()
	const title = setWorkoutTitle()
	const description = setWorkoutDescription()
	const sessionId = setSessionID()
	const navigate = useNavigate()
	const [showRPopup, setRShowPopup] = useState(false)
	const [cookies, setCookie] = useCookies(["previousPath"])
	const navigateAndClose = async path => {
		navigate(path)
	}
	const[reviewId, setReviewId] = useState(-1)

	const context = useContext(AccountContext)
	const [, setErrorStateMsg] = useState("")
	//const {token} = context

	useEffect(() => {
		setCookie("previousPath", "/plan", {path: "/"})
	}, [setCookie, cookies.previousPath])

	useEffect(() => {
		const fetchLoadedData = async() => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}

			const loadedResponse = await fetch("/api/session/" + sessionID + "/review/all", requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				//setLoading(false)
				return
			})

			if(loadedResponse.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Session med ID '" + sessionID + "' existerar inte. Felkod: " + loadedResponse.status)
				//setLoading(false)
			} else {
				const json = await loadedResponse.json()
				if(json[0] !== null && json[0] != undefined) {
					setReviewId(json[0]["id"])
				}
			}
			//console.log(userId + " and " + creatorID) //TODO "3 and 1" always. there is a bug here.
		}
		fetchLoadedData()
	})

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

	function getReviewContainer(showRPopup, setRShowPopup){
		return (<Review id={"sessionReview"} isOpen={showRPopup} setIsOpen={setRShowPopup} session_id={sessionId} workout_id={workoutId}/>)
	}

	return (
		checkID() ?
			<div id={id} className={styles.sc23_session_workout}>
				{getReviewContainer(showRPopup, setRShowPopup, workoutId)}
				{
					checkWorkout() ?
						<div className={styles.sc23_session_workout_info}>
							<h2 className={styles.sc23_session_workput_text}>{title}</h2>
							<p className={styles.sc23_session_workput_text}>{description}</p>
						</div>

						:

						<div id={`${id}-no-workout`} className={styles.sc23_session_workout_info}>
							<h2 className={styles.sc23_session_workput_text}>Det finns inget pass.</h2>
							{canEditSession(creatorID, user) &&
								<p className={styles.sc23_session_workput_text}>Du kan trycka på pennan för att lägga till ett.</p>
							}
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
						canEditSession(creatorID, user) &&
						<Button className = {styles.review_button} onClick={ () => {
							setRShowPopup(true)
						}} outlined={false}>
							<p className = {styles.review_text}>Utvärdering</p>
							{
								(reviewId < 0) && <ExclamationCircleFill className = {styles.no_review_alert}/>
							}
						</Button>
					}
					{
						canEditSession(creatorID, user) &&
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