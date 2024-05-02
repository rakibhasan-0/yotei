import { useContext, useEffect, useState, useCallback } from "react"
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
import { unstable_useBlocker as useBlocker, useNavigate, useParams } from "react-router"
import { Spinner } from "react-bootstrap"

const KIHON_TAG = { id: 1, name: "Kihon Waza" }

/**
 * Edit Technique is the page that allows the user to edit 
 * a technique. 
 * 
 * Based on the CreateTechnique component.
 * 
 * Props:
 *     id @type {string} - Should be set to a unique id to identify the component
 *     technique @type {object} - The technique to edit
 *
 * Version 2.0:
 *	   Converted from pop up to a dedicated page.
 *
 * Version 2.1:
 * 	   Selected belts for a technique now appears selected in the BeltPicker
 * 
 * @author Team Medusa, Team Tomato, Team Durian (Group 3) (2024-04-23)
 * @version 2.1
 * @since 2023-05-16
 */
export default function TechniqueEdit({ id }) {
	const token = useContext(AccountContext)

	const { techniqueId } = useParams()
	const [technique, setTechnique] = useState()

	const [techniqueName, setTechniqueName] = useState()
	const [techniqueDescription, setTechniqueDescription] = useState()
	const [kihonChecked, setKihonChecked] = useState(false)

	const [belts, setBelts] = useState()
	const [beltsErr, setBeltsErr] = useState("")
	const [loading, setLoading] = useState(true)

	const [addedTags, setAddedTags] = useState()

	const [showMediaPopup, setShowMediaPopup] = useState(false)
	const [sendMediaData, setSendMediaData] = useState(false)
	const [undoMediaChanges, setUndoMediaChanges] = useState(false)

	const [inputErrorMessage, setInputErrorMessage] = useState("")
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)

	const navigate = useNavigate()

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setShowConfirmPopup(true)
			return true
		}
		return false
	})

	const updateTechnique = (tmpTech) => {
		setTechnique(tmpTech)
		setTechniqueName(tmpTech.name)
		setTechniqueDescription(tmpTech.description)
		setBelts(tmpTech.belts)
		setAddedTags(tmpTech.tags)
		tmpTech.tags.map((tag) => {
			if (tag.name.toLowerCase() === KIHON_TAG.name.toLowerCase() || tag.id === KIHON_TAG.id) {
				setKihonChecked(true)
			}
		})
	}

	const handleGet = useCallback(() => {
		setLoading(true)
		fetch(`/api/techniques/${techniqueId}`, { headers: { "Content-Type": "application/json", "token": token.token } })
			.then(async res => {
				if (res.status === HTTP_STATUS_CODES.OK) {
					const tmpTech = await res.json()
					updateTechnique(tmpTech)
					setLoading(false)
				}
			})
			.catch((err) => {
				setLoading(false)
				console.error(err)
			})
	}, [techniqueId, token])

	useEffect(() => handleGet(), [handleGet, techniqueId, token])

	// If there's any difference to the original technique object, set blocking to true
	useEffect(() => {
		if (technique === undefined) {
			return
		}

		setIsBlocking(
			techniqueName !== technique.name ||
			techniqueDescription !== technique.description ||
			addedTags.length !== technique.tags.length ||
			belts.length !== technique.belts.length
		)

	}, [techniqueName, techniqueDescription, belts, addedTags, kihonChecked])

	function done(){
		if(undoMediaChanges){
			blocker.proceed
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
		// Should also only be set on success, but async issues causes tests to fail, so need to set it here
		setIsBlocking(false)

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
					navigate(-1)
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
		if (addedTags === undefined) {
			return
		}

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

	if(loading) return <Spinner/>
	return (
		<div id={id} style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
			<title>Redigera teknik</title>

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

			{addedTags ? 
				<TagInput
					id={style.techniqueEditTaginput}
					addedTags={addedTags}
					setAddedTags={setAddedTagsAndUpdateKihon}
					isNested={true}>
				</TagInput>	
				:
				null
			}

			<Divider title="Media" option="h1_left"/>

			<div className={style.mediaButtonContainer}>
				<EditGallery id={techniqueId} exerciseId={techniqueId} sendData={sendMediaData} undoChanges={undoMediaChanges} done={done} />
			</div>

			<Popup title={"Lägg till media"} isOpen={showMediaPopup} setIsOpen={setShowMediaPopup} >
				<UploadMedia id={techniqueId} exerciseId={techniqueId}/>	
			</Popup>

			<div style={{ display: "flex", gap: "27px", justifyContent: "space-evenly" }}>
				<Button
					id={style.techniqueEditBackbutton}
					onClick={() => navigate(-1)}
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
				onClick={async () => {
					setUndoMediaChanges(true)
					blocker.proceed()
				}}
			/>

		</div>
	)
}

