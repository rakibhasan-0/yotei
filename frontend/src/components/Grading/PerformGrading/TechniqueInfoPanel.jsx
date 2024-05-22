import React, { useState, useContext, useEffect } from "react"
import CommentButton from "../PerformGrading/CommentButton"
import styles from "./TechniqueInfoPanel.module.css"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { setError as setErrorToast } from "../../../utils"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"

/**
 * This panel presents the main category, the current technique, and the next technique.
 * 
 * @param {Object} props - Component properties.
 * @param {String} props.id - An id for the panel.
 * @param {String} props.categoryTitle - The title of the subcategory.
 * @param {String} props.currentTechniqueTitle - The current technique.
 * @param {String} props.nextTechniqueTitle - The next technique.
 * @param {String} props.mainCategoryTitle - The category title.
 * @param {String} props.beltColor - The color of the belt.
 * 
 * Example Usage:
 * <TechniqueInfoPanel 
 *  beltColor = "#FFDD33",
 *  categoryTitle = "Test Kategori",
 *  currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
 *  nextTechniqueTitle = "2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
 *  mainCategoryTitle = "Huvudkategori",
 * />
 * 
 * @component
 * @example
 * return (
 *   <TechniqueInfoPanel 
 *     beltColor="#FFDD33"
 *     categoryTitle="Test Kategori"
 *     currentTechniqueTitle="1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke"
 *     nextTechniqueTitle="2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame"
 *     mainCategoryTitle="Huvudkategori"
 *   />
 * )
 * 
 * @version 2.0
 * @since 2024-05-13
 * 
 */
export default function TechniqueInfoPanel({
	beltColor = "#FFDD33", 
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
	nextTechniqueTitle = "2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
	mainCategoryTitle = "Huvudkategori"
}) {
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState("")
	const [commentError, setCommentError] = useState("")
	const [hasComment, setExistingComment] = useState(false)
	const [commentId, setCommentId] = useState(null)
	const { gradingId } = useParams()
	const { token, userId } = useContext(AccountContext)
	const isErr = !(commentError == undefined || commentError == null || commentError == "")

	useEffect(() => {
		if (isAddingComment) {
			handleExistingInput()
		}
	}, [isAddingComment])

	// Updates notifications when switching techniques
	useEffect(() => {
		handleExistingInput()
	}, [currentTechniqueTitle])

	/**
     * Discards the current group comment.
     */
	const onDiscardGroupComment = async () => {
		if (!hasComment) {
			setCommentText("")
		}
		setAddComment(false)
	}

	/**
     * Toggles the visibility of the group comment input.
     * @param {boolean} show - Whether to show or hide the comment input.
     */
	const toggleAddGroupComment = (show) => {
		if (!show && commentText && commentText.trim().length > 0) {
			setShowDiscardComment(true)
			return
		}
		setAddComment(show)
	}

	/**
     * Updates an existing comment via an API call.
     */
	async function updateComment() {
		const response = await fetch("/api/examination/comment", {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				commentId,
				gradingId,
				techniqueName: currentTechniqueTitle,
				comment: commentText
			})
		})

		if (response.status !== 200) {
			console.error("Error updating comment, status:", response.status)
			setErrorToast("Ett fel uppstod när kommentaren skulle uppdateras.")
			return
		}
	}

	/**
     * Posts a new comment via an API call.
     */
	async function postComment() {
		const response = await fetch("/api/examination/comment/", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				gradingId,
				techniqueName: currentTechniqueTitle,
				comment: commentText
			})
		})

		if (response.status !== 200) {
			console.error("Error posting comment, status:", response.status)
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till.")
			return
		}

		setExistingComment(true)
	}

	/**
     * Adds or updates a group comment based on its existence.
     */
	const onAddGroupComment = async () => {
		if (!commentText || !commentText.trim() || commentText.length === 0) {
			setCommentError("Kommentaren får inte vara tom")
			return
		}

		try {
			if (hasComment) {
				await updateComment()
			} else {
				await postComment()
			}
			setAddComment(false)
			setCommentText(commentText)
		} catch (error) {
			console.error("Något gick fel:", error)
			setErrorToast("Ett fel uppstod vid kommunikation med servern.")
		}
	}

	/**
     * Handles the retrieval of existing input data (comments) for the current technique.
     */
	const handleExistingInput = async () => {
		try {
			const response = await fetch(`/api/examination/comment/group/${gradingId}?technique_name=${currentTechniqueTitle}`, {
				headers: { "token": token }
			})

			if (response.status === 404) {
				console.log("No existing comment, 404 status")
				setCommentText("")
				setExistingComment(false)
				return
			}

			if (!response.ok) {
				console.log("Något gick fel med hämtningen.")
				throw new Error("Could not fetch comments.")
			}

			const existingComments = await response.json()
			const commentObject = existingComments.find(c => c.techniqueName === currentTechniqueTitle)

			if (commentObject) {
				setCommentId(commentObject.commentId)
				setCommentText(commentObject.comment)
				setExistingComment(true)
			} else {
				setCommentId(null)
				setCommentText("")
				setExistingComment(false)
			}
		} catch (ex) {
			setErrorToast("Kunde inte hämta kommentarer.")
			console.error(ex)
		}
	}
	// To have linter not fail, all below should be removed later if not used before 2024-06-10
	console.log(beltColor)
	console.log(categoryTitle)
	/* This was inside return earlier, but removed to get more space
		After row: <fieldset className={styles.infoPanel}>
		Before row: <div>
						<h3 className={styles.categoryTitle} role="categoryTitle">{mainCategoryTitle}</h3>
					</div>
		Code that existed in between:
				<fieldset role="fieldsetBelt" style={{ height: "0px", width: "100%", marginBottom: "3px", backgroundColor: beltColor }}>
					<div>
						<h2 className={styles.mainCategoryTitle} role="mainCategoryTitle">{mainCategoryTitle}</h2>
					</div>
				</fieldset>
	*/

	return (
		<div className={styles.infoPanelContainer}>
			<fieldset className={styles.infoPanel}>
				<div>
					<h3 className={styles.categoryTitle} id="categoryTitle">{mainCategoryTitle}</h3>
				</div>
				<div className={styles.buttonGroupComment}>
					<CommentButton onClick={() => setAddComment(true)} hasComment={hasComment} />
				</div>
				<div>
					<h2 className={styles.currentTechnique} id="currentTechniqueTitle">{currentTechniqueTitle}</h2>
				</div>
				
				<div className={styles.techniqueAndCommentSection}>
					<h3 className={styles.nextTechniqueText} id="nextTechniqueTitle"><b>Nästa:</b>{nextTechniqueTitle}</h3>
				</div>
				
			</fieldset>
			<Popup
				id={"group-comment-popup"}
				title={"Lägg till grupp kommentar"}
				isOpen={isAddingComment}
				setIsOpen={toggleAddGroupComment}
				onClose={() => setCommentError(false)}
				style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset" }}
			>
				<textarea
					className={isErr ? `${styles.textarea} ${styles.textareaErr}` : `${styles.textarea}`}
					autoFocus={true}
					onInput={ e => {
						setCommentText(e.target.value)
						setCommentError(false)
					}}
					value={commentText}
					id={"TextareaTestId"}
					type={"text"}
				/>
				{commentError && <p className={styles.err}>{commentError}</p>}
				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", marginTop: "10px"}}>
					<Button outlined={true} onClick={() => setCommentText(commentText + " " + "Böj på benen!")}>Böj på benen!</Button>
					<Button outlined={true} onClick={() => setCommentText(commentText + " " + "Balansbrytning!")}>Balansbrytning!</Button>
					<Button outlined={true} onClick={() => setCommentText(commentText + " " + "Kraftcirkeln!")}>Kraftcirkeln!</Button>
				</div>
				<Button onClick={() => onAddGroupComment()}>Lägg till</Button>
			</Popup>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
				showPopup={showDiscardComment}
				onClick={() => {onDiscardGroupComment()}}
				setShowPopup={() => setShowDiscardComment(false)}
				zIndex={200} // Above the comment popup.
			/>
		</div>
	)
}
