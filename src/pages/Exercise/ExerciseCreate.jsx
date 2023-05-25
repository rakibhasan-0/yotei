import React, {useContext, useState} from "react"
import styles from "./ExerciseCreate.module.css"
import {AccountContext} from "../../context"
import Button from "../../components/Common/Button/Button"
import  "../../components/Common/InputTextField/InputTextField"
import  "../../components/Common/TextArea/TextArea"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import "../../components/Common/MinutePicker/MinutePicker.jsx"
import MinutePicker from "../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../components/Common/Divider/Divider.jsx"
import TagInput from "../../components/Common/Tag/TagInput.jsx"
import Popup from "../../components/Common/Popup/Popup"
import { toast } from "react-toastify"
import EditGallery from "../../components/Gallery/EditGallery"

/**
 * The page for creating new exercises.
 *
 * @author Calskrove (2022-05-19), Hawaii (no date), Verona (2022-05-04), Team Phoenix (Group 1) (2023-05-04)
 * @since 2023-05-22
 * @version 1.0
 */

export default function ExerciseCreate({setShowPopup, onClose}) {
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

	function done(){
		if(undoMediaChanges){
			leaveWindow()
		}
		else{
			setSendData(false)
			exitProdc(tags)
		}
	}

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
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({name: name, description: desc, duration: time})
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
	 * @param id - exercise id
	 * @returns a boolean if the tags were successfully linked to the exercise
	 */
	async function addTag(exId) {
		let hasLinked = true
		if(exId === null){
			return false
		}
		if (addedTags.length === 0 || addedTags === undefined) {
			return true
		}
		for (let i = 0; i < addedTags.length; i++) {
			let successResponse = await linkExerciseTag(exId, addedTags.at(i).id)
			if(!successResponse){
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
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({"exerciseId": exId})
		}

		try {
			const response = await fetch("/api/tags/add/exercise?tag=" + tagId, requestOptions)
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

	function addExerciseAndTags () {
		if (checkInput() === true) {
			addExercise()
				.then((exId) => handleExId(exId))
				.then((exId) => handleSendData(exId))
				.then((exId)  => addTag(exId))
				.then((linkedTags) => setTags(linkedTags))
		}
	}

	function handleExId(exId){
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
				setShowPopup(false)
			} else {
				if (eraseBoxChecked === true) {
					setName("")
					setTime(0)
					setDesc("")
					setAddedTags([])
				}
			}
		}
		onClose()
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

	function timeCallback(id, time){
		setTime(time)
	}


	/**
	 * A function that shows the user a popup where they can confirm if they want to stay and keep their 
	 * changes or actually leave the page and discard the changes.
	 */
	function leaveWindow() {
		if(name !== "" || desc !== "") {
			setShowMiniPopup(true)
		} else {
			closeAll()
		}
	}

	/**
	 * Handles logic when add more exercises checkbox is clicked. 
	 * @param checked - a boolean to set if the add checkbox is clicked or not
	 */
	function addCheckboxClicked(checked){
		setAddBoxChecked(checked)
		setEraseBoxChecked(false)
	}

	/**
	 * Closes the popup that this component is apart of
	 */
	function closeAll() {
		setShowPopup(false)
		onClose()
	}

	return (
		<div className="row justify-content-center">
			<div className="col-md-8">
				{/*"Form" to get input from user*/}
				<div className={styles.textInputField}>
					<InputTextField
						placeholder="Namn"
						text={name}
						onChange={(e) => setName(e.target.value)}
						required = {true}
						type="text"
						id = "ExerciseNameInput"
						errorMessage={errorMessage}
					/>
				</div>
				<div>
					<TextArea
						className={styles.standArea}
						placeholder="Beskrivning"
						text={desc}
						onChange={(e) => setDesc(e.target.value)}
						required = {true}
						id="ExerciseDescriptionInput"
						type="text"
						errorDisabled={true}
					/>
				</div>
				<Divider id={"time-selector-title"} option={"h1_left"} title={"Tid"} />
				<div className={styles.timeSelector} >
					<MinutePicker
						id={"minuteSelect"}
						initialValue={time}
						callback={timeCallback}
					/>
				</div>
				<Divider id={"tag-title"} option={"h1_left"} title={"Taggar"} />
				<TagInput
					id="tagHandler"
					addedTags={addedTags}
					setAddedTags={setAddedTags}
				/>

				<Divider id={"media-title"} option={"h1_left"} title={"Media"}/>
				<EditGallery id={tempId} exerciseId={tempId} sendData={sendData} undoChanges={undoMediaChanges} done={done}/>


				<div className={styles.checkboxesContainer}>
					<div className={styles.addCheckbox}>
						<p className={styles.checkboxText}>Lägg till fler övningar</p>
						<CheckBox id="EC-AddMultipleChk" disabled={false} checked={addBoxChecked} onClick={addCheckboxClicked}/>
					</div>
					<div className={styles.eraseTextCheckbox}>
						<p className={addBoxChecked ? styles.checkboxText : styles.checkboxInactive}>Rensa text</p>
						<CheckBox id="EC-ClearMultipleChk" disabled={!addBoxChecked} checked={eraseBoxChecked} onClick={setEraseBoxChecked}/>
					</div>
				</div>
				<div className={styles.createExerciseBtnContainer}>
					<Button
						id="EC-BackBtn"
						outlined={"button-back"}
						onClick={() => { setUndoMediaChanges(true)}}>
						<p>Tillbaka</p>
					</Button>
					<Button
						id="EC-AddBtn"
						onClick={() => { addExerciseAndTags()}}>
						<p>Lägg till</p>
					</Button>
				</div>
				<div>
					<Popup
						id={"EC-changes-mini-popup"}
						title={"Ändringar gjorda"}
						isOpen={showMiniPopup}
						setIsOpen={setShowMiniPopup}
						style={{height: "300px", width: "90%"}}					>
						<p>Är du säker att du vill lämna?</p>
						<div className={styles.ECMiniPopupBtns}>
							<Button id={"EC-mini-popup-leave-btn"} onClick={() => {closeAll()}} outlined={"button-back"}><p>Lämna</p></Button>
							<Button id={"EC-mini-popup-stay-btn"} onClick={() => {setShowMiniPopup(false)}}><p>Stanna</p></Button>
						</div>
					</Popup>
				</div>
			</div>
		</div>
	)
}