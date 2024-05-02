import React from "react"
import { List, Pencil } from "react-bootstrap-icons"
import styles from "./TagList.module.css"
import Tag from "./Tag"
import { Link } from "react-router-dom"
import { ChevronRight } from "react-bootstrap-icons"
import { Trash } from "react-bootstrap-icons"
import CheckBox from "../CheckBox/CheckBox"

export default function TagContainer({ item, text, detailURL, id, index}) {
	return (
		<div className={styles["exercise-list-container"]} data-testid="ExerciseListItem">
		<div className={styles["exercise-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
			<CheckBox>
				
			</CheckBox>
			<Link to={detailURL + id} data-testid="ExerciseListItem-link" style={{width: "100%"}}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
					<div style={{display: "flex", alignItems: "center"}}>
						<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="ExerciseListItem-item">{item}</div>
					</div>
					<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
						<div className={styles["exercise-list-duration"]} data-testid="ExerciseListItem-text">
							<p>{text}</p>
						</div>
						<Pencil size="25px" color="#BE3B41"/>
						<div style={{width: '10px'}}></div>
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
	);
  }