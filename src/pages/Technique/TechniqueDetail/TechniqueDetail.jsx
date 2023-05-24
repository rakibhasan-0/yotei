import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { AccountContext } from "../../../context"

import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import BeltIcon from "../../../components/Common/BeltIcon/BeltIcon"

import { Pencil, Trash } from "react-bootstrap-icons"

import "./TechniqueDetail.css"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../components/Common/Spinner/Spinner"
import Gallery from "../../../components/Gallery/Gallery"
import { isEditor } from "../../../utils"

import Popup from "../../../components/Common/Popup/Popup"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"

import TechniqueEdit from "../TechniqueEdit/TechniqueEdit"


/**
 * The detail page for a technique.
 * 
 * Props:
 * 		id: The id used for testing purposes.
 * 
 * Example usage:
 * 	   <TechniqueDetail id="test-id"/>
 * 
 * @author Team Medusa (Grupp 6) & Cyclops (Group 5)
 * @version 2.0
 * @since 2023-05-17
 */
function TechniqueDetail({ id }) {

	const { techniqueId } = useParams()
	const { token } = useContext(AccountContext)
	const navigate = useNavigate()

	const [technique, setTechnique] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)

	const accountRole = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)

	const handleGet = useCallback(() => {
		// Fix to update the details page after an edit
		if (showPopup !== false) {
			return
		}

		setLoading(true)
		setError("")
		fetch(`/api/techniques/${techniqueId}`, { headers: { token } })
			.then(async res => {
				if (!res.ok) {
					// Quick fix with + " " because old API returns empty body on 404.
					setError(await res.text() + " ")
					setLoading(false)
					return
				}
				const technique = await res.json()
				setTechnique(technique)
				setLoading(false)
			})
			.catch(() => {
				setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
				setLoading(false)
			})
	}, [showPopup, techniqueId, token])

	useEffect(() => handleGet(), [handleGet, techniqueId, token])

	async function handleDelete() {
		try {
			const res = await fetch("/api/techniques/" + techniqueId, {
				headers: { token },
				method: "DELETE"
			})

			if (!res.ok) {
				const msg = await res.text()
				// Quick fix with + " " because old API returns empty body on 404.
				setError(msg + " ")
				return
			}
			navigate("/technique")
		} catch (err) {
			setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
		}
	}

	if (error != "") return <ErrorState
		message={error}
		onBack={() => navigate("/technique")}
		onRecover={handleGet}
	/>

	if (loading) return <div className='technique-detail-center-spinner'><Spinner /></div>

	return (
		<>
			<div>
				<Popup title="Redigera teknik" isOpen={showPopup} setIsOpen={setShowPopup}>
					<TechniqueEdit setIsOpen={setShowPopup} technique={technique} />
				</Popup>
			</div>

			<div className="technique-detail-container" id={id == undefined ? "technique" : id}>
				<Gallery id={techniqueId} />
				<h1>{technique.name}</h1>
				{isEditor(accountRole) && <div className="technique-detail-actions-container">
					<Pencil
						id="technique-edit-button"
						size="24px"
						color="var(--red-primary)"
						style={{ cursor: "pointer" }}
						onClick={() => setShowPopup(true)}
					/>
					<Trash
						size="24px"
						color="var(--red-primary)"
						style={{ cursor: "pointer" }}
						onClick={() => setShowConfirmPopup(true)}
					/>
				</div>
				}
				<p style={{ marginBottom: 0 }}>{technique.isKihon ? "Kihon" : "Ej kihon"}</p>
				<div className="technique-detail-belts-container">
					{technique.belts ? (
						technique.belts.map(belt => <BeltIcon key={belt.name} belt={belt} />)
					) : (
						<p>Inga bälten kunde hittas för denna teknik.</p>
					)}
				</div>
				<h2>Beskrivning</h2>
				{technique.description ? (
					<p>{technique.description}</p>
				) : (
					<p style={{ fontStyle: "italic", color: "var(--gray)" }}>Beskrivning saknas.</p>
				)}
				<h2>Taggar</h2>
				<div className="technique-detail-tag-container">
					{technique.tags ? (
						technique.tags.map(tag => <Tag key={tag.id} text={tag.name} tagType="default" />)
					) : (
						<p>Denna teknik saknar taggar.</p>
					)
					}
				</div>

				<ConfirmPopup
					popupText={"Är du säker på att du vill ta bort tekniken?"}
					showPopup={showConfirmPopup}
					onClick={handleDelete}
					setShowPopup={() => setShowConfirmPopup(false)}
				/>

				<div className="technique-detail-button-container">
					<Button outlined={true} onClick={() => navigate(-1)}>
						<p>Tillbaka</p>
					</Button>
				</div>

			</div>
		</>
	)
}

export default TechniqueDetail
