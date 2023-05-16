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
	const [tagFailed, setTagFailed] = useState(false)
	const [storedName, setStoredName] = useState("")
	const [addBoxChecked, setAddBoxChecked] = useState(false)
	const [eraseBoxChecked, setEraseBoxChecked] = useState(false)
	const [okName, setOkName] = useState(false)
	const context = useContext(AccountContext)
	const [addedTags, setAddedTags] = useState([])
	const [showAlterWindow , setShowAlertWindow] = useState(false)
	const [clearAlternative, setClearAlternative] = useState(false)

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
				setInsertFailed(false)
			} else {
				if (response.status === 409) {
					setInsertFailed(true)

				}
				if (response.status === 400) {
					setInsertFailed(true)
				}
			}
		} catch (error) {

			setInsertFailed(true)
		}
		setShowAlertWindow(true)
		return data.id
	}


	/**
	 * Validates the list of tags and loops through it and tries to link it to the exercise.
	 *
	 * @param id - exercise id
	 * @returns the id of the exercise that has been created
	 */
	async function addTag(id) {
		if(id === null){
			return false
		}
		if (addedTags.length === 0) {
			setTagFailed(false)
			return false
		}
		if (addedTags === undefined) {
			return false
		}

		for (let i = 0; i < addedTags.length; i++) {
			await linkExerciseTag(id, addedTags.at(i).id)
		}
		return tagFailed
	}


	/**
	 * Method for API call when linking a tag to an exercise.
	 *
	 * @param ex_id - id of exercise
	 * @param tag_id - id of tag
	 * @returns the id of the exercise that has been created
	 */
	async function linkExerciseTag(ex_id, tag_id) {
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({"exerciseId": ex_id})
		}

		try {
			const response = await fetch("/api/tags/add/exercise?tag=" + tag_id, requestOptions)
			if (response.ok) {
				setTagFailed(false)
			} else {
				setTagFailed(true)
			}
		} catch (error) {
			setTagFailed(true)
		}
	}


	/**
	 * Calls the API calls in the correct order by
	 * first creating the exercise, then linking the exercise with the chosen tags.
	 */

	function addExerciseAndTags () {

		if (checkInput() === true) {
			addExercise().then((id)  => addTag(id)).then((tag) => exitProdc(tag))
		}
		setInsertFailed(false)
		setOkName(false)
	}


	/**
	 * Checks if insert worked, if so redirect back to exercise.
	 * @param tagFailed - result from linking tags
	 */
	function exitProdc(tagFailed) {
		if (insertFailed === false && tagFailed === false) {
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
		setInsertFailed(false)
		setOkName(false)
	}

	/**
	 * A function that will validate the users input on name.
	 * @returns Boolean
	 */
	function checkInput() {
		setStoredName(name)
		if (okName === false) {
			if (name !== "" && name !== undefined) {
				setOkName(true)
				return true
			}
		}
		return okName
	}


	/**
	 * Creates alert window that displays if the exercise could be added to the database or not
	 * @returns void
	 */
	function alertWindow() {
		if (insertFailed && showAlterWindow) {
			return (<div className="alert alert-danger" role="alert" style={{overflow: "visible", overflowWrap: "anywhere" }}>
				<p>Övningen {storedName} kunde ej läggas till</p>
			</div>)
		}else{
			if (addBoxChecked && showAlterWindow) {
				return(<div className="alert alert-success" role="alert"  style={{overflow: "visible", overflowWrap: "anywhere"}}>
					<p>Övningen {storedName} lades till</p>
				</div>)
			}
		}
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
				<div
					className="time-selector" >
					<MinutePicker
						id={"minuteSelect"}
						time={time}
						updateTime={setTime}
					/>
				</div>
				<Divider id={"tag-title"} option={"h1_left"} title={"Taggar"} />
				<TagInput
					id="tagHandler"
					addedTags={addedTags}
					setAddedTags={setAddedTags}
				/>

				{/*Button for the form. Calls the function addExercise. Retrieve the users input*/}

				<div className={"checkboxes-container"}>
					<div className={"add-checkbox"}>
						<p className={"checkbox-text"}>Lägg till fler övningar</p>
						<CheckBox id="EC-AddMultipleChk" clickable={true} checked={addBoxChecked} onClick={() => {
							setClearAlternative(!clearAlternative)
							setAddBoxChecked(!addBoxChecked)
							setEraseBoxChecked(false)
						}}/>
					</div>
					<div className={"add-checkbox"}>
						<p className={addBoxChecked ? "checkbox-text" : "checkbox-inactive"}>Rensa text</p>
						<CheckBox clickable={addBoxChecked} checked={eraseBoxChecked} onClick={() => setEraseBoxChecked(!eraseBoxChecked)}/>
					</div>
				</div>
				{alertWindow()}
				<div className="create-exercise-btn-container">
					<Button
						id="EC-BackBtn"
						outlined={"button-back"}
						onClick={() => { 
							setShowPopup(false)
							onClose()
						}}>
						<p>Tillbaka</p>
					</Button>
					<Button
						id="EC-AddBtn"
						onClick={() => {
							addExerciseAndTags()
							if (!addBoxChecked) {
								onClose()
							}
						}}>
						<p>Lägg till</p>
					</Button>
				</div>
			</div>
		</div>
	)
}