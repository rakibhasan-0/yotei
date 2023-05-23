import React, {useContext, useState} from "react"
import "./ExerciseCreate.css"
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

/**
 * The page for creating new exercises.
 *
 * @author Calskrove (2022-05-19), Hawaii (no date), Verona (2022-05-04), Team Phoenix (Group 1) (2023-05-04)
 */

export default function ExerciseCreate({setShowPopup, onClose}) {
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [time, setTime] = useState(0)
	const [insertFailed, setInsertFailed] = useState(false)
	const [addBoxChecked, setAddBoxChecked] = useState(false)
	const [eraseBoxChecked, setEraseBoxChecked] = useState(false)
	const context = useContext(AccountContext)
	const [addedTags, setAddedTags] = useState([])
	const [clearAlternative, setClearAlternative] = useState(false)
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

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
			toast.error("övningen kunde ej läggas till")
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
			console.log("id was null" + insertFailed)
			//setTagFailed(false)
			return false
		}
		if (addedTags.length === 0) {
			//setTagFailed(false)
			return true
		}
		if (addedTags === undefined) {
			//setTagFailed(false)
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
			addExercise().then((exId)  => addTag(exId)).then((linkedTags) => exitProdc(linkedTags))
		}
		//setInsertFailed(false)
	}


	/**
	 * Checks if insert worked, if so redirect back to exercise.
	 * @param linkedTags - result from linking tags
	 */
	function exitProdc(linkedTags) {
		console.log(insertFailed)
		setInsertFailed(!linkedTags)
		if (linkedTags) {
			toast.success("Övningen " + name + " lades till")
			if (addBoxChecked === false) {
				setShowPopup(false)
			} else {
				if (eraseBoxChecked === true) {
					console.log("inne i erase")
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
			setErrorMessage("En övning kräver ett godtyckligt namn")
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
		setClearAlternative(!clearAlternative)
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
				{/*Form to get input from user*/}
				<div className={"text-input-field"}>
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
						className="stand-area"
						placeholder="Beskrivning"
						text={desc}
						onChange={(e) => setDesc(e.target.value)}
						required = {true}
						id="ExerciseDescriptionInput"
						type="text"
					/>
				</div>
				<Divider id={"time-selector-title"} option={"h1_left"} title={"Tid"} />
				<div className="time-selector" >
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
				<div className={"checkboxes-container"}>
					<div className={"add-checkbox"}>
						<CheckBox id="EC-AddMultipleChk" disabled={false} checked={addBoxChecked} onClick={addCheckboxClicked} label={"Lägg till fler övningar"}/>
					</div>
					<div style={{height: "1rem"}}/>
					<div className={"add-checkbox"}>
						<CheckBox id="EC-ClearMultipleChk" disabled={!addBoxChecked} checked={eraseBoxChecked} onClick={setEraseBoxChecked} label={"Rensa text"}/>
					</div>
				</div>
				<div className="create-exercise-btn-container">
					<Button
						id="EC-BackBtn"
						outlined={"button-back"}
						onClick={() => { leaveWindow()}}>
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
						height={35}
					>
						<p>Är du säker att du vill lämna?</p>
						<div className="EC-mini-popup-btns">
							<Button id={"EC-mini-popup-leave-btn"} onClick={() => {closeAll()}} outlined={"button-back"}><p>Lämna</p></Button>
							<Button id={"EC-mini-popup-stay-btn"} onClick={() => {setShowMiniPopup(false)}}><p>Stanna</p></Button>
						</div>
					</Popup>
				</div>
			</div>
		</div>
	)
}