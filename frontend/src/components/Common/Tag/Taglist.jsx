import React, { useState } from "react"
import { Pencil } from "react-bootstrap-icons"
import styles from "./TagList.module.css"
import { Link } from "react-router-dom"
import { Trash } from "react-bootstrap-icons"
import CheckBox from "../CheckBox/CheckBox"


export default function TagList({ tag, index, onChecked, added, onTrashClicked, onPencilClicked }) {
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
		<div className={styles["exercise-list-container"]} data-testid="ExerciseListItem">
			<div className={styles["exercise-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				<CheckBox checked={added} onClick={onChecked}/>
			
				<Link to={tag.id} data-testid="ExerciseListItem-link" style={{width: "100%"}}>
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						<div style={{display: "flex", alignItems: "center"}}>
							<div style={{width: "10px"}}></div>
							<div className={styles["exercise-list-duration"]} data-testid="ExerciseListItem-text" >
								<p>{tag.name}</p>
							</div>
						</div>
						<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
							
							<Pencil size="25px" color="#BE3B41" onClick={onPencilClicked}/>
							<div style={{width: "10px"}}></div>
							<Trash
								size="25px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}
								onClick={onTrashClicked}
							/>	
						</div>
					</div>
				</Link>
			</div>
		</div>
	)
}
