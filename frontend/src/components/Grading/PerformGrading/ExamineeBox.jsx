import React, { useState, useContext, useEffect } from "react"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"
import Popup from "../../Common/Popup/Popup"
import TextArea from "../../Common/TextArea/TextArea"
import Button from "../../Common/Button/Button"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import { AccountContext } from "../../../context"
import { useParams } from "react-router-dom"
import { setError as setErrorToast} from "../../../utils" 



/**
 * This is a box containing the Examinee's name.
 * 
 *   Props:
 *    id				@type {any} 	 the id of the component.
 *    examineeName      @type {String}   the name of the examinee
 *    onCLick           @type {function} onClick function when component is pressed.
    
 }}
 * 
 * Example Usage:
 * <ExamineeBox 
 *  examineeName = "test person"
 *  onClick={() => console.log("Clicked")}}/>
 *
 * @author Apelsin
 * @since 2024-05-20
 * @version 3.0 
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
	const [commentText, setCommentText] = useState()
	const [commentError, setCommentError] = useState()
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
        setColor(colors[status] || colors.default);
    }, [status]);

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
		
		const response = await fetch("/api/examination/comment/", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				"gradingId": gradingId,
				"examineeId": examineeId,
				"techniqueName": techniqueName,
				"comment": commentText	
			})
		})
		if (response.status != 200) {
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		await onDiscardPersonalComment()
	}

	const handleClick = () => {
        // Update buttonState and color based on current color
        let newButtonState;
        let newColor;
        
        if (color === colors.default) {
            newButtonState = "pass";
            newColor = colors.pass;
        } else if (color === colors.pass) {
            newButtonState = "fail";
            newColor = colors.fail;
        } else if (color === colors.fail) {
            newButtonState = "default";
            newColor = colors.default;
        }
        
        setButtonState(newButtonState);
        setColor(newColor);
        onClick(newButtonState); // Pass the new state as a parameter
    };

    console.log("name: ", examineeName, ", status: ", status, ", color: ", color)

	return (
		<div id={id} className={styles.examineeContainer} style={{ backgroundColor: color }}>
			<fieldset className={styles.examineeFieldset}>
				<div 
					className={styles.examineeName}
					onClick={() => {handleClick()}}>
					<p id="ExamineeName" style={{height:"52px", margin:"0"}}>{examineeName}</p>
				</div>
				<CommentButton onClick={() => setAddComment(true)} className={styles.commentButtonContainer}/>

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
