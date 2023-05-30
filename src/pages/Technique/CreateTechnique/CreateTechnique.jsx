import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker"
import Button from "../../../components/Common/Button/Button"
import "./CreateTechnique.css"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../../context"
import TagInput from "../../../components/Common/Tag/TagInput"
import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../../utils"
import { toast } from "react-toastify"
import EditGallery from "../../../components/Gallery/EditGallery"
import Divider from "../../../components/Common/Divider/Divider"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"

const KIHON_TAG = { id: 1 }

/**
 * Create Technique is a popup page that allows the user to create
 * one or many techniques and post them to the database.
 * 
 * Props:
 *     id @type {string} - Should be set to a unique id to identify the component
 *     setIsOpen @type {useState} - Must be passed by parent to allow the popup to close itself
 *
 * Example usage:
 * 
 *		const [showPopup, setShowPopup] = useState(false)
 * 
 *		<Popup title="Skapa teknik" isOpen={showPopup} setIsOpen={setShowPopup}>
 * 			<CreateTechnique setIsOpen={setShowPopup}/>
 *		</Popup>
 *
 * Changes version 2:
 * 		Refactored some code. 
 *      Moved error handling to InputTextFields and toasts.
 *
 * @author Team Medusa
 * @version 2.0
 * @since 2023-05-10
 */
export default function CreateTechnique({ id, setIsOpen }) {

	const token = useContext(AccountContext)

	const [techniqueName, setTechniqueName] = useState("")
	const [techniqueNameErr, setTechniqueNameErr] = useState("")

	const [techniqueDescription, setTechniqueDescription] = useState("")
	const [kihonChecked, setKihonChecked] = useState(false)
	const [belts, setBelts] = useState([])
	const [addedTags, setAddedTags] = useState([])
	const [continueToCreate, setContinueToCreate] = useState(false)
	const [clearFields, setClearFields] = useState(false)
	const [createButton, setCreateButton] = useState(false)

	const [tempId, setTempId] = useState(-1)
	const [sendData, setSendData] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)

	const [showConfirmPopup, setShowConfirmPopup] = useState(false)

	// Updates the belts hook array 
	const onToggle = (checked, belt) => setBelts(() => {
		if (!checked) {
			return belts.filter(b => b.id !== belt.id)
		}
		else {
			return [...belts, belt]
		}
	})

	useEffect(() => {
		if (tempId >= 0) {
			setSendData(true)
		}
		console.log(tempId)
	}, [tempId])

	function done() {

		if (undoMediaChanges) {
			setIsOpen(false)
		}
		else {
			setSendData(false)

			if (continueToCreate && clearFields) {
				clearStates()
				return
			}
			if (continueToCreate) {
				setCreateButton(true)
				return
			}
			setIsOpen(false)
		}
	}
	async function handleSubmit() {
		const tagIds = buildTags(addedTags, kihonChecked)
		const beltIds = buildBelts(belts)

		postTechnique({ name: techniqueName, description: techniqueDescription, belts: beltIds, tags: tagIds }, token.token)
			.then(handleResponse)
			.then(await makeMediaAPICall)
			.catch(() => toast.error("Kunde inte spara tekniken. Kontrollera din internetuppkoppling."))

	}

	async function makeMediaAPICall(data) {
		setTempId(data.id)
	}

	async function handleResponse(response) {

		if (response.status == HTTP_STATUS_CODES.CONFLICT) {
			setTechniqueNameErr("En teknik med detta namn finns redan")
			scrollToElementWithId("create-technique-input-name")
			return
		}

		if (response.status == HTTP_STATUS_CODES.NOT_ACCEPTABLE) {
			setTechniqueNameErr("En teknik måste ha ett namn")
			scrollToElementWithId("create-technique-input-name")
			return
		}

		if (response.status == HTTP_STATUS_CODES.UNAUTHORIZED) {
			toast.error("Du är inte längre inloggad och kan därför inte skapa tekniken")
			return
		}

		if (response.status == HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
			toast.error("Det har uppstått ett problem med servern, kunde inte skapa tekniken")
			return
		}

		if (response.status != HTTP_STATUS_CODES.SUCCESS && response.status != HTTP_STATUS_CODES.OK) {
			toast.error("Det har uppstått ett oväntat problem")
			return
		}

		toast.success("Tekniken " + techniqueName + " skapades")

		return response.json()
	}

	function clearStates() {
		setTechniqueName("")
		setTechniqueDescription("")
		setKihonChecked(false)
		setAddedTags([])
		setBelts([])
	}

	function handleLeave() {
		// Check if any unsaved changes have been made
		if (techniqueName != "" || techniqueDescription != "" || addedTags.length > 0 || belts.length > 0) {
			setShowConfirmPopup(true)
		}
		else {
			setIsOpen(false)
		}
	}

	// Disables the createButton until the techniqueName has changed.
	useEffect(() => {
		if (createButton) {
			setCreateButton(false)
		}
	}, [techniqueName, createButton])

	return (
		<div id={id} style={{ textAlign: "left" }}>
			<InputTextField
				id="create-technique-input-name"
				text={techniqueName}
				placeholder="Namn"
				errorMessage={techniqueNameErr}
				onChange={e => {
					setTechniqueName(e.target.value)
					setTechniqueNameErr(null)
				}}
			/>

			<TextArea
				id="create-technique-input-description"
				text={techniqueDescription}
				onChange={e => setTechniqueDescription(e.target.value)}
				placeholder="Beskrivning av teknik"
			/>

			<CheckBox
				id="create-technique-checkbox-kihon"
				checked={kihonChecked}
				onClick={setKihonChecked}
				label="Kihon"
			/>
			<div style={{ height: "1rem" }} />

			<BeltPicker
				id="create-technique-beltpicker"
				onToggle={onToggle}
				states={belts}
			/>
			<div style={{ height: "1rem" }} />

			<Divider title="Taggar" option="h1_left" />

			<TagInput
				id="create-technique-taginput"
				addedTags={addedTags}
				setAddedTags={setAddedTags}
				isNested={true}
			/>
			<div style={{ height: "1rem" }} />

			<h1 className="create-media-title">Media</h1>
			<div className="create-technique-horizontal-line" />

			<EditGallery id={tempId} exerciseId={tempId} sendData={sendData} undoChanges={undoMediaChanges} done={done} />

			<h1 className="create-media-title">Media</h1>
			<div className="create-technique-horizontal-line"/>

			<EditGallery id={tempId} exerciseId={tempId} sendData={sendData} undoChanges={undoMediaChanges} done={done}/>
	
			<CheckBox
				id="create-technique-checkbox-continue"
				checked={continueToCreate}
				onClick={setContinueToCreate}
				label="Fortsätt skapa tekniker"
			/>
			<div style={{ height: "1rem" }} />

			<CheckBox
				id="create-technique-checkbox-clear"
				checked={clearFields}
				onClick={setClearFields}
				label="Rensa fält"
				disabled={!continueToCreate}
			/>
			<div style={{ height: "1rem" }} />

			{/* Container for back and create technique buttons */}
			<div style={{ display: "flex", gap: "27px", justifyContent: "space-evenly" }}>
				<Button
					id="create-technique-backbutton"
					onClick={handleLeave}
					outlined={true}
				>
					<p>Tillbaka</p>
				</Button>

				<Button
					id="create-technique-createbutton"
					onClick={handleSubmit}
					disabled={createButton}
				>
					<p>Lägg till</p>
				</Button>
			</div>

			<ConfirmPopup
				id="create-technique-confirm-popup"
				showPopup={showConfirmPopup}
				setShowPopup={setShowConfirmPopup}
				confirmText={"Ja"}
				backText={"Nej"}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
				onClick={() => setUndoMediaChanges(true)}
			/>
		</div>
	)
}

function buildTags(tags, kihonChecked) {

	if (kihonChecked && tags["id"] === KIHON_TAG.id) {
		tags.push(KIHON_TAG)
	}

	return tags.map(tag => {
		return { id: tag.id }
	})
}

function buildBelts(belts) {
	return belts.map(belt => {
		return { id: belt.id }
	})
}

async function postTechnique(technique, token) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json", "token": token },
		body: JSON.stringify(technique)
	}

	return fetch("/api/techniques", requestOptions)
		.then(response => { return response })
		.catch(error => { alert(error.message) })
}