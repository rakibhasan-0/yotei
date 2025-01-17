import React, { useContext, useEffect, useState, useRef } from "react"
import styles from "./ExerciseCreate.module.css"
import { AccountContext } from "../../../context"
import Button from "../../../components/Common/Button/Button"
import "../../../components/Common/InputTextField/InputTextField"
import "../../../components/Common/TextArea/TextArea"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import "../../../components/Common/MinutePicker/MinutePicker.jsx"
import MinutePicker from "../../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../../components/Common/Divider/Divider.jsx"
import TagInput from "../../../components/Common/Tag/TagInput.jsx"
import { toast } from "react-toastify"
import EditGallery from "../../../components/Gallery/EditGallery"
import { useLocation, useNavigate } from "react-router"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"
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
 *     Coconut (Group 7) (2024-04-22)
 *     Team Mango (Group 4) (2024-04-22)
 *	   Team Durian (Group 3) (2024-05-07), Tomato (Group 6) (2024-04-24)
 *     Team Kiwi (Group 2) (2024-05-03)
 * 
 * @since 2024-04-22
 * @version 3.0
 */
export default function ExerciseCreate() {

	// true when data has been saved, when unmounting and rebuilding view.
	const [exerciseCreateInput, setExerciseCreateInput] = useState(() => {
		const retExerciseCreateInput = JSON.parse(localStorage.getItem("exerciseCreateLocalStorageKey"))
		if (retExerciseCreateInput) {
			return retExerciseCreateInput
		} else {
			return {
				name: "",
				desc: "",
				time: 0,
				addBoxChecked: false,
				eraseBoxChecked: false,
				addedTags: []
			}
		}
	})

	const clearExerciseCreateInput = (addBoxChecked, eraseBoxChecked) => {
		setExerciseCreateInput({
			name: "",
			desc: "",
			time: 0,
			addBoxChecked: addBoxChecked,
			eraseBoxChecked: eraseBoxChecked,
			addedTags: []
		})

		localStorage.removeItem("exerciseCreateLocalStorageKey")
	}

	const [name, setName] = useState(() => {
		return exerciseCreateInput.name
	})
	const [desc, setDesc] = useState(() => {
		return exerciseCreateInput.desc
	})
	const [time, setTime] = useState(() => {
		return exerciseCreateInput.time
	})

	const [addedTags, setAddedTags] = useState(() => {
		return exerciseCreateInput.addedTags
	})

	const context = useContext(AccountContext)
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [tempId, setTempId] = useState(-1)
	const [sendData, setSendData] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)


	const [isSubmitted, setIsSubmitted] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const hasPreviousState = location.key !== "default"

	const hasRendered = useRef({"tagEffect":false, "inputEffect":false})

	function done() {
		if (!undoMediaChanges) {
			setSendData(false)
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
		if (isSubmitted) {
			exitProdc()
		}
	}, [isSubmitted])

	useEffect(() => {
		if (hasRendered.current["tagEffect"]) {
			storeInputChange("addedTags", addedTags)

		}
		hasRendered.current["tagEffect"] = true
	}, [addedTags])


	/**
	 * Saves an exerciseCreateInput object in local storage
	 */
	useEffect(() => {
		if (hasRendered.current["inputEffect"]) {
			localStorage.setItem("exerciseCreateLocalStorageKey", JSON.stringify(exerciseCreateInput))
			setIsBlocking(true)
			//Remove block if no information in fields.
			if (name == "" && desc == "" && time == 0 && addedTags.length == 0) {
				setIsBlocking(false)
			}
		}

		hasRendered.current["inputEffect"] = true
	}, [exerciseCreateInput])


	/**
	 * Updates the exerciseCreateInput object when new input is added
	 * @param fieldName The exerciseCreateInput objects attribute to be changed
	 * @param value The new value
	 */
	const storeInputChange = (fieldName, value) => {
		setExerciseCreateInput(prevState => ({
			...prevState,
			[fieldName]: value
		}))
	}

	/**
	 * Method for API call when creating an exercise.
	 * Also check with the database s if the exercise can be added.
	 *
	 * @returns the id of the exercise that has been created
	 */
	async function addExercise() {
		let data = null

		const item = localStorage.getItem("exerciseCreateLocalStorageKey")
		if(item) console.log("ADD EXERCISE:", item)

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
				toast.success("Övningen " + name + " lades till")
				setIsSubmitted(true)
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
	 */
	function exitProdc() {
		
		if (exerciseCreateInput.addBoxChecked == false) {
			if (hasPreviousState) {
				navigate(-1)
			} else {
				navigate("/exercise")
			}
			clearExerciseCreateInput(exerciseCreateInput.addBoxChecked, exerciseCreateInput.eraseBoxChecked)
			
		} else {
			if (exerciseCreateInput.eraseBoxChecked == true) {
				setName("")
				setTime(0)
				setDesc("")
				setAddedTags([])
				clearExerciseCreateInput(exerciseCreateInput.addBoxChecked, exerciseCreateInput.eraseBoxChecked)
			}
		}
		hasRendered.current["inputEffect"] = false
		setIsSubmitted(false)
	}

	/**
	 * A function that will validate the users input on name.
	 * @returns Boolean if the name is ok or not
	 */
	function checkInput() {
		if (exerciseCreateInput.name !== "" && exerciseCreateInput.name !== undefined) {
			setErrorMessage("")
			return true
		} else {
			setErrorMessage("Övningen måste ha ett namn")
		}
		return false
	}

	/**
	 * Handles logic when exercise duration is changed.
	 * @param id - component id
	 * @param time - a number that denotes the exercise duration (time)
	 */
	function timeCallback(id, time) {
		setTime(time)
		storeInputChange("time", time)
	}

	/**
	 * Handles logic when add more exercises checkbox is clicked.
	 * @param checked - a boolean to set if the add checkbox is clicked or not
	 */
	function addCheckboxClicked(checked) {
		storeInputChange("addBoxChecked", checked)
		storeInputChange("eraseBoxChecked", false)
	}

	/**
	 * Handles logic when erase exercises checkbox is clicked.
	 * @param checked - a boolean to set if the erase checkbox is clicked or not
	 */
	function eraseBoxClicked(checked) {
		storeInputChange("eraseBoxChecked", checked)
	}

	const handleNavigation = () => {
		if (hasPreviousState) {
			navigate(-1)
		} else {
			navigate("/exercise")
		}
	}

	return (
		<>
			<title>Skapa övning</title>
			<h1>Skapa övning</h1>

			<div style={{ height: "1rem" }} />

			<InputTextField
				placeholder="Namn"
				text={exerciseCreateInput.name}
				onChange={(e) => {
					setName(e.target.value)
					storeInputChange("name", e.target.value)
				}}
				required={true}
				type="text"
				id="ExerciseNameInput"
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder="Beskrivning"
				text={exerciseCreateInput.desc}
				onChange={(e) => {
					setDesc(e.target.value)
					storeInputChange("desc", e.target.value)
				}}
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
				itemName={name}
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
				checked={exerciseCreateInput.addBoxChecked}
				onClick={addCheckboxClicked}
			/>

			<div style={{ height: "1rem" }} />

			<CheckBox
				label={"Rensa fält"}
				disabled={!exerciseCreateInput.addBoxChecked}
				checked={exerciseCreateInput.eraseBoxChecked}
				onClick={eraseBoxClicked}
			/>

			<div style={{ height: "1rem" }} />

			<div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={async () => {
						setUndoMediaChanges(true)
						handleNavigation()
					}}
				>
					<p>Tillbaka</p>
				</Button>
				<Button
					width="100%"
					onClick={() => {
						addExerciseAndTags()
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
