import React, { useState, useContext } from "react"
import CommentButton from "../PerformGrading/CommentButton"
import styles from "./TechniqueInfoPanel.module.css"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"

import { setError as setErrorToast} from "../../../utils" 
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"

/**
 * This panel  present the main categori, the current technique and the next
 * technique.
 * 
 *   Props:
 *    id, categoryTitle, currentTechniqueTitle, nextTechniqueTitle, beltColor,
 * 	  onButtonClicked
 *    id 		    		@type {String}   An id for the panel
 *    categoryTitle			@type {String}	 the title of the subcategory
 *    currentTechniqueTitle @type {String}   the current technique
 * 	  nextTechniqueTitle	@type {String}	 the next technique
 *    mainCategoryTitle		@type {String}	 the category title
 *    beltColor				@type {String}	 the color of the belt
 * 
 * Example Usage:
 * <TechniqueInfoPanel 
 *  beltColor = "#FFDD33",
 *	categoryTitle = "Test Kategori",
 *	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
 *	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
 *	mainCategoryTitle = "Huvudkategori",
 *
 * 
 * @author Apelsin
 * @since 2024-05-13
 * @version 2.0 
 */

export default function TechniqueInfoPanel( {
	beltColor = "#FFDD33",
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
	mainCategoryTitle = "Huvudkategori"
}) {

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
	const onDiscardGroupComment = async () => {
		setCommentText("")
		setAddComment(false)
	}
	/**
	 * Closes the addComment popup, unless it contains text in which case it shows
	 * a warning that the user input will be lost.
	 * @param {bool} show Whether the add comment popup should be shown.
	 */
	const toggleAddGroupComment = async (show) => {
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
	const onAddGroupComment = async () => {
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
				"techniqueName": currentTechniqueTitle,
				"comment": commentText	
			})
		})
		if (response.status != 200) {
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		await onDiscardGroupComment()
	}

	/* This was inside return earlier, but removed to get more space
		After row: <fieldset className={styles.infoPanel}>
		Before row: <div>
						<h3 className={styles.categoryTitle} role="categoryTitle">{mainCategoryTitle}</h3>
					</div>
		Code that existed in between:
				<fieldset role="fieldsetBelt" style={{ height: "0px", width: "100%", marginBottom: "3px", backgroundColor: beltColor}}>
					<div>
						<h2 className={styles.mainCategoryTitle} role="mainCategoryTitle">{mainCategoryTitle}</h2>
					</div>
				</fieldset>
	*/

	return (
		<div className={styles.infoPanelContainer}>
			<fieldset className={styles.infoPanel}>
				<div>
					<h3 className={styles.categoryTitle} role="categoryTitle">{mainCategoryTitle}</h3>
				</div>
				<div className={styles.buttonGroupComment}>
						<CommentButton onClick={() => setAddComment(true)} />
				</div>
				<div>
					<h2 className={styles.currentTechnique} role="currentTechniqueTitle">{currentTechniqueTitle}</h2>
				</div>
				
				<div className={styles.techniqueAndCommentSection}>
					<h3 className={styles.nextTechniqueText} role="nextTechniqueTitle"><b>Nästa:</b>{nextTechniqueTitle}</h3>
				</div>
				
			</fieldset>
			<Popup 
				id={"group-comment-popup"} 
				title={"Lägg till grupp kommentar"} 
				isOpen={isAddingComment} 
				setIsOpen={toggleAddGroupComment}
				onClose={() => setCommentError(false)}
				style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset"}}
			>
				<TextArea 
					autoFocus={true}
					onInput={e => {setCommentText(e.target.value); setCommentError(false)}}
					errorMessage={commentError}
				/>
				<Button onClick={onAddGroupComment}>Lägg till</Button>
			</Popup>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
				showPopup={showDiscardComment}
				onClick={() => onDiscardGroupComment()}
				setShowPopup={() => setShowDiscardComment(false)}
				zIndex={200} // Above the comment popup.
			/>
		</div>
	)

}
