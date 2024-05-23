import React, { useState, useContext, useEffect } from "react"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"
import { setError as setErrorToast } from "../../../utils"

/**
 * This is a box containing the Examinee's name.
 * 
 * @param {Object} props - Component properties.
 * @param {any} props.id - The id of the component.
 * @param {String} props.examineeName - The name of the examinee.
 * @param {any} props.examineeId - The id of the examinee.
 * @param {String} props.techniqueName - The name of the technique.
 * @param {function} props.onClick - onClick function when component is pressed.
 * @param {String} props.status - The current status of the button.
 * @param {function} props.setButtonState - Function to set the state of the button.
 * 
 * Example Usage:
 * <ExamineeBox 
 *  examineeName="test person"
 *  onClick={() => console.log("Clicked")}/>
 * 
 * @component
 * @example
 * return (
 *   <ExamineeBox 
 *     examineeName="test person"
 *     examineeId={1}
 *     techniqueName="Some Technique"
 *     onClick={() => console.log("Clicked")}
 *     status="default"
 *     setButtonState={(state) => console.log(state)}
 *   />
 * )
 * 
 * @version 3.0
 * @since 2024-05-21
 * @author Apelsin
 */
export default function ExamineeBox({ 
	id, 
	examineeName, 
	examineeId,
	techniqueName, 
	onClick, 
	status, 
	setButtonState
}) {
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [isAddingComment, setAddComment] = useState(false)
	const [commentText, setCommentText] = useState("")
	const [commentError, setCommentError] = useState("")
	const [hasComment, setExistingComment] = useState(false)
	const [commentId, setCommentId] = useState(null)
	
	const isErr = !(commentError == undefined || commentError == null || commentError == "")



	const colors = {
		default: "white",
		pass: "lightgreen",
		fail: "lightcoral"
	}
    
	const { gradingId } = useParams()
	const { token, userId } = useContext(AccountContext)

	// Set initial color index based on status prop
	const [color, setColor] = useState(colors[status] || colors.default)
    
	useEffect(() => {
		setColor(colors[status] || colors.default)
	}, [status])
    
	useEffect(() => {
		if (isAddingComment) {
			handleExistingInput()
		}
	}, [isAddingComment])

	// Updates notifications when switching techniques
	useEffect(() => {
		handleExistingInput()
	}, [techniqueName])

	/**
     * Discards the current personal comment.
     */
	const onDiscardPersonalComment = async () => {
		if (!hasComment) {
			setCommentText("")
		}
		setAddComment(false)
	}

	/**
     * Toggles the visibility of the personal comment input.
     * @param {boolean} show - Whether to show or hide the comment input.
     */
	const toggleAddPersonalComment = (show) => {
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

	/**
     * Adds or updates a personal comment based on its existence.
     */
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

	/**
     * Handles the retrieval of existing input data (comments) for the current examinee.
     */
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

	const handleClick = () => {
		// Update buttonState and color based on current color
		let newButtonState
		let newColor
        
		if (color === colors.default) {
			newButtonState = "pass"
			newColor = colors.pass
		} else if (color === colors.pass) {
			newButtonState = "fail"
			newColor = colors.fail
		} else if (color === colors.fail) {
			newButtonState = "default"
			newColor = colors.default
		}
        
		setButtonState(newButtonState)
		setColor(newColor)
		onClick(newButtonState) // Pass the new state as a parameter
	}

	return (
		<div id={id} className={styles.examineeContainer} style={{ backgroundColor: color }}>
			<fieldset className={styles.examineeFieldset}>
				<div 
					className={styles.examineeName}
					onClick={() => {handleClick()}}>
					<p id="ExamineeName" >{examineeName}</p>
				</div>
				<CommentButton onClick={() => toggleAddPersonalComment(true)} className={styles.commentButtonContainer} hasComment={hasComment} />

				<Popup
					id={"examinee-comment-popup"}
					title={"Lägg kommentar till: " + examineeName}
					isOpen={isAddingComment}
					setIsOpen={toggleAddPersonalComment}
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
						<Button outlined={true} onClick={() => {setCommentText(commentText + " " + "Böj på benen!"); setCommentError(false)}}>Böj på benen!</Button>
						<Button outlined={true} onClick={() => {setCommentText(commentText + " " + "Balansbrytning!"); setCommentError(false)}}>Balansbrytning!</Button>
						<Button outlined={true} onClick={() => {setCommentText(commentText + " " + "Kraftcirkeln!"); setCommentError(false)}}>Kraftcirkeln!</Button>
					</div>
					<Button onClick={() => onAddPersonalComment()}>Lägg till</Button>
				</Popup>
				<ConfirmPopup
					popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
					showPopup={showDiscardComment}
					onClick={() => {onDiscardPersonalComment()}}
					setShowPopup={() => setShowDiscardComment(false)}
					zIndex={200} // Above the comment popup.
				/>
			</fieldset>
		</div>
	)
}
