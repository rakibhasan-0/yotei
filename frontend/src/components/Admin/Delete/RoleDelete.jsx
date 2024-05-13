import Button from "../../Common/Button/Button"
import styles from "./RoleDelete.module.css"
import ErrorState  from "../../Common/ErrorState/ErrorState"
import { useContext, useEffect, useState,} from "react"
import { AccountContext } from "../../../context"
import { useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify" 

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
 * @author Team Medusa (Grupp 6), Team Kiwi (Group 2)
 * @version 2.1
 * @since 2023-05-24
 * @updated 2024-05-07 Fixed so navigation goes back to activity page instead of technique pr exrecise page, as those are gone
 */
export default function RoleDelete({ id, roleID, name, setIsOpen, what }) {
	
	const {token} = useContext(AccountContext)
	const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
	const [hasError, setHasError] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const hasPreviousState = location.key !== "default"

	useEffect(() => {
		setDeleteButtonDisabled(false)
	}, [])

	async function cascadeDelete(roleID, token) {
		let url = "/api/roles/"
		url += roleID

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
					cascadeDelete(roleID, token)
					toast.success(`${what} ${name} har tagits bort`)
					handleNavigation()
				}}>
				<p>Ta bort</p></Button>
		</div>
	}



	if (hasError) {
		return <ErrorState 
			message={"Ett nätverksfel inträffade. Kontrollera din anslutning"}
			onBack={handleNavigation}
			id={"activity-delete-errorstate"}
		/>
	}


	/**
	 * Handles navigation in the page
	 * Makes sure the page navigate back to default activity page if 
	 * navigate(-1) is not a page on our website
	 */
	const handleNavigation = () => {
		if(hasPreviousState) {
			navigate(-1)
		}
		else{
			navigate("/admin")
		}
	}

	return <div className={styles.popupContainer} id={id}>
		<p>Är du säker på att du vill ta bort {what.toLowerCase()} <b>{name}?</b></p>
		{/* 		
		{ gotResponse ? constructWorkoutCardList() : <Spinner id={"technique-workout-spinner"}/> }
		<p>
			{ hasWorkouts() && `${what}en kommmer att tas bort från samtliga pass ovan.` } 
		</p> */}
		{ constructButtons() }

	</div>
}