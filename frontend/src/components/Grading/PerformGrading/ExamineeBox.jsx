import React, { useState, useContext, useEffect } from "react"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"
import { setError as setErrorToast } from "../../../utils"

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
	const [initialCommentText, setInitialCommentText] = useState("") 
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

	const [color, setColor] = useState(colors[status] || colors.default)
    
	useEffect(() => {
		setColor(colors[status] || colors.default)
	}, [status])
    
	useEffect(() => {
		if (isAddingComment) {
			handleExistingInput()
		}
	}, [isAddingComment])

	useEffect(() => {
		handleExistingInput()
	}, [techniqueName])

	const onDiscardPersonalComment = async () => {
		if (!hasComment) {
			setCommentText("")
		}
		setAddComment(false)
	}

	const toggleAddPersonalComment = (show) => {
		if (!show && commentText !== initialCommentText) { 
			setShowDiscardComment(true)
			return
		}
		setAddComment(show)
		if (show) {
			setInitialCommentText(commentText)
		}
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
				setInitialCommentText("")
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
				setInitialCommentText(commentObject.comment)
				setExistingComment(true)
			} else {
				setCommentId(null)
				setCommentText("")
				setInitialCommentText("")
				setExistingComment(false)
			}
		} catch (ex) {
			setErrorToast("Kunde inte hämta kommentarer.")
			console.error(ex)
		}
	}

	const handleClick = () => {
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
		onClick(newButtonState)
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
					zIndex={200}
				/>
			</fieldset>
		</div>
	)
}
