import React, { useContext, useEffect, useState } from "react"
import "./ExerciseCreate.css"
import {AccountContext} from "../../context"
import Button from "../../components/Common/Button/Button"
import  "../../components/Common/InputTextField/InputTextField"
import  "../../components/Common/TextArea/TextArea"
import MinutePicker from "../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../components/Common/Divider/Divider.jsx"
import TagInput from "../../components/Common/Tag/TagInput.jsx"



/**
 * Class for editing an exercise.
 *
 * @author Calskrove (2022-05-19), Verona (2022-05-16) , Team Phoenix (Group 1) (2023-05-15)
 */
export default function ExerciseEdit({setShowPopup}) {
	const context = useContext(AccountContext)
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [time, setTime] = useState(0)
	const [errorMessage, setErrorMessage] = useState("")
	const [editFailed, setEditFailed] = useState(false)
	const [tagLinkFailed, setTagLinkFailed] = useState(false)
	const [existingTags, setExistingTags] = useState([])
	const [newTags, setNewTags] = useState([])
	const [tagRemoveFailed, setTagRemovedFailed] = useState(false)
	const [exId, setExId] = useState("")


	useEffect(() => {
		setExId(window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1))
		console.log("In useEffect 1")
	},[])

	useEffect(() => {
		if(exId !== "") {
			getExerciseInfo()
			console.log("In useEffect 2")
		}
	},[exId])

	/**
     * Returns the information about the exercise and its tags with the id in the pathname.
     */
	async function getExerciseInfo() {
		console.log("exercise id: "+exId)
		console.log("inside getInfo")
		
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", token: context.token},
		}
		let exerciseJson
		try {
			const response = await fetch(`/api/exercises/${exId}`, requestOptions)
			exerciseJson = await response.json()
		} catch (error) {
			alert("Could not find details about the exercise")
			console.log("error", error)
		}
		let tagsJson
		try{
			const response = await fetch(`/api/tags/get/tag/by-exercise?exerciseId=${exId}`, requestOptions)
			tagsJson = await response.json()
			tagsJson = convertJsonString(tagsJson)
		}catch{
			alert("Kunde inte hämta taggar")
			console.error(errorMessage)
		}
		setName(exerciseJson.name)
		setDesc(exerciseJson.description)
		setTime(exerciseJson.duration)
		setNewTags(tagsJson)
		setExistingTags(tagsJson)
		console.log("Skriver in name "+exerciseJson.name)
		console.log("Skriver in desc "+exerciseJson.description)
		console.log("Skriver in tid "+exerciseJson.duration)
		console.log("Tags "+tagsJson)	
	}


	/**
     * Create a new array with updated property names
     *
     * @param originalData json string with tagdata to be converted
	 * @returns newData - json object with correct format
     */
	function convertJsonString(originalData){
		const newData = originalData.map(({ tagId, tagName }) => ({
			id: tagId,
			name: tagName
		}))

		return newData
	}

	/**
     * Is called when an edit request (PUT) is sent to the API.
     *
     * @param {*} e The event that caused editExercise.
     */
	async function editExercise() {

		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", token: context.token},
			body: JSON.stringify({
				id: exId,
				name: name,
				description: desc,
				duration: time,
			})
		}

		const response = await fetch("/api/exercises/update", requestOptions)
		try {
			if (!response.ok) {
				console.log("response not OK")
				setEditFailed(true)
				setErrorMessage(name)
			}
		} catch (error) {
			console.log("error")
			setEditFailed(true)
			setErrorMessage(name)
		}
		
		await checkTags()
		if (!(editFailed || tagRemoveFailed || tagLinkFailed)) {
			//borde bytas till att stänga popupen
			window.location.href = "/exercise"
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
				await linkExerciseTag(exId, newTags.at(i).id, newTags.at(i).name)
			}
		} // Remove tags that are not present anymore
		for (i = 0; i < existingTags.length; i++) {
			if (!newTags.includes(existingTags[i])) {
				await removeTag(exId, existingTags[i].id, existingTags[i].name)
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
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({"exerciseId": exId})
		}
		try {
			const response = await fetch("/api/tags/add/exercise?tag=" + tag_id, requestOptions)
			if (response.ok) {
				setTagLinkFailed(false)
			} else {
				setTagLinkFailed(true)
				setErrorMessage(tag_name)
			}
		} catch (error) {
			alert("Error at tag link")
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
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({"exerciseId": exId})
		}
		try {
			const response = await fetch(`/api/tags/remove/exercise?tag=${tag_id}`, requestOptions)
			if (response.ok) {
				setTagRemovedFailed(false)
			} else {
				setTagRemovedFailed(true)			
				setErrorMessage(tag_name)
				alert("Failed to remove tag")
			}
		} catch (error) {
			alert("Error when removing tag")
			setTagRemovedFailed(true)			
			setErrorMessage(tag_name)
		}
	}

	return (
		<div className="row justify-content-center">
			<div className="col-md-8">
				{/*Form to get input from user*/}
				<div className={"text-input-field"}>
					<InputTextField
						placeholder={"Namn"}
						text={name}
						onChange={(e) => setName(e.target.value)}
						required = {true}
						type="text"
						id = {"exerciseNameInput"}
					/>
				</div>
				<div>
					<TextArea
						className="stand-area"
						placeholder={"Beskrivning"}
						text={desc}
						onChange={(e) => setDesc(e.target.value)}
						required = {true}
						id={"exerciseDescriptionInput"}
						type="text"
					/>
				</div>
				<Divider id={"timeSelectorTitle"} option={"h1_left"} title={"Tid"} />
				<div className="time-selector" >
					<MinutePicker
						id={"minuteSelect"}
						initialValue={time}
						updateTime={setTime}
					/>
				</div>
				<Divider id={"tag-title"} option={"h1_left"} title={"Taggar"} />
				<TagInput
					id={"tagHandler"}
					addedTags={newTags}
					setAddedTags={setNewTags}
					isNested={true}
				/>

				{/*Button for the form. Calls the function addExercise. Retrieve the users input*/}
				<div className="create-exercise-btn-container">
					<div id={"back"}>
						<Button
							id={"backBtn"}
							outlined={"button-back"}
							onClick={() => setShowPopup(false)}
							width={150}>
						Tillbaka
						</Button>
					</div>
					<div id={"add"}>
						<Button
							id={"addBtn"}
							onClick={() => {editExercise()}}
							width={150}>
						Spara
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}