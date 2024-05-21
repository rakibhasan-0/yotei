import styles from "./EditableListItem.module.css"
import { Trash, Pencil, Check2 as Check, X } from "react-bootstrap-icons"
import { useState } from "react"
import CheckBox from "../CheckBox/CheckBox"

/**
 * An ExerciseListItem that can be used in an list view.
 * It displays the title of an exercise and its duration,
 * also the description belonging to the exercise when the
 * drop-down is toggled.
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the exercise
 * 		  id @type {integer} 			- The ID for this particular exercise in database
 * 		  index @type {integer} 		- The ID for this particular exercise on current page (Used for coloring)
 *      onRemove @type {function} - Action when removing the item
 *      onEdit @type {function}   - Action when editing the item
 *      onCheck @type {function} - Action when checking the checkbox
 *      showChecbox @type {boolean} - Show the checkbox or not
 *      checked @type {boolen} - What the default value will be for the checkbox
 *      validateInput @type {function} - Action to validate the input given
 *      grayThrash @type {boolean} - True if the trash icon should be grey otherwise it is red
 * 		showThrash @type {boolean} - True if the trash icon should be visible
 * 
 * Example usage:
 * 		<EditableListItem
 * 			item={name}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 * 			index={The index for the exercise in the list containing fetched exercises}>
*			onRemove={onRemoveFunction}
*			onEdit={onEditFunction}
*			onCheck={onCheckFunction}
*			showCheckbox={true}
*			checked={false}
*			validateInput={validateFunction}
*			grayTrash={false}
* 			showTrash={false}
* 			showX={false}
* 			showX={false}
* 			showPencil={false}
* 		</EditableListItem>
 * 
 * @author Team Pomegranate (Group 1), Team Durian (Group 3) (2024-05-13) 
 * @since 2024-05-06
 */
export default function EditableListItem({ item, id, index, onRemove, onEdit, onCheck, showCheckbox, checked, validateInput, grayTrash, showTrash, showX, showPencil}) {

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
		// The trimmed text is validated, since it will be trimmed when saved. 
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

	const handleEditAbort = () => {
		setIsEditing(false)
		setError("123")
		setEditedText(savedText)
		setGrayEdit(true) // Reset
	}

	const handleBlur = (event) => {
		if (event.relatedTarget?.id === "accept-icon") {
			handleEditSubmit()
		}
		setIsEditing(false)
	}

	return (
		<div className={styles["editable-container"]} id={id}>
			<div className={styles["editable-list-container"]} data-testid="EditableListItem">
				<div className={styles["editable-list-header"]} style={{ backgroundColor: index % 2 === 0 ? "var(--red-secondary)" : "var(--background)" }}>
					<div data-testid="EditableListItem-link" style={{ width: "100%" }}>
						<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
							{showCheckbox && <CheckBox
								onClick={(checked) => onCheck(checked, id)}
								checked={checked}
								id="checkbox-element"
							/>}
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }} onClick={handleEdit}>
								{isEditing ? (
									<input
										id="edit-element"
										className={error != "" ? `${styles["input"]} ${styles["errorInput"]}` : `${styles["input"]}`}
										type="text"
										value={editedText}
										onChange={handleInputChange}
										onBlur={handleBlur}
										autoFocus
									/>
								) : (
									<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="EditableListItem-item">
										{editedText}
									</div>
								)}
								<div className={styles["flex-shrink-0"]} style={{ display: "flex", alignItems: "center" }}>
									{isEditing ?
										<>
											<Check onClick={handleEditSubmit} size="24px" id="accept-icon"
												style={grayEdit ?
													{ color: "var(--gray)", cursor: "not-allowed", marginRight: "10px" } :
													{ color: "var(--red-primary)", cursor: "pointer", marginRight: "10px" }}
											/>
											{showX && (
												<X
													className={styles["close-icon"]}
													onClick={handleEditAbort}
													size="24px"
													style={{ color: "var(--red-primary)" }}
												/>
											)}
										</>
										:
										<>
											{showPencil && (
												<Pencil
													onClick={handleEdit} size="24px" style={{ color: "var(--red-primary)", cursor: "pointer", marginRight: "10px" }} id="pencil-icon"
												/>
											)}
											{showTrash && (
												<Trash
													className={styles["close-icon"]}
													onClick={() => onRemove(id, grayTrash)}
													size="24px"
													style={grayTrash ? { color: "var(--gray)" } : { color: "var(--red-primary)" }}
													id="close-icon"
													data-testid="trash-icon"/>
											)}
										</>
									}
								</div>
							</div>
						</div>
					</div>

				</div>

			</div>
			<div className={styles["input"]} style={{ color: "red", display: error == "" ? "none" : "block" }} >{error}</div>

		</div>)
}