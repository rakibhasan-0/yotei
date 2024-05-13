import React, { useState } from "react"
import ExamineeButton from "./ExamineeButton"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"

/**
 * This is a box containing the Examinee's name.
 * 
 *   Props:
 *    id				@type {any} 	 the id of the component.
 *    examineeName      @type {String}   the name of the examinee
 * 
 * Example Usage:
 * <ExamineeBox 
 *  examineeName = "test person"/>
 *
 * @author Apelsin
 * @since 2024-05-03
 * @version 1.0 
 */

export default function ExamineeBox({ id, examineeName}) {
	const [selectedButton, setSelectedButton] = useState(null)
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState()
	const [commentError, setCommentError] = useState()


	/**
	 * Keeps track of which button that has been pressed.
	 * @param buttonId
	 */
	const handleButtonClick = (buttonId) => {
		setSelectedButton(prev => prev === buttonId ? null : buttonId)
		console.log(`Pressed ${buttonId} button`)
	}

	/**
	 * Is used when discarding a comment,
	 * i.e. when saving a comment is unwanted.
	 * @returns {Promise<void>}
	 */
	const onDiscardPersonalComment = async () => {
		setCommentText("")
		setAddComment(false)
	}

	/**
	 * Closes the addComment popup, unless it contains text in which case it shows
	 * a warning that the user input will be lost.
	 * @param {bool} show Whether the add comment popup should be shown.
	 */
	const toggleAddPersonalComment = async (show) => {
		if (!show && commentText && commentText.trim().length > 0) {
			setShowDiscardComment(true)
			return
		}
		setAddComment(show)
	}

	/**
	 * Handles the addition of a comment by sending a POST request to the API.
	 * Validates the comment text and displays an error if it is empty.
	 * Clears the comment text and sets addComment to false after a successful addition.
	 */
	const onAddPersonalComment = async () => {
		if (!commentText || !commentText.trim() || commentText.length === 0) {
			setCommentError("Kommentaren får inte vara tom")
			return
		}
		console.log("API ANROP SOM INTE FINNS ÄNNU. Detta skulle läggas in: " + commentText)
		/* API ANROP HÄR...
		const response = await fetch(`/api/comment/exercise/add?id=${ex_id}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				commentText
			})
		})
		if (response.status != 201) {
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		*/
		await onDiscardPersonalComment()
	}

	return (
		<div id={id} className={styles.examineeContainer} style={{backgroundColor: "#FFFFFF"}}>
			<fieldset className={styles.examineeFieldset}>
				<div className={styles.examineeName}>
					<p id="ExamineeName" style={{height:"52px", margin:"0"}}>{examineeName}</p>
				</div>
				<CommentButton onClick={() => setAddComment(true)} className={styles.commentButtonContainer}/>
				<div className={styles.buttonContainer}>
					<ExamineeButton
						id="pass-button"
						type="green"
						onClick={() => handleButtonClick("pass-button")}
						isSelected={selectedButton === "pass-button"}
						className={styles.examineeButton}
					>
						<p>G</p>
					</ExamineeButton>
					<ExamineeButton 
						id="fail-button"
						type="red"
						onClick={() => handleButtonClick("fail-button")}
						isSelected={selectedButton === "fail-button"}
						className={styles.examineeButton}
					>
						<p>U</p>
					</ExamineeButton>
				</div>
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
						onInput={e => {setCommentText(e.target.value); setCommentError(false)}}
						errorMessage={commentError}
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
