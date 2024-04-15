import Button from "../../Common/Button/Button"
import Spinner from "../../Common/Spinner/Spinner"

import styles from "./ActivityDelete.module.css"
import { useContext, useEffect, useState,} from "react"
import { AccountContext } from "../../../context"
import { HTTP_STATUS_CODES } from "../../../utils"
import WorkoutListItem from "../../Workout/WorkoutListItem"
import { useNavigate } from "react-router" 
import ErrorState  from "../../Common/ErrorState/ErrorState"

/**
 * ActivityDelete is a popup page that allows the user to delete
 * a technique or exercise. 
 * 
 * Props:
 *     	id @type {string} - Should be set to a unique activityID to identify the component
 *		activityID @type {string} - ID for the activity, either technique ID or exercise ID
 *		name @type {string} - The name for the activity
 *     	setIsOpen @type {useState} - Must be passed by parent to allow the popup
 *			to close itself
 *		what @type {string} - String indicating if it is showing a technique or exercise
 *			must be set to either "Teknik" or "Övning". CASE SENSITIVE!
 *
 * Example usage:
 *
 * const [showDeletePopup, setShowDeletePopup] = useState(false)
 * ........ 
 *		<Popup
 * 			title="Ta bort teknik"
 *			isOpen={showDeletePopup}
 *			setIsOpen={setShowDeletePopup}>
 *			<ActivityDelete id={"technique-workout-delete-popup"} activityID={techniqueId 
 *				name={technique.name} setIsOpen={showDeletePopup} what={"Teknik"}/>
 *		</Popup>
 *
 * Changes version 2.0
 *     Replaced custom workout card with standard workout card.
 *
 * @author Team Medusa (Grupp 6)
 * @version 2.0
 * @since 2023-05-24
 */
export default function ActivityDelete({ id, activityID, name, setIsOpen, what }) {
	
	const {token} = useContext(AccountContext)
	const [workouts, setWorkouts] = useState([])
	const [gotResponse, setGotResponse] = useState(false)
	const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
	const [hasError, setHasError] = useState(false)
	const navigate = useNavigate()


	useEffect(() => {
		fetchAssociatedWorkouts(activityID, token)
	}, [])
	
	async function fetchAssociatedWorkouts(activityID, token) {

		const endpoint = isTechnique() ? "technique/" : "exercise/"
		const url = "/api/workouts/associated/" + endpoint + activityID
		const requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/json", "token": token }, 
		}
		
		await fetch(url, requestOptions)
			.then(async response => {
				const data = response.status === HTTP_STATUS_CODES.OK ? await response.json() : []
				
				if (response.status === HTTP_STATUS_CODES.OK ||
					response.status === HTTP_STATUS_CODES.NOT_FOUND) {					
					setWorkouts(data)
					setGotResponse(true)
					setDeleteButtonDisabled(false)
				} else {
					setHasError(true)
				}

			}).catch(() => {
				setHasError(true)
			})
	}

	async function cascadeDelete(activityID, token) {
		let url = isTechnique() ? "/api/techniques/" : "/api/exercises/remove/"
		url += activityID

		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json", "token": token }, 
		}
		
		await fetch(url, requestOptions)
			.then(async data => {
				await data.json()
			
			}).catch(() => 
				setHasError(true)
			)

		
	}

	function isTechnique() {
		return what.toLowerCase() === "teknik"
	}

	function constructButtons() {
		return <div className={styles.buttonGroup}>
			<Button
				id={"technique-delete-abort"}
				outlined={true}
				disabled={false}
				width="100%"
				onClick={() => {setIsOpen(false)}}>
				<p>Avbryt</p></Button>
			
			<Button
				id={"technique-delete-confirm"}
				outlined={false}
				disabled={deleteButtonDisabled}
				width="100%"
				onClick={async () => {
					cascadeDelete(activityID, token)
					isTechnique() ? await navigate("/technique") : await navigate("/exercise")
				}}>
				<p>Ta bort</p></Button>
		</div>
	}

	function constructWorkoutCardList() {
		return <>
			<p>{ hasWorkouts() ? `${what}en finns i följande pass:` : "" }</p>
			<div className="grid-striped" style={{textAlign: "center", marginBottom: "1rem"}}>
				{workouts.map(workout => {
					workout.workoutID = workout.id
					return <WorkoutListItem key={workout.id} workout={workout} showFavorite={false} />})
				}
			</div>
		</>
	}

	function hasWorkouts() {
		return workouts.length > 0
	}

	if (hasError) {
		const destination = isTechnique() ? "/technique" : "/exercise"
		return <ErrorState 
			message={"Ett nätverksfel inträffade. Kontrollera din anslutning"}
			onBack={() => {navigate(destination)}}
			id={"activity-delete-errorstate"}
		/>
	}

	return <div className={styles.popupContainer} id={id}>
		<p>Är du säker på att du vill ta bort {what.toLowerCase()}en <b>{name}?</b></p>
		
		{ gotResponse ? constructWorkoutCardList() : <Spinner id={"technique-workout-spinner"}/> }
		<p>
			{ hasWorkouts() && `${what}en kommmer att tas bort från samtliga pass ovan.` } 
		</p>
		{ constructButtons() }

	</div>
}