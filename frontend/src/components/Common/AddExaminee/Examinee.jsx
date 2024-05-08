import { ChevronRight, Key } from "react-bootstrap-icons"
import styles from "./Examinee.module.css"
import { Link } from "react-router-dom"
import { Trash, Pencil, X as CloseIcon  } from "react-bootstrap-icons"
import { useState, useEffect, useContext } from "react"
import CheckBox from "../CheckBox/CheckBox"

/**
 * An ExerciseListItem that can be used in an list view.
 * It displays the title of an exercise and its duration,
 * also the description belonging to the exercise when the
 * drop-down is toggled.
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the exercise
 *     	text @type {string} 		- Text displaying the duration of the exercise
 *     	children @type {string} 	- Text displaying the description of the exercise
 * 		  detailURL @type {string} 	- The base URL for exercises
 * 		  id @type {integer} 			- The ID for this particular exercise in database
 * 		  index @type {integer} 		- The ID for this particular exercise on current page (Used for coloring)
 * 
 * Example usage:
 * 		<Examinee
 * 			item={the exercise name}
 * 			text={exercise duration + " min"}
 * 			id={The unique ID for an exercises, gets concatenated onto detailURL}
 * 			detailURL={the base URL for exercises}
 * 			index={The index for the exercise in the list containing fetched exercises}>
 * 
 * 			"Description"
 * 		</Examinee>
 * 
 * @author Team 1
 * @since 2024-05-06
 */
export default function Examinee({ item, text, id, index, onRemove, onEdit, pairNumber, onCheck, showCheckbox }) {

  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [editedText, setEditedText] = useState(item); // State to store edited text
  const [currentName, setCurrentName] = useState(item);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setEditedText(event.target.value);
    setCurrentName(event.target.value);
  };

  const handleEditSubmit = () => {
    if(currentName != "") {
      setIsEditing(false);
      setCurrentName(editedText);
      onEdit(id, editedText);
    }
  };

	return (
  <div className={styles["examinee-container"]}>
    <div className={styles["examinee-list-container"]} data-testid="ExamineeListItem">
      <div className={styles["examinee-list-header"]} style={{ backgroundColor: index % 2 === 0 ? "var(--red-secondary)" : "var(--background)" }}>
        <div data-testid="ExamineeListItem-link" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            {showCheckbox && <CheckBox
              onClick={(checked) => onCheck(checked, id)}
              enabled
              id="test-id"
            />}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
              {isEditing ? (
                <input
                  className={`${styles["input"]}`}
                  type="text"
                  value={currentName}
                  onChange={handleInputChange}
                  onBlur={() => {
                    if (currentName != "") {
                      handleEditSubmit
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExamineeListItem-item">{currentName}</div>
              )}
              <div className={styles["flex-shrink-0"]} style={{ display: "flex", alignItems: "center" }}>
                <div className={styles["examinee-list-duration"]} data-testid="ExamineeListItem-text">
                  <p>{text}</p>
                </div>
                {isEditing ? (
                  <Key onClick={handleEditSubmit} size="24px" style={{ color: "var(--red-primary)", cursor: "pointer", marginRight: "10px" }} />
                ) : (
                  <Pencil onClick={handleEdit} size="24px" style={{ color: "var(--red-primary)", cursor: "pointer", marginRight: "10px" }} />
                )}
                <CloseIcon
                  className={styles["close-icon"]}
                  onClick={() => onRemove(id)}
                  size="24px"
                  style={{ color: "var(--red-primary)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
}
