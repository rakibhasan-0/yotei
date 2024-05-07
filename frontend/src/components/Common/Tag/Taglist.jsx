import React from "react"
import { Pencil } from "react-bootstrap-icons"
import styles from "./TagList.module.css"
import { Link } from "react-router-dom"
import { Trash } from "react-bootstrap-icons"
import CheckBox from "../CheckBox/CheckBox"
import MiniPopup from "../MiniPopup/MiniPopup.jsx"

export default function TagList({ tag, index }) {
	return (
		<div className={styles["exercise-list-container"]} data-testid="ExerciseListItem">
			<div className={styles["exercise-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				{tag.tagType=="added" ? <CheckBox checked={true}/> : <CheckBox checked={false}/>}
			
				<Link to={tag.id} data-testid="ExerciseListItem-link" style={{width: "100%"}}>
					<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						<div style={{display: "flex", alignItems: "center"}}>
							<div style={{width: "10px"}}></div>
							<div className={styles["exercise-list-duration"]} data-testid="ExerciseListItem-text" >
								<p>{tag.name}</p>
							</div>
						</div>
						<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
						
							<Pencil size="25px" color="#BE3B41"/>
							<div style={{width: "10px"}}></div>
							<Trash
								size="25px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}
							/>	
						</div>
					</div>
				</Link>
			</div>
		</div>
	)
}
