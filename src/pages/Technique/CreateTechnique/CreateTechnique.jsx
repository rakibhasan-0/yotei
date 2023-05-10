import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker"
import Button from "../../../components/Common/Button/Button"
import "./CreateTechnique.css"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../../context"
import TagInput from "../../../components/Common/Tag/TagInput"
import { HTTP_STATUS_CODES } from "../../../utils"

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
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-10
 */
export default function CreateTechnique({ id, setIsOpen }) {

	const token = useContext(AccountContext)

	const [techniqueName, setTechniqueName] = useState("")
	const [techniqueDescription, setTechniqueDescription] = useState("")
	const [kihonChecked, setKihonChecked] = useState(false)
	const [belts, setBelts] = useState([])
	const [addedTags, setAddedTags] = useState([])
	const [continueToCreate, setContinueToCreate] = useState(false)
	const [clearFields, setClearFields] = useState(false)
	const [createButton, setCreateButton] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	// Updates the belts hook array 
	const onToggle = belt => setBelts(prev => {
		if (prev.includes(belt)) {
			return prev.filter(b => b !== belt)
		}
		return [...prev, belt]
	})
	
	async function handleClick() {
		const tagIds = buildTags(addedTags, kihonChecked)
		const beltIds = buildBelts(belts)
		const response = await postTechnique({ name: techniqueName, description: techniqueDescription, belts: beltIds, tags: tagIds }, token.token)
		handleResponse(response)
	}

	function handleResponse(response) {
		setErrorMessage("")
		setSuccessMessage("")
		if (response.status === HTTP_STATUS_CODES.CONFLICT) { setErrorMessage("Tekniken finns redan"); return }
		if (response.status === HTTP_STATUS_CODES.NOT_ACCEPTABLE) { setErrorMessage("Tekniken måste ha ett namn"); return }
		if (response.status === HTTP_STATUS_CODES.TEAPOT) { setErrorMessage("Du är inte längre inloggad och kan därför inte skapa tekniker"); return }

		if (continueToCreate && clearFields) { 
			setSuccessMessage(techniqueName + " skapades")
			clearStates() 
		}
		else if (continueToCreate) { 
			setSuccessMessage(techniqueName + " skapades")
			setCreateButton(true)
		}
		else { setIsOpen(false) }
	}

	function clearStates() {
		setTechniqueName("")
		setTechniqueDescription("")
		setKihonChecked(false)
		setAddedTags([])
		setBelts([])
	}

	// Disables the createButton until the techniqueName has changed.
	useEffect(() => {
		if (createButton) {
			setCreateButton(false)
		}
	}, [techniqueName])

	return (
		<div id={id} style={{ display: "flex", gap: "16px", flexDirection: "column" }}>

			<div>
				<InputTextField
					id={"create-technique-input-name"}
					text={techniqueName}
					onChange={(e) => setTechniqueName(e.target.value)}
					placeholder={"Namn"}>
				</InputTextField>
			</div>

			<div style={{ height: "130px", minHeight: "130px" }}>
				<TextArea
					id={"create-technique-input-description"}
					text={techniqueDescription}
					onChange={(e) => setTechniqueDescription(e.target.value)}
					placeholder={"Beskrivning av teknik"}>
				</TextArea>
			</div>

			<CheckBox
				id={"create-technique-checkbox-kihon"}
				checked={kihonChecked}
				onClick={setKihonChecked}
				label={"Kihon"} >
			</CheckBox>

			<BeltPicker
				id={"create-technique-beltpicker"}
				onToggle={onToggle}
				states={belts}>
			</BeltPicker>

			<div style={{ display: "flex", marginBottom: "-10px" }}>
				<h1 className="create-technique-title">Taggar</h1>
			</div>

			<div className="create-technique-horizontal-line" style={{marginBottom: "-12px"}} />

			<TagInput
				id={"create-technique-taginput"}
				addedTags={addedTags}
				setAddedTags={setAddedTags}
				isNested={true}>
			</TagInput>	

			<CheckBox
				id={"create-technique-checkbox-continue"}
				checked={continueToCreate}
				onClick={setContinueToCreate}
				label={"Fortsätt skapa tekniker"}>
			</CheckBox>

			<CheckBox
				id={"create-technique-checkbox-clear"}
				checked={clearFields}
				onClick={setClearFields}
				label={"Rensa fält"}
				disabled={!continueToCreate}>
			</CheckBox>

			<div>
				{successMessage && <p className="create-technique-success">{successMessage}</p> }
				{errorMessage && <p className="create-technique-error">{errorMessage}</p> }
			</div>

			{/* Containet for back and create technique buttons */}
			<div style={{ display: "flex", gap: "27px", justifyContent: "space-evenly" }}>
				<Button
					id={"create-technique-backbutton"}
					onClick={() => setIsOpen(false)}
					outlined={true}>
					<p>Tillbaka</p>
				</Button>

				<Button
					id={"create-technique-createbutton"}
					onClick={() => handleClick()}
					disabled={createButton}>
					<p>Lägg till</p>
				</Button>
			</div>
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