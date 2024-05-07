/**
 * List item for an activity part of a list. Either exercise/technique or free text element.
 *
 * Props:
 *		activity @type {Activity Object} - The activity to be displayed within the item.
 *		index @type {int} - The index (order) of the list item.
 *		id @type {int} - The id of the list item.
 *
 * @author Tomato (Group 6)
 * @since 2024-05-07
 */
import React, { useState } from "react"
import styles from "./SavedListItemComponent.module.css"
import DescriptionToggle from "../../Common/DescriptionToggle"
import { Trash } from "react-bootstrap-icons"

const WorkoutActivityListItem = ({ activity, index, id,edit}) => {
	const [isActive, setIsActive] = useState(false)
	let bgColor = "#ffdfe3"

	const isFreeTextElem = () => {
		return activity.exercise == null && activity.technique == null
	}

	const name = activity.exercise ? (
		<p className={`${styles["workoutActivityName"]} m-0`}>{activity.exercise.name}</p>
	) : (
		<p className={`${styles["workoutActivityName"]} m-0`}>{activity.technique.name}</p>
	)

	const createStripes = () => {
		index % 2 == 0 ? (bgColor = "#F8EBEC") : (bgColor = "#FFFFFF")
	}

	return (
		<div
			id={id}
			className="animate"
			onClick={() => {
				if (!isFreeTextElem() && (activity.exercise?.description || activity.technique?.description)) {
					setIsActive(!isActive)
				}
			}}
		>
			{createStripes()}
			<div
				className={"row align-items-center " + (isActive ? "pt-2 pb-2" : "py-2")}
				key={activity.id}
				style={{
					backgroundColor: bgColor,
				}}
			>
				<div className="col text-left">
					<p className={`${styles["workoutActivityType"]} m-0`}>{name}</p>
					{activity.exercise ? <p className="mb-0">Övning</p> : <p className="mb-0">Teknik</p>}
				</div>

				<div
					className={`${styles["listItemTime"]} d-flex align-items-center justify-content-end col-xs-5 pl-0 text-right`}
				>
					{activity.duration > 1 ? (
						<p className="mb-0">{activity.duration} min </p>
					) : (
						<p className="mb-0"> - </p>
					)}
					{!isFreeTextElem() && (activity.exercise?.description || activity.technique?.description) && (
						<div role="optional-toggle" className="toggleIcon ml-2">
							<DescriptionToggle isActive={isActive} />
						</div>
					)}
					{console.log("Edit: "+edit)}
					{edit==true?
					<div className="pl-3">
						<i onClick={() => {
							workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.OPEN_EDIT_ACTIVITY_POPUP}), 
							workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.SET_CURRENTLY_EDITING, payload: {id: activity.id}})/* Borde detta vara userId? */
						}}>
						<Trash size="20px"	color="var(--red-primary)" id={`edit_pencil_${activity.id}`} style={{cursor: "pointer"}} />
						</i>
					</div>
					: <></>}
				</div>
			</div>
			<div>
				{isActive && (
					<div className="row mb-0" style={{ backgroundColor: bgColor }}>
						<div className="col">
							<p role="description-div" className={styles["textDesc"]}>
								{isFreeTextElem()
									? activity.text
									: activity.exercise
									? activity.exercise.description
									: activity.technique.description}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default WorkoutActivityListItem
