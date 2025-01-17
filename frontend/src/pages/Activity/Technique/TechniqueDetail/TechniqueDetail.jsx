import { useState, useEffect, useContext, useCallback } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { AccountContext } from "../../../../context"

import Tag from "../../../../components/Common/Tag/Tag"
import Button from "../../../../components/Common/Button/Button"
import BeltIcon from "../../../../components/Common/BeltIcon/BeltIcon"

import { Pencil, Trash } from "react-bootstrap-icons"
import Review from "../../../../components/Common/Technique/TechniqueReview/ReviewFormComponent.jsx"

import styles from "./TechniqueDetail.module.css"
import ErrorState from "../../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../../components/Common/Spinner/Spinner"
import Gallery from "../../../../components/Gallery/Gallery"
import { canCreateAndEditTechnique, isAdminUser } from "../../../../utils"

import Popup from "../../../../components/Common/Popup/Popup"
import ConfirmPopup from "../../../../components/Common/ConfirmPopup/ConfirmPopup"

import ActivityDelete from "../../../../components/Activity/ActivityDelete/ActivityDelete"




/**
 * The detail page for a technique.
 * 
 * Props:
 * 		id: The id used for testing purposes.
 * 
 * Example usage:
 * 	   <TechniqueDetail id="test-id"/>
 * 
 * Version 4.1:
 * 		Fixed navigation from pages outside the website 
 * 
 * @author Team Medusa (Grupp 6) & Cyclops (Group 5) & Tomato (Group 6) & Team Durian (Group 3) (2024-04-23), Team Kiwi (Group 2) (2024-05-03), Team Mango (2024-05-21)
 * @version 4.1
 * @since 2024-04-25
 * 
 * @update 2024-05-21: changed check for user premission to edit technique to the new check.
 * @update 2024-05-30: removed the review button for users without correct permission.
 */
function TechniqueDetail({ id }) {

	const { techniqueId } = useParams()
	const { token } = useContext(AccountContext)
	const navigate = useNavigate()
	const location = useLocation()
	const hasPreviousState = location.key !== "default"
	const [showRPopup, setRShowPopup] = useState(false)
	const [technique, setTechnique] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)

	const context = useContext(AccountContext)
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	// Belt sorting order, Adult easiest -> Adult hardest -> Child easiest -> Child hardest
	const order = [3, 5, 7, 9, 11, 13, 14, 15, 16, 4, 6, 8, 10, 12]
	const beltSort = (a, b) => {
		const indexA = order.indexOf(a.id)
		const indexB = order.indexOf(b.id)

		if (indexA === -1) return 1
		if (indexB === -1) return -1

		return indexA - indexB
	}

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
			if (hasPreviousState) {
				navigate(-1)
			} else {
				navigate("/activity")
			}
		} catch (err) {
			setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
		}
	}

	if (error != "") return <ErrorState
		message={error}
		onBack={() => navigate("/activity")}
		onRecover={handleGet}
	/>

	if (loading) return <div className={styles["technique-detail-center-spinner"]}><Spinner /></div>

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

			<div className={styles["technique-detail-container"]} id={id == undefined ? "technique" : id}>
				<title>Tekniker</title>
				<h1 style={{wordBreak: "break-word"}}>{technique.name}</h1>
				{(isAdminUser(context) || canCreateAndEditTechnique(context)) && <div className={styles["technique-detail-actions-container"]} data-testid="technique-detail-actions-container">
					<Link to={"edit"}>
						<Pencil
							id="technique-edit-button"
							size="24px"
							color="var(--red-primary)"
							style={{ cursor: "pointer" }}
						/>
					</Link>
					<Trash
						id="technique-delete-button"
						size="24px"
						color="var(--red-primary)"
						style={{ cursor: "pointer" }}
						onClick={() => setShowDeletePopup(true)}
					/>
				</div>
				}
				<div className={styles["technique-detail-belts-container"]}>
					{technique.belts ? ( 
						technique.belts.filter(belt => !belt.child).sort(beltSort).map(belt => <BeltIcon key={belt.name} belt={belt} />)
					) : (
						<p>Inga bälten kunde hittas för denna teknik.</p>
					)}
				</div>
				<div className={styles["technique-detail-belts-container"]}>
					{(
						technique.belts.filter(belt => belt.child).sort(beltSort).map(belt => <BeltIcon key={belt.name} belt={belt} />)
					)}
				</div> 
				
				<h2>Beskrivning</h2>
				{technique.description ? (
					<p style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{technique.description}</p>
				) : (
					<p style={{ fontStyle: "italic", color: "var(--gray)" }}>Beskrivning saknas.</p>
				)}
				<h2>Taggar</h2>
				<div className={styles["technique-detail-tag-container"]}>
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
				{getReviewContainer(showRPopup, setRShowPopup, techniqueId)}
				{getButtons(navigate, hasPreviousState, setRShowPopup, context)}
			</div>
		</>
	)
}

function getReviewContainer(showRPopup, setRShowPopup, techniqueId){
	return (<Review isOpen={showRPopup} setIsOpen={setRShowPopup} technique_id={techniqueId}/>)
}

function getButtons(navigate, hasPreviousState, setRShowPopup, context) {

	const handleNavigation = () => {
		if(hasPreviousState) {
			navigate(-1)
		}
		else{
			navigate("/activity")
		}
	}

	return (
		<div className="d-flex row justify-content-center">
			<div className="d-flex col mb-3 mt-3 justify-content-start">
				<Button onClick={handleNavigation} outlined={true}>
					<p>Tillbaka</p>
				</Button>
			</div>
			{(isAdminUser(context) || canCreateAndEditTechnique(context)) &&
			<div className="d-flex col mb-3 mt-3 justify-content-end">
				<Button onClick={() => setRShowPopup(true)} outlined={false}>
					<p>Utvärdering</p>
				</Button>
			</div>
			}
		</div>
	)
}

export default TechniqueDetail
