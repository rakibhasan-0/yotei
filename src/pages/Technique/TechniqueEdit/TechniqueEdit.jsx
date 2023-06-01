import { useContext, useEffect, useState } from "react"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker"
import Button from "../../../components/Common/Button/Button"
import style from "./TechniqueEdit.module.css"
import { AccountContext } from "../../../context"
import TagInput from "../../../components/Common/Tag/TagInput"
import { HTTP_STATUS_CODES, scrollToElementWithId, setError, setSuccess } from "../../../utils"
import Popup from "../../../components/Common/Popup/Popup"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"
import UploadMedia from "../../../components/Upload/UploadMedia"
import EditGallery from "../../../components/Gallery/EditGallery"
import Divider from "../../../components/Common/Divider/Divider"
import { unstable_useBlocker as useBlocker } from "react-router"

const KIHON_TAG = { id: 1, name: "Kihon Waza" }

/**
 * Edit Technique is a popup page that allows the user to edit 
 * a technique. 
 * 
 * Based on the CreateTechnique component.
 * 
 * Props:
 *     id @type {string} - Should be set to a unique id to identify the component
 *     setIsOpen @type {useState} - Must be passed by parent to allow the popup to close itself
 *     technique @type {object} - The technique to edit
 *
 * Example usage:
 * 
 *		const [showPopup, setShowPopup] = useState(false)
 * 
 *		<Popup title="Redigera teknik" isOpen={showPopup} setIsOpen={setShowPopup}>
 * 			<TechniqueEdit setIsOpen={setShowPopup}/>
 *		</Popup>
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-16
 */
export default function EditTechnique({ id, setIsOpen, technique }) {
	const token = useContext(AccountContext)

	const [techniqueName, setTechniqueName] = useState(technique.name)
	const [techniqueDescription, setTechniqueDescription] = useState(technique.description)
	const [kihonChecked, setKihonChecked] = useState(false)

	const [belts, setBelts] = useState(technique.belts)
	const [beltsErr, setBeltsErr] = useState("")

	const [addedTags, setAddedTags] = useState(technique.tags)

	const [showMediaPopup, setShowMediaPopup] = useState(false)
	const [sendMediaData, setSendMediaData] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)

	const [inputErrorMessage, setInputErrorMessage] = useState("")
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)

	useBlocker(() => {
		if (unsavedChanges()) {
			handleLeave()
			return true
		}
		return false
	})

	useEffect(() => {
		technique.tags.map((tag) => {
			if (tag.name.toLowerCase() === KIHON_TAG.name.toLowerCase() || tag.id === KIHON_TAG.id) {
				setKihonChecked(true)
			}
		})
	}, [])

	// If there's any difference to the original technique object, return true
	const unsavedChanges = () => {
		return techniqueName != technique.name ||
			techniqueDescription != technique.description ||
			addedTags.length !== technique.tags ||
			belts.length !== technique.belts.length
	}

	const handleLeave = () => {
		if (unsavedChanges()) {
			setShowConfirmPopup(true)
		}
		else {
			setIsOpen(false)
		}
	}

	function done(){
		if(undoMediaChanges){
			setIsOpen(false)
		}
	}

	const handlePutTechnique = () => {
		
		if (techniqueName == "") {
			setInputErrorMessage("Tekniken måste ha ett namn")
			scrollToElementWithId("techniqueEditInputName")
			return
		}
		if (belts.length === 0) {
			setBeltsErr("En teknik måste minst ha en bältesgrad")
			scrollToElementWithId("techniqueEditBeltpicker")
			return
		}

		// Media should only be sent when the edit is successfull, but need a promise in editgallery for that.
		// Send is set here so the requests have time to finish before closing the popup
		setSendMediaData(true)

		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json", "token": token.token },
			body: JSON.stringify({
				id: technique.id,
				name: techniqueName,
				description: techniqueDescription,
				belts: belts.map(belt => { return { id: belt.id } }),
				tags: addedTags.map(tag => { return { id: tag.id } })
			})
		}


		fetch("/api/techniques", requestOptions)
			.then(res => {
				switch(res.status) {
				case HTTP_STATUS_CODES.SUCCESS:
					setSuccess("Tekniken uppdaterades!")
					setIsOpen(false)
					return
				case HTTP_STATUS_CODES.CONFLICT:
					setInputErrorMessage("Tekniknamnet finns redan")
					scrollToElementWithId("techniqueEditInputName")
					return
				case HTTP_STATUS_CODES.NOT_ACCEPTABLE:
					setInputErrorMessage("Tekniken måste ha ett namn")
					scrollToElementWithId("techniqueEditInputName")
					return
				case HTTP_STATUS_CODES.UNAUTHORIZED:
					setError("Du är inte längre inloggad och kan därför inte skapa tekniker")
					return
				case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
					setError("Internt fel, gick inte att updatera tekniken!")
					return
				default:
					setError("Okänt fel inträffade")
				}
			})
			.catch((error) => {
				console.error(error)
				setError("Gick inte att updatera tekniken!")
			})

	}

	// Beltpicker toggle handler
	const onToggle = (checked, belt) => setBelts(() => {
		if(!checked) {
			return belts.filter(b => b.id !== belt.id)
		}
		else {
			return [...belts, belt]
		}
	})

	// Keeps the kihon checkbox and added tags in sync
	const setKihonCheckedAndUpdateTag = () => {
		// Checks the kihon checkbox before it's updated to prevent async issues, old value is checked
		if (addedTags.find(t => t.name.toLowerCase() === KIHON_TAG.name.toLowerCase()) && kihonChecked) {
			const newTags = addedTags.filter((t) => {
				return t.name.toLowerCase() !== KIHON_TAG.name.toLowerCase()
			})
			setAddedTags(newTags)
		} else if (!addedTags.find(t => t.name.toLowerCase() === KIHON_TAG.name.toLowerCase()) && !kihonChecked) {
			setAddedTags([...addedTags, KIHON_TAG])
		}

		setKihonChecked(!kihonChecked)

	}

	const setAddedTagsAndUpdateKihon = (tags) => {
		setAddedTags(tags)
		if (tags.find(t => t.name.toLowerCase() === KIHON_TAG.name.toLowerCase())) {
			setKihonChecked(true)
		} else {
			setKihonChecked(false)
		}

	}

	return (
		<div id={id} style={{ display: "flex", gap: "16px", flexDirection: "column" }}>

			<InputTextField
				id="techniqueEditInputName"
				text={techniqueName}
				onChange={(e) => setTechniqueName(e.target.value)}
				placeholder={"Namn"}
				errorMessage={inputErrorMessage}
			>
			</InputTextField>

			<TextArea
				id={style.techniqueEditInputDescription}
				text={techniqueDescription}
				onChange={(e) => setTechniqueDescription(e.target.value)}
				placeholder={"Beskrivning av teknik"}>
			</TextArea>

			<CheckBox
				id={style.techniqueEditCheckboxKihon}
				checked={kihonChecked}
				onClick={setKihonCheckedAndUpdateTag}
				label={"Kihon"}>
			</CheckBox>

			<BeltPicker
				id="techniqueEditBeltpicker"
				onToggle={onToggle}
				states={belts}
				filterWhiteBelt={true}
				errorMessage={beltsErr}
			/>


			<Divider title="Taggar" option="h2_left"/>

			<TagInput
				id={style.techniqueEditTaginput}
				addedTags={addedTags}
				setAddedTags={setAddedTagsAndUpdateKihon}
				isNested={true}>
			</TagInput>	

			<Divider title="Media" option="h1_left"/>

			<div className={style.mediaButtonContainer}>
				<EditGallery id={technique.id} exerciseId={technique.id} sendData={sendMediaData} undoChanges={undoMediaChanges} done={done} />
			</div>

			<Popup title={"Lägg till media"} isOpen={showMediaPopup} setIsOpen={setShowMediaPopup} >
				<UploadMedia id={technique.id} exerciseId={technique.id}/>	
			</Popup>

			<div style={{ display: "flex", gap: "27px", justifyContent: "space-evenly" }}>
				<Button
					id={style.techniqueEditBackbutton}
					onClick={handleLeave}
					outlined={true}>
					<p>Avbryt</p>
				</Button>

				<Button
					id={style.techniqueEditCreatebutton}
					onClick={() => handlePutTechnique()}>
					<p>Spara</p>
				</Button>
			</div>

			<ConfirmPopup
				id="technique-edit-confirm-popup"
				showPopup={showConfirmPopup}
				setShowPopup={setShowConfirmPopup}
				confirmText={"Lämna"}
				backText={"Avbryt"}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
				onClick={() => setUndoMediaChanges(true)}
			/>

		</div>
	)
}

