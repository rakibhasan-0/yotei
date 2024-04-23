import React, { useContext, useEffect, useState } from "react"
import styles from "./ExerciseCreate.module.css"
import { AccountContext } from "../../context"
import Button from "../../components/Common/Button/Button"
import "../../components/Common/InputTextField/InputTextField"
import "../../components/Common/TextArea/TextArea"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import "../../components/Common/MinutePicker/MinutePicker.jsx"
import MinutePicker from "../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../components/Common/Divider/Divider.jsx"
import TagInput from "../../components/Common/Tag/TagInput.jsx"
import { toast } from "react-toastify"
import EditGallery from "../../components/Gallery/EditGallery"
import { useNavigate } from "react-router"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import { unstable_useBlocker as useBlocker } from "react-router"

/**
 * The page for creating new exercises.
 * 
 * Changes version 2.0:
 *     Removed extraneuos css.
 *     Removed uneccesary containers.
 *     Adapted to work as a standalone page.
 *
 * @author
 *     Calskrove (2022-05-19)
 *     Hawaii (no date)
 *     Verona (2022-05-04)
 *     Phoenix (Group 1) (2023-05-04)
 *     Medusa (Group 6) (2023-06-01)
 *     Team Mango (Group 4) (2024-04-22)
 * 	   Team Durian (Group 3) (2024-04-23)
 * 
 * @since 2024-04-22
 * @version 3.0
 */
export default function ExerciseCreate() {
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [time, setTime] = useState(0)
	const [addBoxChecked, setAddBoxChecked] = useState(false)
	const [eraseBoxChecked, setEraseBoxChecked] = useState(false)
	const context = useContext(AccountContext)
	const [addedTags, setAddedTags] = useState([])
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [tempId, setTempId] = useState(-1)
	const [sendData, setSendData] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)
	const [tags, setTags] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)

	const navigate = useNavigate()

	function done() {
		if (undoMediaChanges) {
			navigate(-1)
		}
		else {
			setSendData(false)
			exitProdc(tags)
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
		setIsBlocking(name != "" || desc != "")
	}, [name, desc])

	/**
	 * Method for API call when creating an exercise.
	 * Also check with the database s if the exercise can be added.
	 *
	 * @returns the id of the exercise that has been created
	 */
	async function addExercise() {
		let data = null

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({ name: name, description: desc, duration: time })
		}
		try {
			const response = await fetch("/api/exercises/add", requestOptions)
			if (response.ok) {
				data = await response.json()
				setErrorMessage("")
				return data.id
			} else {
				if (response.status === 409) {
					setErrorMessage("En övning med detta namn existerar redan")
				}
				if (response.status === 400) {
					setErrorMessage(" ")
				}
			}
		} catch (error) {
			toast.error("Övningen kunde ej läggas till")
		}
		return null
	}


	/**
	 * Validates the list of tags and loops through it and tries to link it to the exercise.
	 *
	 * @param exId - exercise id
	 * @returns a boolean if the tags were successfully linked to the exercise
	 */
	async function addTag(exId) {
		let hasLinked = true
		if (exId === null) {
			return false
		}
		if (addedTags.length === 0 || addedTags === undefined) {
			return true
		}
		for (let i = 0; i < addedTags.length; i++) {
			let successResponse = await linkExerciseTag(exId, addedTags.at(i).id)
			if (!successResponse) {
				hasLinked = false
			}
		}
		return hasLinked
	}


	/**
	 * Method for API call when linking a tag to an exercise.
	 *
	 * @param exId - id of exercise
	 * @param tagId - id of tag
	 */
	async function linkExerciseTag(exId, tagId) {
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({ "exerciseId": exId })
		}

		try {
			const response = await fetch("/api/tags/exercises?tag=" + tagId, requestOptions)
			if (response.ok) {
				return true
			} else {
				return false
			}
		} catch (error) {
			toast.error("Taggar kunde ej kopplas till övningen")
			return false
		}
	}

	/**
	 * Calls the API calls in the correct order by
	 * first creating the exercise, then linking the exercise with the chosen tags.
	 */

	function addExerciseAndTags() {
		if (checkInput() === true) {
			setIsBlocking(false)
			addExercise()
				.then((exId) => handleExId(exId))
				.then((exId) => handleSendData(exId))
				.then((exId) => addTag(exId))
				.then((linkedTags) => setTags(linkedTags))
		}
	}

	function handleExId(exId) {
		setTempId(exId)
		return exId
	}

	function handleSendData(exId) {
		setSendData(true)
		return exId
	}

	/**
	 * Checks if insert worked, if so redirect back to exercise.
	 * @param linkedTags - result from linking tags
	 */
	function exitProdc(linkedTags) {
		if (linkedTags) {
			toast.success("Övningen " + name + " lades till")
			if (addBoxChecked === false) {
				navigate(-1)
			} else {
				if (eraseBoxChecked === true) {
					setName("")
					setTime(0)
					setDesc("")
					setAddedTags([])
				}
			}
		}
	}

	/**
	 * A function that will validate the users input on name.
	 * @returns Boolean if the name is ok or not
	 */
	function checkInput() {
		if (name !== "" && name !== undefined) {
			setErrorMessage("")
			return true
		} else {
			setErrorMessage("Övningen måste ha ett namn")
		}
		return false
	}

	function timeCallback(id, time) {
		setTime(time)
	}

	/**
	 * Handles logic when add more exercises checkbox is clicked. 
	 * @param checked - a boolean to set if the add checkbox is clicked or not
	 */
	function addCheckboxClicked(checked) {
		setAddBoxChecked(checked)
		setEraseBoxChecked(false)
	}

	return (
		<>
		<title>Skapa övning</title>
			<h1>Skapa övning</h1>

			<div style={{ height: "1rem" }} />

			<InputTextField
				placeholder="Namn"
				text={name}
				onChange={(e) => setName(e.target.value)}
				required={true}
				type="text"
				id="ExerciseNameInput"
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder="Beskrivning"
				text={desc}
				onChange={(e) => setDesc(e.target.value)}
				required={true}
				type="text"
				id = "exercise-description-input"
				errorDisabled={true}
			/>

			<Divider option={"h1_left"} title={"Tid"} />

			<div className={styles.timeSelector} >
				<MinutePicker
					initialValue={time}
					callback={timeCallback}
				/>
			</div>

			<Divider option={"h1_left"} title={"Taggar"} />

			<TagInput
				addedTags={addedTags}
				setAddedTags={setAddedTags}
			/>

			<Divider option={"h1_left"} title={"Media"} />

			<EditGallery
				id={tempId}
				exerciseId={tempId}
				sendData={sendData}
				undoChanges={undoMediaChanges}
				done={done}
			/>

			<CheckBox
				label={"Fortsätt skapa övningar"}
				disabled={false}
				checked={addBoxChecked}
				onClick={addCheckboxClicked}
			/>

			<div style={{ height: "1rem" }} />

			<CheckBox
				label={"Rensa fält"}
				disabled={!addBoxChecked}
				checked={eraseBoxChecked}
				onClick={setEraseBoxChecked}
			/>

			<div style={{ height: "1rem" }} />

			<div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={() => {
						setUndoMediaChanges(true) 
						exitProdc()
					}}
				>
					<p>Tillbaka</p>
				</Button>
				<Button
					width="100%"
					onClick={() => {
						addExerciseAndTags()
						exitProdc(tags)
					}}
				>
					<p>Lägg till</p>
				</Button>
			</div>

			<ConfirmPopup
				popupText="Du har osparade ändringar. Är du säker att du lämna?"
				showPopup={showMiniPopup}
				setShowPopup={setShowMiniPopup}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={blocker.proceed}
			/>
		</>
	)
}
