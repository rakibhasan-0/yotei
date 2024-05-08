import React, { useState } from "react"
import CommentButton from "../PerformGrading/CommentButton"
import styles from "./TechniqueInfoPanel.module.css"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"

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
 * @since 2024-05-02
 * @version 1.0 
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
		await onDiscardGroupComment()
	}


	return (
		<div style={styles}>
			<fieldset role="fieldsetBelt" style={{ height: "30px", width: "100%", marginBottom: "10px", backgroundColor: beltColor}}>
				<div>
					<h2 className={styles.mainCategoryTitle} role="mainCategoryTitle">{mainCategoryTitle}</h2>
				</div>
			</fieldset>
			<fieldset style={{ height: "auto", width: "100%", marginBottom: "5px" }}>
				<div>
					<h3 className={styles.categoryTitle} role="categoryTitle">{categoryTitle}</h3>
				</div>
				<div>
					<h1 className={styles.currentTechnique} role="currentTechniqueTitle">{currentTechniqueTitle}</h1>
				</div>
				<div style={{width: "70%", float: "left"}}>
					<h3 className={styles.nextTechnique} role="nextTechniqueTitle"><b>Nästa:</b>{nextTechniqueTitle}</h3>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end"}}>
					<CommentButton onClick={() => setAddComment(true)} />
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
