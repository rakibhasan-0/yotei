import React, { useContext, useEffect, useState, useCallback } from "react"
import styles from "./ExerciseCreate.module.css"
import { AccountContext } from "../../../context"
import Button from "../../../components/Common/Button/Button"
import "../../../components/Common/InputTextField/InputTextField"
import "../../../components/Common/TextArea/TextArea"
import MinutePicker from "../../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../../components/Common/Divider/Divider.jsx"
import TagInput from "../../../components/Common/Tag/TagInput.jsx"
import { setError as setErrorToast } from "../../../utils"
import EditGallery from "../../../components/Gallery/EditGallery"
import { useNavigate, useParams } from "react-router"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"
import { isAdmin, isEditor } from "../../../utils"
import { unstable_useBlocker as useBlocker } from "react-router"
import Spinner from "../../../components/Common/Spinner/Spinner.jsx"


/**
 * The edit excercise page (Redigera övning).
 *
 * @author
 *     Calskrove              (2022-05-19)
 *     Verona                 (2022-05-16)
 *     Team Phoenix (Group 1) (2023-05-15)
 *     Team Medusa  (Group 6) (2023-06-01)
 * 	   Team Durian  (Group 3) (2024-04-23)
 * 	   Team Kiwi    (Group 2) (2024-05-02) removed some navigate(-1) 
 * @since 2023-05-22
 * @version 2.0
 */
export default function ExerciseEdit() {
	const context = useContext(AccountContext)
	const [oldName, setOldName] = useState("")
	const [oldDesc, setOldDesc] = useState("")
	const [oldTime, setOldTime] = useState(0)
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [time, setTime] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [editFailed, setEditFailed] = useState(false)
	const [tagLinkFailed, setTagLinkFailed] = useState(false)
	const [existingTags, setExistingTags] = useState([])
	const [newTags, setNewTags] = useState([])
	const [tagRemoveFailed, setTagRemovedFailed] = useState(false)
	const [sendData, setSendData] = useState(false)
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const navigate = useNavigate()
	const { excerciseId } = useParams()

	function done() {
		if (undoMediaChanges) {
			blocker.proceed
			//setShowMiniPopup(true)
			//navigate(-1)
		} else {
			setSendData(false)
			editExercise()
		}
	}

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setShowMiniPopup(true)
			return true
		}
		return false
	})

	useEffect(() => {
		setIsBlocking(name != oldName || desc != oldDesc)
	}, [name, desc, oldName, oldDesc])

	
	useEffect(() => {
		if (!isAdmin(context) || !isEditor(context)) {
			navigate(-1)
		}
	}, [context, navigate])
	
	/**
	 * Returns the information about the exercise and its tags with the id in the pathname.
	 */
	const getExerciseInfo = useCallback(async () => {
		setIsLoading(true)
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", token: context.token },
		}
		let exerciseJson
		let tagsJson
		try {
			const response = await fetch(`/api/exercises/${excerciseId}`, requestOptions)
			exerciseJson = await response.json()

			try {
				const response = await fetch(`/api/tags/get/tag/by-exercise?exerciseId=${excerciseId}`, requestOptions)
				tagsJson = await response.json()
				tagsJson = convertJsonString(tagsJson)
			} catch {
				setErrorToast("Det gick inte att hämta taggar")
				console.error(errorMessage)
			}
		} catch (error) {
			setErrorToast("Det gick inte att hämta övningsinfo")
		}

		if (0 === name.length || name === null || name === "null") {
			setName(exerciseJson.name)
			setDesc(exerciseJson.description)
			setTime(exerciseJson.duration)
		}
		setNewTags(tagsJson)
		setExistingTags(tagsJson)
		setOldName(exerciseJson.name)
		setOldDesc(exerciseJson.description)
		setOldTime(exerciseJson.duration)
		setIsLoading(false)
		/* Ska inte ligga här utan villkor */
	}, [])

	useEffect(() => {
		getExerciseInfo()
	}, [getExerciseInfo])

	/**
	 * Used to pass 2 parameters to setTime
	 * to avoid errors with different number props
	 */
	function timeCallback(id, time) {
		setTime(time)
	}

	/**
	 * check if any changes has been done when editing before closing
	 * exercise edit popup. Tags are sorted by id.
	 */
	// eslint-disable-next-line no-unused-vars
	function checkChanges() {
		const newT = JSON.stringify(newTags.sort((a, b) => a.id - b.id))
		const oldT = JSON.stringify(existingTags.sort((a, b) => a.id - b.id))

		if (oldName !== name || oldDesc !== desc || oldTime != time || newT !== oldT) {
			setShowMiniPopup(true)
		} else {
			navigate(-1)
		}
	}

	/**
	 * Create a new array with updated property names
	 *
	 * @param originalData json string with tagdata to be converted
	 * @returns newData - json object with correct format
	 */
	function convertJsonString(originalData) {
		const newData = originalData.map(({ tagId, tagName }) => ({
			id: tagId,
			name: tagName,
		}))

		return newData
	}

	/**
	 * Is called when an edit request (PUT) is sent to the API.
	 *
	 * @param {*} e The event that caused editExercise.
	 */
	async function editExercise() {
		const requestOptionsDuplicate = {
			method: "PUT",
			headers: { "Content-type": "application/json", token: context.token },
			body: JSON.stringify({
				id: excerciseId,
				name: name.trim(),
				description: desc,
				duration: time,
			}),
		}
		try {
			const response = await fetch("/api/exercises/update", requestOptionsDuplicate)

			if (response.status === 406 && name != oldName) {
				setErrorMessage("Detta namn är redan taget")
				return
			}
		} catch (error) {
			setErrorToast("Ett internt fel inträffade")
		}

		if (name.trim() === "") {
			setEditFailed(true)
			setErrorMessage("Övningen måste ha ett namn")
			return
		}

		await checkTags()
		// Removed the navigate(-1) as it navigated back twice because of this.
		// Maybe add a proper fail message instead if it's not working
		if (!(editFailed || tagRemoveFailed || tagLinkFailed)) {
			//navigate(-1)
		}
	}

	/**
	 * Method for checking which tags to be removed from the exercise and which to add as new
	 * tags connected to the exercise.
	 */
	async function checkTags() {
		for (var i = 0; i < newTags.length; i++) {
			//Link only if it's a tag that already didn't get linked
			if (!existingTags.includes(newTags[i])) {
				await linkExerciseTag(excerciseId, newTags.at(i).id, newTags.at(i).name)
			}
		}
		// Remove tags that are not present anymore
		for (i = 0; i < existingTags.length; i++) {
			if (!newTags.includes(existingTags[i])) {
				await removeTag(excerciseId, existingTags[i].id, existingTags[i].name)
			}
		}
	}

	/**
	 * Method for API-call when creating a tag.
	 * @returns the id of the exercise that has been created
	 */
	async function linkExerciseTag(exId, tag_id, tag_name) {
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", token: context.token },
			body: JSON.stringify({ exerciseId: exId }),
		}
		try {
			const response = await fetch("/api/tags/exercises?tag=" + tag_id, requestOptions)
			if (response.ok) {
				setTagLinkFailed(false)
			} else {
				setTagLinkFailed(true)
				setErrorMessage(tag_name)
			}
		} catch (error) {
			setErrorToast("Det gick inte att skapa en tagg")
			setTagLinkFailed(true)
			setErrorMessage(tag_name)
		}
	}

	/** Method to remove a tag from an exercise (does not remove the tag itself).
	 *
	 * @param {Exercise id} exId
	 * @param {tag id} tag_id
	 */
	async function removeTag(exId, tag_id, tag_name) {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-type": "application/json", token: context.token },
			body: JSON.stringify({ exerciseId: exId }),
		}
		try {
			const response = await fetch(`/api/tags/remove/exercise?tag=${tag_id}`, requestOptions)
			if (response.ok) {
				setTagRemovedFailed(false)
			} else {
				setTagRemovedFailed(true)
				setErrorMessage(tag_name)
				setErrorToast("Det gick inte att ta bort taggen")
			}
		} catch (error) {
			setErrorToast("Ett internt fel uppstod")
			setTagRemovedFailed(true)
			setErrorMessage(tag_name)
		}
	}

	return isLoading ? (
		<Spinner />
	) : (
		<>
			<title>Redigera övning</title>
			<h1>Redigera övning</h1>

			<InputTextField
				placeholder={"Namn"}
				text={name}
				onChange={(e) => setName(e.target.value)}
				required={true}
				type="text"
				id={"exerciseNameInput"}
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder={"Beskrivning"}
				text={desc}
				onChange={(e) => setDesc(e.target.value)}
				required={true}
				id={"exerciseDescriptionInput"}
				type="text"
				errorDisabled={true}
			/>

			<Divider option={"h2_left"} title={"Tid"} />

			<div className={styles.timeSelector}>
				<MinutePicker
					id={"minuteSelect"}
					initialValue={time}
					callback={timeCallback}
				/>
			</div>

			<Divider option={"h2_left"} title={"Taggar"} />

			<TagInput addedTags={newTags} setAddedTags={setNewTags} />

			<Divider option={"h2_left"} title={"Media"} />

			<EditGallery exerciseId={excerciseId} sendData={sendData} undoChanges={undoMediaChanges} done={done} />

			<div className={styles.buttonContainer}>
				<Button
					outlined
					onClick={() => {
						setUndoMediaChanges(true)
						navigate(-1)
					}}
					width="100%"
				>
					<p>Avbryt</p>
				</Button>

				<Button
					onClick={() => {
						setIsBlocking(false)
						setSendData(true)
						navigate(-1)
					}}
					width="100%"
				>
					<p>Spara</p>
				</Button>
			</div>

			<ConfirmPopup
				showPopup={showMiniPopup}
				setShowPopup={setShowMiniPopup}
				popupText="Du har osparade ändringar. Är du säker att du vill lämna?"
				confirmText="Lämna"
				backText="Avbryt"
				onClick={async () => {
					setUndoMediaChanges(true)
					blocker.proceed()
				}}
			/>
		</>
	)
}
