import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { AccountContext } from "../../../context"

import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import BeltIcon from "../../../components/Common/BeltIcon/BeltIcon"

import { Pencil, Trash } from "react-bootstrap-icons"

import "./TechniqueDetail.css"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../components/Common/Spinner/Spinner"
import Gallery from "../../../components/Gallery/Gallery"
import { isAdmin } from "../../../utils"

import Popup from "../../../components/Common/Popup/Popup"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"

import ActivityDelete from "../../../components/Activity/ActivityDelete/ActivityDelete"


/**
 * The detail page for a technique.
 * 
 * Props:
 * 		id: The id used for testing purposes.
 * 
 * Example usage:
 * 	   <TechniqueDetail id="test-id"/>
 * 
 * @author Team Medusa (Grupp 6) & Cyclops (Group 5) & Tomato (Group 6)
 * @version 3.0
 * @since 2024-04-18
 */
function TechniqueDetail({ id }) {

	const { techniqueId } = useParams()
	const { token } = useContext(AccountContext)
	const navigate = useNavigate()

	const [technique, setTechnique] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)

	const accountRole = useContext(AccountContext)
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	// Belt sorting order, Adult easiest -> Adult hardest -> Child easiest -> Child hardest
	const order = [3, 5, 7, 9, 11, 13, 14, 15, 16, 4, 6, 8, 10, 12];
	const beltSort = (a, b) => {
		const indexA = order.indexOf(a.id);
		const indexB = order.indexOf(b.id);

		if (indexA === -1) return 1
		if (indexB === -1) return -1

		return indexA - indexB;
	};	

	const handleGet = useCallback(() => {
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
	}, [techniqueId, token])

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
				<Popup
					title="Ta bort teknik"
					isOpen={showDeletePopup}
					setIsOpen={setShowDeletePopup}
					style={{height: "unset", maxHeight: "85vh"}}
				>
					<ActivityDelete id={"technique-workout-delete-popup"} activityID={techniqueId} name={technique.name} setIsOpen={setShowDeletePopup} what={"Teknik"}/>
				</Popup>
			</div>

			<div className="technique-detail-container" id={id == undefined ? "technique" : id}>
				<h1>{technique.name}</h1>
				{isAdmin(accountRole) && <div className="technique-detail-actions-container">
					<Link to={"edit"}>
						<Pencil
							id="technique-edit-button"
							size="24px"
							color="var(--red-primary)"
							style={{ cursor: "pointer" }}
						/>
					</Link>
					<Trash
						size="24px"
						color="var(--red-primary)"
						style={{ cursor: "pointer" }}
						onClick={() => setShowDeletePopup(true)}
					/>
				</div>
				}
				<div className="technique-detail-belts-container">
					{technique.belts ? (
						technique.belts.sort(beltSort).map(belt => <BeltIcon key={belt.name} belt={belt} />)
					) : (
						<p>Inga bälten kunde hittas för denna teknik.</p>
					)}
				</div>
				<h2>Beskrivning</h2>
				{technique.description ? (
					<pre>{technique.description}</pre>
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

				<Gallery id={techniqueId} />


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
