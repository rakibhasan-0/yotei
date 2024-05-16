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
import React, { useState, useContext } from "react"
import styles from "./SavedListItemComponent.module.css"
//Fanns ej i WorkoutActivityListItem.jsx 
import { ListCreateContext } from "../../Common/List/ListCreateContext"
import { LIST_CREATE_TYPES } from "../../Common/List/ListCreateReducer"
import DescriptionToggle from "../../Common/DescriptionToggle"
import { Trash } from "react-bootstrap-icons"

const SavedActivityListItem = ({ activity, index, id,edit}) => {
	//Fanns ej i WorkoutActivityList.jsx
	let listCreateInfo,listCreateInfoDispatch
	if(edit){
		const {listCreateInfo:info, listCreateInfoDispatch:dispatch} = useContext(ListCreateContext)
		listCreateInfo=info;
		listCreateInfoDispatch=dispatch
	}

	//console.log("Testy2")
	//console.log(listCreateInfo)
	const [isActive, setIsActive] = useState(false)
	let bgColor = "#ffdfe3"

	const isFreeTextElem = () => {
		return activity.exercise == null && activity.technique == null
	}
	//In case it is a newly added activity which has not had its technique/excercise info loaded
	const name = activity.name?(
		<p className={`${styles["workoutActivityName"]} m-0`}>{activity.name}</p>
	):
	(activity.exercise ? (
		<p className={`${styles["workoutActivityName"]} m-0`}>{activity.exercise.name}</p>
	) : (
		<p className={`${styles["workoutActivityName"]} m-0`}>{activity.technique.name}</p>
	))
	
	const createStripes = () => {
		index % 2 == 0 ? (bgColor = "#F8EBEC") : (bgColor = "#FFFFFF")
	}

	return (
		<div
			id={id}
			className="animate"
		>
			{createStripes()}
			<div
				className={"row align-items-center " + (isActive ? "pt-2 pb-2" : "py-2")}
				key={activity.id}
				style={{
					backgroundColor: bgColor,
				}}
				onClick={() => {
					if (!isFreeTextElem() && (activity.exercise?.description || activity.technique?.description)) {
						setIsActive(!isActive)
					}
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
					{edit==true?
					<div className="pl-3">
						<i onClick={() => {
							console.log("activity:")
							console.log(activity)
							listCreateInfoDispatch({type: LIST_CREATE_TYPES.REMOVE_ACTIVITY_ITEM, payload: {id: activity.exercise?.id || activity.technique?.id || activity.id}})
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
export default SavedActivityListItem
