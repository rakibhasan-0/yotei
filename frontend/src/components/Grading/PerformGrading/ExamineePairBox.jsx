import React, { useState, useContext } from "react"
import styles from "./ExamineePairBox.module.css"
import CommentButton from "./CommentButton"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"

import { setError as setErrorToast} from "../../../utils" 

import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"

/**
 * this is a box containing an Examinee pair.
 * 
 *   Props:
 *    id				@type {any}  	 the id used for general testing.
 *    pairNumber        @type {any} 	 the number for the pair.
 *    examineeLeftName  @type {String} 	 the name of the left examinee.
 *    examineeRightName @type {String} 	 the name of the right examinee.
 *    rowColor          @type {String} 	 the color of the row.
 * 
 * Example Usage:
 * Example Usage:
 * <ExamineePairBox rowColor={"#F8EBEC"}
 *  examineeLeftName={"garga mel"} 
 *  examineeRightName={"mel garga"} pairNumber={3}/>
 * 
 * @author Apelsin
 * @since 2024-05-13
 * @version 2.0 
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
	const [commentSaved, setCommentSaved] = useState(false)
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState()
	const [commentError, setCommentError] = useState()
	
	const { gradingId } = useParams()

	const { token, userId } = useContext(AccountContext)

	/**
	 * Is used when discarding a comment,
	 * i.e. when saving a comment is unwanted.
	 * @returns {Promise<void>}
	 */
	const onDiscardPairComment = async () => {
		setCommentText("")
		setAddComment(false)
	}

	/**
	 * Closes the addComment popup, unless it contains text in which case it shows
	 * a warning that the user input will be lost.
	 * @param {bool} show Whether the add comment popup should be shown.
	 */
	const toggleAddPairComment = async (show) => {
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
	const onAddPairComment = async () => {
		if (!commentText || !commentText.trim() || commentText.length === 0) {
			setCommentError("Kommentaren får inte vara tom")
			return
		}
		const response = await fetch("/api/examination/comment/", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				"gradingId": gradingId,
				"examineePairId": examineePairId,
				"techniqueName": techniqueName,
				"comment": commentText	
			})
		})
		if (response.status != 200) {
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		await onDiscardPairComment()
	}

	return (
		<fieldset id={id} className={styles.pairbox} style={{backgroundColor: rowColor}}>
			<div className={styles.pairinfo}>
				<p id="PairTextId" style={{ fontSize: "12px", marginBottom: "0" }}>Par:</p>
				<p id="PairNumberId" style={{ fontSize: "12px", marginBottom: "2px" }}>{pairNumber}</p>
				<CommentButton onClick={() => setAddComment(true)} commentSaved={commentSaved}/>
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
				style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset"}}
			>
				<TextArea 
					autoFocus={true}
					onInput={e => {setCommentText(e.target.value); setCommentError(false)}}
					errorMessage={commentError}
				/>
				<Button onClick={() => {onAddPairComment(); setCommentSaved(true)}} >Lägg till</Button>
			</Popup>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
				showPopup={showDiscardComment}
				onClick={() => {onDiscardPairComment(); setCommentSaved(false)}}
				setShowPopup={() => setShowDiscardComment(false)}
				zIndex={200} // Above the comment popup.
			/>
		</fieldset>
	)
}
