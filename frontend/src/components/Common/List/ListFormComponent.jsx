import { useState, useContext, useCallback } from "react"
import { Form } from "react-bootstrap"
import styles from "./ListFormComponent.module.css"
import InputTextField from "../../Common/InputTextField/InputTextField"
//import ActivityListComponent from "./ListActivityListComponent"
import TextArea from "../../Common/TextArea/TextArea"
//import TagInput from "../../Common/Tag/TagInput"
import AddUserComponent from "../../Workout/CreateWorkout/AddUserComponent"
import Button from "../../Common/Button/Button"
import CheckBox from "../../Common/CheckBox/CheckBox"
import { ListCreateContext } from "./ListCreateContext"
import { LIST_CREATE_TYPES, checkIfActivityInfoPoupChangesMade } from "./ListCreateReducer"
import { useNavigate } from "react-router"
import Popup from "../Popup/Popup"
import ActivityInfoPopUp from "./ListActivityInfoPopUp"
import AddActivity from "./ListAddActivity"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import EditActivityPopup from "../../Workout/CreateWorkout/EditActivityPopup"
import SavedActivityList from "../../SavedList/SavedListInfo/SavedListComponent"

/**
 * Component for input-form to be used to create a new workout (WorkoutCreate.js)
 *
 * This component requires the ListCreateContext to be used.
 *
 * Props:
 *     callback @id {function}  - Function to call when form is filled and to be sent.
 *
 * Example usage:
 *		<ListFormComponent callback={submitHandler} />
 *
 * @author Team Minotaur, Team 3 Durian
 * @version 2.1
 * @since 2023-05-24, 2024-04-18
 * @updated 2023-06-01 Chimera, updated pathing when pressing return to create session
 */
export default function ListFormComponent({ callback, state, listCreateInfoDispatchProp = null }) {
	const { listCreateInfo, listCreateInfoDispatch } = useContext(ListCreateContext)
	const [leaveActivityPickerPopup, setLeaveActivityPickerPopup] = useState(false)
	const [validated, setValidated] = useState(false)
	const [acceptActivities, setAcceptActivities] = useState(false)
	const navigate = useNavigate()
	const [showPopup, setShowPopup] = useState(false)

	/**
	 * Sets the title of the page.
	 */
	const getPopupTitle = useCallback(() => {
		if (listCreateInfo.popupState.types.activityPopup) {
			return "Aktiviteter"
		} else if (listCreateInfo.popupState.types.chooseActivityPopup) {
			return null
		} else if (listCreateInfo.popupState.types.editActivityPopup) {
			return "Redigera aktivitet"
		} else {
			return ""
		}
	}, [listCreateInfo.popupState.types])

	/**
	 * Handles the submission of a workout. This function is called when the
	 * save button is pressed.
	 *
	 * @param {*} event
	 */
	function handleSubmit(event) {
		console.log("Sparaknappen har tryckts")
		const form = event.currentTarget
		event.preventDefault()

		if (form.checkValidity() === false) {
			event.stopPropagation()
		} else if (listCreateInfo.data.activities.length == 0 && !acceptActivities) {
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
		setShowPopup(true)
	}

	function confirmGoBack() {
		localStorage.removeItem("listCreateInfo") // Clear local storage as confirmed

		if (state?.fromSession && !state?.fromCreate) {
			navigate(`/session/edit/${state.session.sessionId}`, { replace: true, state })
		} else if (state?.fromCreate) {
			return navigate("/session/create", { replace: true, state })
		}
		navigate(-1)
	}

	function handlePopupClose() {
		let shouldClose = false

		if (listCreateInfo.popupState.types.activityPopup) {
			shouldClose = listCreateInfo.addedActivities.length === 0
		} else if (listCreateInfo.popupState.types.editActivityPopup) {
			shouldClose = false
			shouldClose = !checkIfActivityInfoPoupChangesMade(listCreateInfo)
		}

		if (shouldClose) {
			listCreateInfoDispatch({
				type: LIST_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES,
			})
			listCreateInfoDispatch({
				type: LIST_CREATE_TYPES.CLOSE_POPUP,
			})
		} else {
			setLeaveActivityPickerPopup(true)
			sessionStorage.clear()
			localStorage.clear()
		}
	}
	return (
		<>
			<Form noValidate validated={validated} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<Form.Group controlId="validationCustom0" className="mb-1">
						<Form.Control
							type="text"
							placeholder="Namn"
							errorMessage={
								validated && listCreateInfo.data.name.length == 0 ? "Fyll i namn på passet" : ""
							}
							as={InputTextField}
							text={listCreateInfo.data.name}
							value={listCreateInfo.data.name}
							required
							onChange={(e) =>
								listCreateInfoDispatch({
									type: LIST_CREATE_TYPES.SET_NAME,
									name: e.target.value,
								})
							}
						/>
					</Form.Group>
					<Form.Group className="mb-1" controlId="validationCustom03">
						<Form.Control
							value={listCreateInfo.data.desc}
							text={listCreateInfo.data.desc}
							as={TextArea}
							errorDisabled={true}
							rows={3}
							placeholder="Beskrivning av lista"
							onChange={(e) =>
								listCreateInfoDispatch({
									type: LIST_CREATE_TYPES.SET_DESCRIPTION,
									desc: e.target.value,
								})
							}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						{/*<ActivityListComponent /> {/* Tror denna kraschar grejor :=) */}
						<ConfirmPopup
							id="NoActivitiesConfirm"
							showPopup={validated && listCreateInfo.data.activities.length == 0 && acceptActivities}
							setShowPopup={setAcceptActivities}
							popupText="Är du säker på att du vill skapa en lista utan aktiviteter?"
							confirmText="Ja"
							backText="Avbryt"
							onClick={callback}
						/>
						<SavedActivityList
							activities={listCreateInfo.data.activities}
							listCreateInfoDispatchProp={listCreateInfoDispatchProp}
						/>
						<div className={styles.activityButtons}>
							<div className={"align-center" + styles.container}>
								<Button
									width={"100%"}
									onClick={() =>
										listCreateInfoDispatch({
											type: LIST_CREATE_TYPES.OPEN_CHOOSE_ACTIVITY_POPUP,
										})
									}
								>
									<h2>Lägg till aktiviteter</h2>
								</Button>
							</div>
						</div>
					</Form.Group>

					<Form.Group className="mb-3">
						<CheckBox
							id="list-create-checkbox"
							label="Privat pass"
							onClick={() =>
								listCreateInfoDispatch({
									type: LIST_CREATE_TYPES.SET_IS_PRIVATE,
									hidden: !listCreateInfo.data.hidden,
								})
							}
							checked={listCreateInfo.data.hidden}
						/>
					</Form.Group>

					<Form.Group>
						<AddUserComponent
							id="list-create-add-users"
							addedUsers={listCreateInfo.data.users}
							setAddedUsers={(users) =>
								listCreateInfoDispatch({
									type: LIST_CREATE_TYPES.SET_USERS,
									users,
								})
							}
						/>
					</Form.Group>

					<Form.Group className={styles.buttonContainer}>
						<Button
							onClick={() => {
								handleGoBack()
							}}
							outlined={true}
							id="list-create-back-button"
						>
							<h2>Tillbaka</h2>
						</Button>
						<ConfirmPopup
							id="confirm-pop-up-go-back"
							showPopup={showPopup}
							setShowPopup={setShowPopup}
							onClick={confirmGoBack}
							popupText="Är du säker på att du vill gå tillbaka?"
							confirmText="Ja"
							backText="Avbryt"
							zIndex={1000}
						/>
						<Button type="submit" id="list-create-back-button">
							<h2>Spara</h2>
						</Button>
					</Form.Group>
				</div>
			</Form>
			{/* Popups */}
			<Popup
				id="list-create-popup"
				isOpen={listCreateInfo.popupState.isOpened}
				setIsOpen={handlePopupClose}
				title={getPopupTitle()}
			>
				{listCreateInfo.popupState.types.activityPopup && <ActivityInfoPopUp />}
				{listCreateInfo.popupState.types.chooseActivityPopup && (
					<AddActivity
						id="add-activity-popup"
						setShowActivityInfo={(activities) => {
							listCreateInfoDispatch({
								type: LIST_CREATE_TYPES.SET_ACTIVITIES_WITH_PARSING,
								payload: { result: activities },
							})
							listCreateInfoDispatch({
								type: LIST_CREATE_TYPES.OPEN_ACTIVITY_POPUP,
							})
						}}
					/>
				)}
				{listCreateInfo.popupState.types.editActivityPopup && <EditActivityPopup />}
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
					listCreateInfoDispatch({
						type: LIST_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES,
					})
					listCreateInfoDispatch({
						type: LIST_CREATE_TYPES.CLOSE_POPUP,
					})
				}}
			/>
		</>
	)
}
