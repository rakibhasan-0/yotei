import { useState, useContext, useCallback, useEffect } from "react"
import { Form } from "react-bootstrap"
import styles from "./WorkoutFormComponent.module.css"
import InputTextField from "../../Common/InputTextField/InputTextField"
import ActivityListComponent from "./ActivityListComponent"
import TextArea from "../../Common/TextArea/TextArea"
import TagInput from "../../Common/Tag/TagInput"
import AddUserComponent from "./AddUserComponent"
import Button from "../../Common/Button/Button"
import CheckBox from "../../Common/CheckBox/CheckBox"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import {
	WORKOUT_CREATE_TYPES,
	checkIfActivityInfoPoupChangesMade
} from "./WorkoutCreateReducer"
import {  useNavigate } from "react-router"
import Popup from "../../Common/Popup/Popup"
import ActivityInfoPopUp from "./ActivityInfoPopUp"
import AddActivity from "./AddActivity"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import EditActivityPopup from "./EditActivityPopup"
import { useParams } from "react-router"
import { unstable_useBlocker as useBlocker } from "react-router"

/**
 * Component for input-form to be used to create a new workout (WorkoutCreate.js)
 *
 * This component requires the WorkoutCreateContext to be used.
 *
 * Props:
 *     callback @type {function}  - Function to call when form is filled and to be sent.
 * 		state @type {State} - Holds information about the caller
 *
 * Example usage:
 *		<WorkoutFormComponent callback={submitHandler} />
 *
 * @author Team Minotaur, Team 3 Durian
 * @version 2.1
 * @since 2023-05-24, 2024-05-28
 * @updated 2023-06-01 Chimera, updated pathing when pressing return to create session
 * @updated 2024-05-29 Kiwi, Updated props comment.
 */
export default function WorkoutFormComponent({ callback, state }) {
	const { workoutCreateInfo, workoutCreateInfoDispatch } =
		useContext(WorkoutCreateContext)
	const [leaveActivityPickerPopup, setLeaveActivityPickerPopup] = useState(false)
	const [validated, setValidated] = useState(false)
	const [acceptActivities, setAcceptActivities] = useState(false)
	const navigate = useNavigate()
	//const location = useLocation()
	//const hasPreviousState = location.key !== "default"
	const [showPopup, setShowPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)

	const { workoutId } = useParams()
	
	const blocker = useBlocker(() => {
		if (isBlocking) {
			setShowPopup(true)
			return true
		}
		return false
	})

	useEffect(() => {
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.CLOSE_POPUP
		})
		setIsBlocking(true)
	}, [])
	
	/**
	 * Sets the title of the page.
	 */
	const getPopupTitle = useCallback(() => {
		if (
			workoutCreateInfo.popupState.types.activityPopup ||
			workoutCreateInfo.popupState.types.freeTextPopup
		) {
			return "Aktiviteter"
		} else if (workoutCreateInfo.popupState.types.chooseActivityPopup) {
			return null
		} else if (workoutCreateInfo.popupState.types.editActivityPopup) {
			return "Redigera aktivitet"
		} else {
			return ""
		}
	}, [workoutCreateInfo.popupState.types])

	/**
	 * Handles the submission of a workout. This function is called when the
	 * save button is pressed.
	 *
	 * @param {*} event
	 */
	function handleSubmit(event) {
		setIsBlocking(false)
		setShowPopup(false)
		const form = event.currentTarget
		event.preventDefault()

		if (form.checkValidity() === false) {
			event.stopPropagation()
		} else if (
			workoutCreateInfo.data.activityItems.length == 0 &&
			!acceptActivities
		) {
			setAcceptActivities(true)
		} else {
			callback()
		}

		setValidated(true)
	}

	/**
	 * This function is called when the "go back" button is pressed.
	 * Checks if any changes are made to the workout-form, if so a confirm-popup is shown.
	 * If no changes to the workout are made, then it navigates back.
	 */
	function handleGoBack() {
		setIsBlocking(false)
		setShowPopup(true)
	}


	function confirmGoBack() {

		localStorage.removeItem("workoutCreateInfo")// Clear local storage as confirmed

		if (state?.fromSession && !state?.fromCreate) {
			return navigate(`/session/edit/${state.session.sessionId}`, { replace: true, state })
		} else if(state?.fromCreate) {
			return navigate("/session/create", { replace: true, state })
		}
		else if (state?.fromWorkoutView) {
			return navigate("/workout/" + state.workoutId)
		}
		else {
			if (workoutId){
				return navigate("/workout/" + workoutId)
			}
			else{
				return navigate("/workout")
			}
		}
		
	}

	function handlePopupClose() {
		let  shouldClose = false

		if (workoutCreateInfo.popupState.types.activityPopup) {
			shouldClose = workoutCreateInfo.addedActivities.length === 0
		} else if (workoutCreateInfo.popupState.types.editActivityPopup) {
			shouldClose = false
			shouldClose = !checkIfActivityInfoPoupChangesMade(workoutCreateInfo)
		} else if (workoutCreateInfo.popupState.types.freeTextPopup) {
			shouldClose = !workoutCreateInfo.addedActivities.some(activity => activity.name.length > 0)
		}
			
		if(shouldClose) {
			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES
			})
			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.CLOSE_POPUP
			})
		} else {
			setLeaveActivityPickerPopup(true)
			sessionStorage.clear()
			localStorage.clear()
		}
		
	}

	return (
		<>
			{/* preventDefault stops random buttons in components triggering the form submit.*/}
			<Form noValidate validated={validated} onSubmit={e => e.preventDefault()}>
				<div className={styles.row}>
					<Form.Group controlId="validationCustom0" className="mb-1">
						<Form.Control
							type="text"
							placeholder="Namn"
							errorMessage={
								validated && workoutCreateInfo.data.name.length == 0
									? "Fyll i namn på passet"
									: ""
							}
							as={InputTextField}
							text={workoutCreateInfo.data.name}
							value={workoutCreateInfo.data.name}
							required
							onChange={(e) =>
								workoutCreateInfoDispatch({
									type: WORKOUT_CREATE_TYPES.SET_NAME,
									name: e.target.value
								})
							}
						/>
					</Form.Group>

					<Form.Group className="mb-1" controlId="validationCustom03" >
						<Form.Control
							value={workoutCreateInfo.data.description}
							text={workoutCreateInfo.data.description}
							as={TextArea}
							errorDisabled={true}
							rows={3}
							placeholder="Beskrivning av pass"
							onChange={(e) =>
								workoutCreateInfoDispatch({
									type: WORKOUT_CREATE_TYPES.SET_DESCRIPTION,
									description: e.target.value
								})
							}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<ActivityListComponent />
						<ConfirmPopup
							id="NoActivitiesConfirm"
							showPopup={
								validated &&
								workoutCreateInfo.data.activityItems.length == 0 &&
								acceptActivities
							}
							setShowPopup={setAcceptActivities}
							popupText="Är du säker på att du vill skapa ett pass utan aktiviteter?"
							confirmText="Ja"
							backText="Avbryt"
							onClick={callback}
						/>
						<div className={styles.activityButtons}>
							<div className={styles.container}>
								<Button
									onClick={() =>
										workoutCreateInfoDispatch({
											type: WORKOUT_CREATE_TYPES.OPEN_FREE_TEXT_POPUP
										})
									}
								>
									<h2>+ Fri text</h2>
								</Button>
								<Button
									onClick={() => {
										workoutCreateInfoDispatch({
											type: WORKOUT_CREATE_TYPES.OPEN_CHOOSE_ACTIVITY_POPUP
										})
										setIsBlocking(false)
									}
										
									}
								>
									<h2>+ Aktivitet</h2>
								</Button>
							</div>
						</div>
					</Form.Group>

					<Form.Group className="mb-3">
						<CheckBox
							id="workout-create-checkbox"
							label="Privat pass"
							onClick={() =>
								workoutCreateInfoDispatch({
									type: WORKOUT_CREATE_TYPES.SET_IS_PRIVATE,
									isPrivate: !workoutCreateInfo.data.isPrivate
								})
							}
							checked={workoutCreateInfo.data.isPrivate}
						/>
					</Form.Group>

					<Form.Group>
						<AddUserComponent
							id="workout-create-add-users"
							addedUsers={workoutCreateInfo.data.users}
							setAddedUsers={(users) =>
								workoutCreateInfoDispatch({
									type: WORKOUT_CREATE_TYPES.SET_USERS,
									users
								})
							}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<h2 className={styles.addTagTitle}>Taggar</h2>
						<TagInput
							id="workout-create-add-tag"
							isNested={false}
							addedTags={workoutCreateInfo.data.tags}
							setAddedTags={(tags) =>
								workoutCreateInfoDispatch({
									type: WORKOUT_CREATE_TYPES.SET_TAGS,
									tags
								})
							}
							itemName={workoutCreateInfo.data.name}
						/>
					</Form.Group>

					<Form.Group className={styles.buttonContainer}>
						<Button
							onClick={() => {
								handleGoBack()
							}}
							outlined={true}
							id="workout-create-back-button"
						>
							<h2>Tillbaka</h2>
						</Button>
						<ConfirmPopup
							id = "confirm-pop-up-go-back"
							showPopup={showPopup}
							setShowPopup={setShowPopup}
							onClick={async () => {
								confirmGoBack()
								blocker.proceed()
							}}
							popupText="Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."
							confirmText="Ja"
							backText="Avbryt" 
							zIndex={1000} 
						/>
						<Button type="submit" id="workout-create-back-button" onClick={handleSubmit}>
							<h2>Spara</h2>
						</Button>
					</Form.Group>
				</div>
			</Form>

			{/* Popups */}
			<Popup
				id="workout-create-popup"
				isOpen={workoutCreateInfo.popupState.isOpened}
				setIsOpen={handlePopupClose}
				title={getPopupTitle()}
				scrollId = "scrollable-activity-content" 
			>
				{workoutCreateInfo.popupState.types.freeTextPopup && (
					<ActivityInfoPopUp isFreeText={true} />
				)}
				{workoutCreateInfo.popupState.types.activityPopup && (
					<ActivityInfoPopUp isFreeText={false} />
				)}
				{workoutCreateInfo.popupState.types.chooseActivityPopup && (
					<AddActivity
						id="add-activity-popup"
						setShowActivityInfo={(activities) => {
							workoutCreateInfoDispatch({
								type: WORKOUT_CREATE_TYPES.SET_ACTIVITIES_WITH_PARSING,
								payload: { result: activities }
							})
							workoutCreateInfoDispatch({
								type: WORKOUT_CREATE_TYPES.OPEN_ACTIVITY_POPUP
							})
						}}
						scrollId = "scrollable-activity-content" 
					/>
				)}
				{workoutCreateInfo.popupState.types.editActivityPopup && 
					<EditActivityPopup isFreeText={true} />}
			</Popup>

			<ConfirmPopup
				id="ConfirmLeaveChooseActivityPopup"
				showPopup={leaveActivityPickerPopup}
				setShowPopup={setLeaveActivityPickerPopup}
				popupText="Är du säker på att du vill avbryta?"
				confirmText="Ja"
				backText="Avbryt"
				zIndex={1000}
				onClick={() => {
					setIsBlocking(true)
					workoutCreateInfoDispatch({
						type: WORKOUT_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES
					})
					workoutCreateInfoDispatch({
						type: WORKOUT_CREATE_TYPES.CLOSE_POPUP
					})
				}}
			/>
		</>
	)
}
