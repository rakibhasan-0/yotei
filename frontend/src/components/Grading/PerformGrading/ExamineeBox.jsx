import React, { useState, useContext, useEffect } from "react"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"
import { setError as setErrorToast } from "../../../utils"

/**
 * This is a box containing the Examinee's name.
 * 
 *   Props:
 *    id                @type {any}      the id of the component.
 *    examineeName      @type {String}   the name of the examinee
 *    onClick           @type {function} onClick function when component is pressed.
 * 
 * Example Usage:
 * <ExamineeBox 
 *  examineeName = "test person"
 *  onClick={() => console.log("Clicked")}}/>
 *
 * @author Apelsin
 * @since 2024-05-15
 * @version 3.0 
 */

export default function ExamineeBox({ 
	id, 
	examineeName, 
	examineeId,
	techniqueName, 
	onClick, 
	buttonState, 
	setButtonState
}) {
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState("")
	const [commentError, setCommentError] = useState("")
	const [hasComment, setExistingComment] = useState(false)
	const [commentId, setCommentId] = useState(null)
	const colors = ["white", "lightgreen", "lightcoral"]

	const { gradingId } = useParams()
	const { token, userId } = useContext(AccountContext)

	useEffect(() => {
		if (isAddingComment) {
			handleExistingInput()
		}
	}, [isAddingComment])

	const onDiscardPersonalComment = async () => {
		setCommentText("")
		setAddComment(false)
	}

	const toggleAddPersonalComment = (show) => {
		if (!show && commentText && commentText.trim().length > 0) {
			setShowDiscardComment(true)
			return
		}
		setAddComment(show)
	}

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
				examineeId,
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
				examineeId,
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

	const onAddPersonalComment = async () => {
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

	const handleExistingInput = async () => {
		try {
			const response = await fetch(`/api/examination/comment/examinee/${examineeId}?technique_name=${techniqueName}`, {
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

	const [colorIndex, setColorIndex] = useState(0)

	const handleClick = () => {
		// Update buttonState based on current color
		if (colors[colorIndex] === "white") {
			buttonState = "pass"
		} else if (colors[colorIndex] === "lightgreen") {
			buttonState = "fail"
		} else if (colors[colorIndex] === "lightcoral") {
			buttonState = "default"
		}
		setButtonState(buttonState)
		// Update the color
		setColorIndex((colorIndex + 1) % colors.length)
		// Api call will be handled here and update the DB according to state
		onClick(buttonState) // Pass the new state as a parameter
	}

	return (
		<div id={id} className={styles.examineeContainer} style={{backgroundColor: colors[colorIndex]}}>
			<fieldset className={styles.examineeFieldset}>
				<div 
					className={styles.examineeName}
					onClick={() => {handleClick()}}>
					<p id="ExamineeName" style={{height:"52px", margin:"0"}}>{examineeName}</p>
				</div>
				<CommentButton onClick={() => toggleAddPersonalComment(true)} className={styles.commentButtonContainer} />

				<Popup 
					id={"examinee-comment-popup"} 
					title={"Lägg kommentar till: " + examineeName} 
					isOpen={isAddingComment} 
					setIsOpen={toggleAddPersonalComment}
					onClose={() => setCommentError(false)}
					style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset"}}
				>
					<TextArea 
						autoFocus={true}
						onInput={e => { setCommentText(e.target.value); setCommentError(false) }}
						errorMessage={commentError}
						text={commentText}
					/>
					<Button onClick={onAddPersonalComment}>Lägg till</Button>
				</Popup>
				<ConfirmPopup
					popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
					showPopup={showDiscardComment}
					onClick={() => onDiscardPersonalComment()}
					setShowPopup={() => setShowDiscardComment(false)}
					zIndex={200} // Above the comment popup.
				/>
			</fieldset>
		</div>
	)
}
