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
	const [grayEdit, setGrayEdit] = useState(true)

	const handleEdit = () => {
		setIsEditing(true)
	}

	const handleInputChange = (event) => {
		const text = event.target.value
		// The trimmed text is validated, since it will be trimmed when saved. <Pencil onClick={handleEdit} size="24px" style={{ color: "var(--red-primary)", cursor: "pointer", marginRight: "10px" }} id="pencil-icon"/>
		const trimmedText = text.trim()
		const textareaErr = validateInput(trimmedText)
		// Update the gray check
		setGrayEdit(textareaErr != "" || trimmedText === savedText)
		setEditedText(text)
		setError(textareaErr)
	}

	const handleEditSubmit = () => {
		if (error == "" && !grayEdit) {
			setIsEditing(false)
			setEditedText(editedText.trim())
			setSavedText(editedText)
			onEdit(id, editedText)
		}
	}

	const handleBlur = (event) => {
		if (event.relatedTarget?.id === "accept-icon") {
			handleEditSubmit();
		}
		setIsEditing(false)
	}

  return (
    <div className={styles["editable-container"]} id={id}>
        <div className={styles["editable-list-container"]} data-testid="EditableListItem">
            <div className={styles["editable-list-header"]}>
                <div data-testid="EditableListItem-link" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <div
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}
                            onClick={handleEdit}
                        >
                            {isEditing ? (
                                <input
                                    id="edit-element"
                                    className={error ? `${styles["input"]} ${styles["errorInput"]}` : `${styles["input"]}`}
                                    type="text"
                                    value={editedText}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                            ) : (
                                <div className={styles["href-link"]} style={{ wordBreak: "break-word" }} data-testid="EditableListItem-item">
                                    <span>{editedText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles["input"]} style={{ color: "red", display: error ? "block" : "none" }}>{error}</div>
    </div>
  );
}

