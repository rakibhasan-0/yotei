import React, { useState, useContext, useEffect } from "react"
import styles from "./ExamineePairBox.module.css"
import CommentButton from "./CommentButton"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { setError as setErrorToast } from "../../../utils"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"

/**
 * This is a box containing an examinee pair.
 * 
 * @param {Object} props - Component properties.
 * @param {any} props.id - The id used for general testing.
 * @param {any} props.pairNumber - The number for the pair.
 * @param {String} props.examineeLeftName - The name of the left examinee.
 * @param {String} props.examineeRightName - The name of the right examinee.
 * @param {String} props.rowColor - The color of the row.
 * @param {String} props.techniqueName - The name of the technique.
 * 
 * Example Usage:
 * <ExamineePairBox 
 *  rowColor={"#F8EBEC"}
 *  examineeLeftName={"garga mel"} 
 *  examineeRightName={"mel garga"} 
 *  pairNumber={3} 
 *  techniqueName={"Some Technique"}
 * />
 * 
 * @component
 * @example
 * return (
 *   <ExamineePairBox 
 *     rowColor="#F8EBEC"
 *     examineeLeftName="garga mel"
 *     examineeRightName="mel garga"
 *     pairNumber={3}
 *     techniqueName="Some Technique"
 *   />
 * )
 * 
 * @version 2.0
 * @since 2024-05-13
 * 
 */
export default function ExamineePairBox({
	id,
	pairNumber,
	examineePairId,
	leftExaminee,
	rightExaminee,
	rowColor,
	techniqueName
}) {
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState("")
	const [commentError, setCommentError] = useState("")
	const [hasComment, setExistingComment] = useState(false)
	const [commentId, setCommentId] = useState(null)

	const { gradingId } = useParams()
	const { token, userId } = useContext(AccountContext)

	useEffect(() => {
		if (isAddingComment) {
			handleExistingInput()
		}
	}, [isAddingComment])

	/**
     * Discards the current pair comment.
     */
	const onDiscardPairComment = async () => {
		setCommentText("")
		setAddComment(false)
	}

	/**
     * Toggles the visibility of the pair comment input.
     * @param {boolean} show - Whether to show or hide the comment input.
     */
	const toggleAddPairComment = (show) => {
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
				examineePairId,
				techniqueName,
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
				examineePairId,
				techniqueName,
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
     * Adds or updates a pair comment based on its existence.
     */
	const onAddPairComment = async () => {
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
     * Handles the retrieval of existing input data (comments) for the current pair.
     */
	const handleExistingInput = async () => {
		try {
			const response = await fetch(`/api/examination/comment/pair/${examineePairId}?technique_name=${techniqueName}`, {
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
			const commentObject = existingComments.find(c => c.techniqueName === techniqueName)

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

	return (
		<fieldset id={id} className={styles.pairbox} style={{ backgroundColor: rowColor }}>
			<div className={styles.pairinfo}>
				<p id="PairTextId" style={{ fontSize: "12px", marginBottom: "0" }}>Par:</p>
				<p id="PairNumberId" style={{ fontSize: "12px", marginBottom: "2px" }}>{pairNumber}</p>
				<CommentButton onClick={() => setAddComment(true)} />
			</div>
			<div className={styles.pair}>
				<div id="ExamineeLeftNameId" className={styles.pairleft}>
					{leftExaminee}
				</div>
				<div id="ExamineeRightNameId" className={styles.pairright}>
					{rightExaminee}
				</div>
			</div>
			<Popup
				id={"pair-comment-popup"}
				title={"Lägg kommentar till: Par " + pairNumber}
				isOpen={isAddingComment}
				setIsOpen={toggleAddPairComment}
				onClose={() => setCommentError(false)}
				style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset" }}
			>
				<TextArea
					autoFocus={true}
					onInput={e => { setCommentText(e.target.value); setCommentError(false) }}
					errorMessage={commentError}
					text={commentText}
				/>
				<Button onClick={onAddPairComment}>Lägg till</Button>
			</Popup>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
				showPopup={showDiscardComment}
				onClick={() => onDiscardPairComment()}
				setShowPopup={() => setShowDiscardComment(false)}
				zIndex={200} // Above the comment popup.
			/>
		</fieldset>
	)
}
