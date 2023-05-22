import { useContext, useEffect, useState, useCallback } from "react"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker"
import Button from "../../../components/Common/Button/Button"
import style from "./TechniqueEdit.module.css"
import { AccountContext } from "../../../context"
import TagInput from "../../../components/Common/Tag/TagInput"
import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../../utils"
import { Trash } from "react-bootstrap-icons"
import Popup from "../../../components/Common/Popup/Popup"
import UploadMedia from "../../../components/Common/Upload/UploadMedia"
import { toast } from "react-toastify"
import Spinner from "../../../components/Common/Spinner/Spinner"

const KIHON_TAG = { id: 3, name: "Kihon Waza" }

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
	const [addedTags, setAddedTags] = useState(technique.tags)

	const [media, setMedia] = useState([])
	const [mediaMessage, setMediaMessage] = useState("Ingen media tillgänglig")
	const [showMediaPopup, setShowMediaPopup] = useState(false)

	const [inputErrorMessage, setInputErrorMessage] = useState("")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (showMediaPopup === true) {
			return
		}

		technique.tags.map((tag) => {
			if (tag.name === KIHON_TAG.name|| tag.id === KIHON_TAG.id) {
				setKihonChecked(true)
			}
		})

		handleGetMedia()
	}, [showMediaPopup])

	const handleGetMedia = useCallback(() => {
		const requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/json", "token": token.token },
		}

		fetch(`/api/media/${technique.id}`, requestOptions)
			.then(async res => {
				if (res.status === HTTP_STATUS_CODES.OK) {
					const media = await res.json()
					setMedia(media)
				} else if (res.status === HTTP_STATUS_CODES.NOT_FOUND) {
					setMediaMessage("Ingen media tillgänglig")
				} else {
					setMediaMessage("Fel vid hämtning av media")
				}
				setLoading(false)
			})
			.catch((error) => {
				console.log(error)
				toast.error("Fel vid hämtning av media")
				setMediaMessage("Fel vid hämtning av media")
				setLoading(false)
			})
	}, [technique, token])

	const handleDeleteMedia = (mo) => {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-type": "application/json", "token": token.token },
			body: JSON.stringify({
				id: mo.id,
				movementId: mo.movementId,
				url: mo.url,
				localStorage: mo.localStorage,
				image: mo.image,
				description: mo.description
			})
		}

		fetch(`/api/media/remove/${technique.id}`, requestOptions)
			.then(res => {
				if (res.status === HTTP_STATUS_CODES.OK) {
					setMedia(media.filter(o => mo.id !== o.id))
				} else {
					toast.error("Failed to delete media!")
				}
			})
			.catch((error) => {
				toast.error("Failed to delete media!")
				console.log(error)
			})
	}

	const handlePutTechnique = (technique) => {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json", "token": token.token },
			body: JSON.stringify(technique)
		}

		fetch("/api/techniques", requestOptions)
			.then(res => {
				switch(res.status) {
				case HTTP_STATUS_CODES.CONFLICT:
					setInputErrorMessage("Tekniknamnet finns redan")
					scrollToElementWithId("techniqueEditInputName")
					return
				case HTTP_STATUS_CODES.NOT_ACCEPTABLE:
					setInputErrorMessage("Tekniken måste ha ett namn")
					scrollToElementWithId("techniqueEditInputName")
					return
				case HTTP_STATUS_CODES.UNAUTHORIZED:
					toast.error("Du är inte längre inloggad och kan därför inte skapa tekniker")
					return
				case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
					toast.error("Gick inte att updatera tekniken!")
					console.log(res)
					return
				}

				setIsOpen(false)
			})
			.catch((error) => {
				console.log(error)
				toast.error("Gick inte att updatera tekniken!")
			})

	}

	const handleClick = () => {
		const tagIds = buildTags(addedTags, kihonChecked)
		const beltIds = buildBelts(belts)
		handlePutTechnique({ id: technique.id, name: techniqueName, description: techniqueDescription, belts: beltIds, tags: tagIds })
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

			<div>
				<InputTextField
					id="techniqueEditInputName"
					text={techniqueName}
					onChange={(e) => setTechniqueName(e.target.value)}
					placeholder={"Namn"}
					errorMessage={inputErrorMessage}
				>
				</InputTextField>
			</div>

			<div style={{ height: "130px", minHeight: "130px" }}>
				<TextArea
					id={style.techniqueEditInputDescription}
					text={techniqueDescription}
					onChange={(e) => setTechniqueDescription(e.target.value)}
					placeholder={"Beskrivning av teknik"}>
				</TextArea>
			</div>

			<CheckBox
				id={style.techniqueEditCheckboxKihon}
				checked={kihonChecked}
				onClick={setKihonCheckedAndUpdateTag}
				label={"Kihon"}>
			</CheckBox>

			<BeltPicker
				id={style.techniqueEditBeltpicker}
				onToggle={onToggle}
				states={belts}>
			</BeltPicker>

			<div style={{ display: "flex", marginBottom: "-10px" }}>
				<h1 className={style.techniqueEditTitle} >Taggar</h1>
			</div>

			<div className={style.techniqueEditHorizontalLine} style={{marginBottom: "-12px"}} />

			<TagInput
				id={style.techniqueEditTaginput}
				addedTags={addedTags}
				setAddedTags={setAddedTagsAndUpdateKihon}
				isNested={true}>
			</TagInput>	

			<div style={{ display: "flex", marginBottom: "-10px" }}>
				<h1 className={style.techniqueEditTitle}>Media</h1>
			</div>

			<div className={style.techniqueEditHorizontalLine} style={{marginBottom: "-6px"}} />

			{loading ? 
				<div className={style.techniqueEditCenterSpinner}><Spinner/></div>
				:
				null
			}

			{media.length > 0 ? 
				<>
					{media.map((o) => {
						return (
							<div key={o.id} className={style.mediaNameContainer} >
								<h2>{o.description} {o.id}</h2>
								<Trash
									className={style.trashIcon}
									size="24px"
									color="var(--red-primary)"
									style={{cursor: "pointer"}}
									onClick={() => handleDeleteMedia(o)}
								/>
							</div>
						)
					})}
				</>
				:
				!loading ?
					<div>
						<h2>{mediaMessage}</h2>
					</div>
					:
					null
			}

			<div className={style.mediaButtonContainer}>
				<Button onClick={() => setShowMediaPopup(true)}>
					<p>Ny media</p>
				</Button>
			</div>

			<Popup title={"Lägg till media"} isOpen={showMediaPopup} setIsOpen={setShowMediaPopup} >
				<UploadMedia id={technique.id} exerciseId={technique.id}/>	
			</Popup>

			<div style={{ display: "flex", gap: "27px", justifyContent: "space-evenly" }}>
				<Button
					id={style.techniqueEditBackbutton}
					onClick={() => setIsOpen(false)}
					outlined={true}>
					<p>Avbryt</p>
				</Button>

				<Button
					id={style.techniqueEditCreatebutton}
					onClick={() => handleClick()}>
					<p>Spara</p>
				</Button>
			</div>

		</div>
	)
}

// The build functions converts the objects to only include the id, required by the technique API
function buildTags(tags) {
	return tags.map(tag => { 
		return { id: tag.id } 
	})
}

function buildBelts(belts) {
	return belts.map(belt => {
		return { id: belt.id }
	})
}

