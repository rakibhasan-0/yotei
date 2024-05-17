import styles from "./EditableInputTextField.module.css"
import { useState } from "react"

/**
 * An EditableInputTextField that can be edited only
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the exercise
 * 		  id @type {integer} 			- The ID for this particular exercise in database
 *      onEdit @type {function}   - Action when editing the item
 *      validateInput @type {function} - Action to validate the input given
 * 
 * Example usage:
 * 		<EditableInputTextField
 * 			item={name}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 *      onEdit={onEditFunction}
 *      validateInput={validateFunction}
 * 		</EditableInputTextField>
 * 
 * @author Team Pomegrade (Group 1) (2024-05-17)
 * @since 2024-05-06
 */
export default function EditableInputTextField({ item, id, onEdit, validateInput }) {

	const [isEditing, setIsEditing] = useState(false) // State to manage edit mode
	const [editedText, setEditedText] = useState(item) // State to store edited text
	const [savedText, setSavedText] = useState(item)
	const [error, setError] = useState("")

	const handleInputChange = (event) => {
		const text = event.target.value
		// The trimmed text is validated, since it will be trimmed when saved.
		const trimmedText = text.trim()
		const textareaErr = validateInput(trimmedText)
		// Update the gray check
		setEditedText(text)
		setError(textareaErr)
	}

	const handleEditSubmit = () => {
		if(error == "") {
			setIsEditing(false)
			setEditedText(editedText.trim())
			setSavedText(editedText)
			onEdit(id, editedText)
		}
	}

	const handleEditAbort = () => {
		setIsEditing(false)
		setError("")
		setEditedText(savedText)
	}

	return (
		<div className={styles["editable-container"]} id={id}>
			<div className={styles["editable-list-container"]} data-testid="EditableInputTextField">
				<div className={styles["editable-list-header"]}>
					<div data-testid="EditableInputTextField-link" style={{ width: "100%" }}>
						<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
								{isEditing ? (
									<input
										id="edit-element" 
										className={error != "" ? `${styles["input"]} ${styles["errorInput"]}` : `${styles["input"]}`}
										type="text"
										value={editedText}
										onChange={handleInputChange}
										onBlur={() => {
											if (editedText != "") {
												handleEditSubmit
											}
										}}
										autoFocus
									/> 
								) : (
									<h1 onClick={setIsEditing(true)} className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left"}} data-testid="EditableListItem-item">
                    {editedText}
                  </h1>
								)}
							</div>
						</div>
					</div>

				</div>

			</div>
			<div className={styles["input"]} style={{ color: "red" , display: error == "" ? "none" : "block"}} >{error}</div>

		</div>)
}
