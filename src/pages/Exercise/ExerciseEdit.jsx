import React, { useContext, useEffect, useState } from "react"
import styles from "./ExerciseCreate.module.css"
import {AccountContext} from "../../context"
import Button from "../../components/Common/Button/Button"
import  "../../components/Common/InputTextField/InputTextField"
import  "../../components/Common/TextArea/TextArea"
import MinutePicker from "../../components/Common/MinutePicker/MinutePicker.jsx"
import InputTextField from "../../components/Common/InputTextField/InputTextField.jsx"
import TextArea from "../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../components/Common/Divider/Divider.jsx"
import TagInput from "../../components/Common/Tag/TagInput.jsx"
import {setError as setErrorToast} from "../../utils"
import EditGallery from "../../components/Gallery/EditGallery"
import Popup from "../../components/Common/Popup/Popup"

/**
 * Function for the page for editing an exercise.
 *
 * @author Calskrove (2022-05-19), Verona (2022-05-16) , Team Phoenix (Group 1) (2023-05-15)
 * @since 2023-05-22
 * @version 1.0
 * @returns A page for editing an exercise.
 */
export default function ExerciseEdit({setShowPopup, initialTime}) {
	const context = useContext(AccountContext)
	//const [pageUpdated, setPageUpdated] = useState(false)
	const [oldName, setOldName] = useState("")
	const [oldDesc, setOldDesc] = useState("")
	const [oldTime, setOldTime] = useState(0)
	const [name, setName] = useState("")
	const [desc, setDesc] = useState("")
	const [time, setTime] = useState(initialTime)
	const [errorMessage, setErrorMessage] = useState("")
	const [editFailed, setEditFailed] = useState(false)
	const [tagLinkFailed, setTagLinkFailed] = useState(false)
	const [existingTags, setExistingTags] = useState([])
	const [newTags, setNewTags] = useState([])
	const [tagRemoveFailed, setTagRemovedFailed] = useState(false)
	const [exId, setExId] = useState("")
	const [sendData, setSendData] = useState(false)
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)

	useEffect(() => {
		setExId(window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1))
	},[])

	useEffect(() => {
		if(exId !== ""){
			getExerciseInfo()
		}
	},[exId])

	useEffect(() => {
		loadSaved()
		
	}, [])
	
	
	useEffect(() => {
		window.localStorage.setItem("name", name)
		window.localStorage.setItem("desc", desc) 
		window.localStorage.setItem("time", time)

		//setPageUpdated(true)

	}, [name, desc, time])

	function loadSaved() {
		setName(window.localStorage.getItem("name"))
		setDesc(window.localStorage.getItem("desc"))
		setTime(window.localStorage.getItem("time"))
	}

	function done(){
		if(undoMediaChanges){
			checkChanges()
		}
		else{
			setSendData(false)
			editExercise()
		}
	}

	/**
     * Returns the information about the exercise and its tags with the id in the pathname.
     */
	async function getExerciseInfo() {		
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", token: context.token},
		}
		let exerciseJson
		let tagsJson
		try {
			const response = await fetch(`/api/exercises/${exId}`, requestOptions)
			exerciseJson = await response.json()
			
			try{
				const response = await fetch(`/api/tags/get/tag/by-exercise?exerciseId=${exId}`, requestOptions)
				tagsJson = await response.json()
				tagsJson = convertJsonString(tagsJson)
			} catch{
				setErrorToast("Det gick inte att hämta taggar")
				console.error(errorMessage)
			}

		} catch (error) {
			setErrorToast("Det gick inte att hämta övningsinfo")
			setShowPopup(false)
		}
		loadSaved()

		if (0 === name.length || name === null || name === "null"){
			setName(exerciseJson.name)
			setDesc(exerciseJson.description)
			setTime(exerciseJson.duration)
		}

		setNewTags(tagsJson)
		setExistingTags(tagsJson)
		setOldName(exerciseJson.name)
		setOldDesc(exerciseJson.description)
		setOldTime(exerciseJson.duration)
	
		/* Ska inte ligga här utan villkor */
		
			
		
	}

	/**
	 * Used to pass 2 parameters to setTime 
	 * to avoid errors with different number props
	 */
	function timeCallback(id, time){
		setTime(time)
	}

	/**
	 * check if any changes has been done when editing before closing
	 * exercise edit popup. Tags are sorted by id.
	 */
	function checkChanges() {

		const newT = JSON.stringify(newTags.sort((a, b) => a.id - b.id))
		const oldT = JSON.stringify(existingTags.sort((a, b) => a.id - b.id))

		if(oldName !== name || oldDesc !== desc || oldTime != time || newT !== oldT)  {
			setShowMiniPopup(true)
		} else {
			setShowPopup(false)
		}
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
		
		const requestOptionsDuplicate = {
			method: "PUT",
			headers: {"Content-type": "application/json", "token": context.token},
			body: JSON.stringify({
				id: exId,
				name: name.trim(),
				description: desc,
				duration: time,
			})
		}
		try {
			const response = await fetch("/api/exercises/update", requestOptionsDuplicate)
			
			if (response.status === 406 && name != oldName) {
				setErrorMessage("Detta namn är redan taget")
				return
			}
		}
		catch (error) {
			setErrorToast("Ett internt fel inträffade")
		}
		
		if (name.trim() === "") {
			setEditFailed(true)
			setErrorMessage("Övningen måste ha ett namn")
			return
		}
		
		await checkTags()
		if (!(editFailed || tagRemoveFailed || tagLinkFailed)) {
			//borde bytas till att stänga popupen
			// window.location.href = "/exercise"
			setShowPopup(false)
			location.reload(1) // forcing reload of the page.... 

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
				setErrorToast("Det gick inte att ta bort taggen")
			}
		} catch (error) {
			setErrorToast("Ett internt fel uppstod")
			setTagRemovedFailed(true)			
			setErrorMessage(tag_name)
		}
	}

	function deleteLocalStorage() {
		window.localStorage.setItem("name", "")
		window.localStorage.setItem("desc", "")
		window.localStorage.setItem("time", "")
	}

	return (
		<div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
			{/*Form to get input from user*/}
			<InputTextField
				placeholder={"Namn"}
				text={name}
				onChange={(e) => setName(e.target.value)}
				required = {true}
				type="text"
				id = {"exerciseNameInput"}
				errorMessage={errorMessage}
			/>
			<div>
				<TextArea
					className={styles.standArea}
					placeholder={"Beskrivning"}
					text={desc}
					onChange={(e) => setDesc(e.target.value)}
					required = {true}
					id={"exerciseDescriptionInput"}
					type="text"
					errorDisabled={true}
				/>
			</div>
			<Divider id={"timeSelectorTitle"} option={"h2_left"} title={"Tid"} />
			<div className={styles.timeSelector} >
				<MinutePicker
					id={"minuteSelect"}
					initialValue={initialTime !== undefined ? initialTime : window.localStorage.getItem("time")}
					callback={timeCallback}
				/>
			</div>
			<Divider id={"tag-title"} option={"h2_left"} title={"Taggar"} />
			<TagInput
				id={"tagHandler"}
				addedTags={newTags}
				setAddedTags={setNewTags}
				isNested={true}
			/>
			<Divider id={"media-title"} option={"h2_left"} title={"Media"} />
			<EditGallery id={exId} exerciseId={exId} sendData={sendData} undoChanges={undoMediaChanges} done={done}/>

			{/*Button for the form. Calls the function addExercise. Retrieve the users input*/}
			<div className={styles.createExerciseBtnContainer}>
				<Button
					id={"backBtn"}
					outlined={"button-back"}
					onClick={() => {
						setUndoMediaChanges(true)
						deleteLocalStorage()
					}}
					width={150}>
					<p>Avbryt</p>
				</Button>
				<Button
					id={"addBtn"}
					onClick={() => {
						setSendData(true)
						deleteLocalStorage()
					}}
					width={150}>
					<p>Spara</p>
				</Button>
			</div>
			<Popup
				id={"EC-changes-mini-popup"}
				title={"Ändringar gjorda"}
				isOpen={showMiniPopup}
				setIsOpen={setShowMiniPopup}
				style={{height: "300px", width: "90%"}}				>
				<p>Är du säker att du vill lämna?</p>
				<div className={styles.ECMiniPopupBtns}>
					<Button id={"EC-mini-popup-leave-btn"} onClick={() => {setShowMiniPopup(false); setShowPopup(false)}} outlined={"button-back"}><p>Lämna</p></Button>
					<Button id={"EC-mini-popup-stay-btn"} onClick={() => {setShowMiniPopup(false)}}><p>Stanna</p></Button>
				</div>
			</Popup>
		</div>
	)


}