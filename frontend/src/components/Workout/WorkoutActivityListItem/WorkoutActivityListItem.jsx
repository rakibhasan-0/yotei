/**
 * List item for an activity part of a workout. Either exercise/technique or free text element.
 * 
 * Props:
 *		activity @type {Activity Object} - The activity to be displayed within the item.
 *		index @type {int} - The index (order) of the list item.
 *		id @type {int} - The id of the list item.
 *
 * @author KEBABPIZZA (Group 8)
 * @author Cyclops    (Group 5) (2023-05-09)
 * @author Durian     (Group 3) (2024-04-18)
 * @author Tomato	  (Group 6) (2024-04-23)
 * @updated Kiwi      (Group 2) (2024-05-24) Added popups for activities 
 */
import React, { useState } from "react"
import styles from "./WorkoutActivityListItem.module.css"
import { Link } from "react-router-dom"
import PopupMini from "../../Common/Popup/PopupMini"
import TechniqueDetailMini from "../../../pages/Activity/Technique/TechniqueDetail/TechniqueDetailMini"
import ExerciseDetailMini from "../../../pages/Activity/Exercise/ExerciseDetailMini"

const WorkoutActivityListItem = ({ activity, index, id}) => {
	const [isOpen, setIsOpen] = useState(false)
	let bgColor = "#ffdfe3"

	/*
	const isFreeTextElem = () => {
		console.log(activity.id)
		console.log(id)
		return activity.exercise == null && activity.technique == null
	}
	

	const name = 
		activity.exercise ? (
			
			activity.exercise.name
		) : (
		
			activity.technique.name
		)
		*/


	const createStripes = () => {
		index % 2 == 0 ? bgColor = "#F8EBEC" : bgColor = "#FFFFFF"
	}

	const handleClick = () => {
		setIsOpen(true)
	}

	return (
		<>
			{
				activity.technique ?
					<PopupMini title = {activity.name ? activity.name : "hej"} id = "popup-list-item-tech" isOpen = {isOpen} setIsOpen = {setIsOpen} >
						<TechniqueDetailMini id = {activity.id}></TechniqueDetailMini>
					</PopupMini>
					:
					<PopupMini title = {activity.name ? activity.name : "hej"} id = "popup-list-item-exer" isOpen = {isOpen} setIsOpen = {setIsOpen} >
						<ExerciseDetailMini id = {activity.id}></ExerciseDetailMini>
					</PopupMini>	
			}		

			<div id={activity.id} className="animate">
				{createStripes()}
				<div className={"row align-items-center " + "py-2"}  key={activity.id}
					style={{
						backgroundColor: bgColor
					}}>

					<Link role = "link" className="col text-left" onClick = {handleClick}  >
						<h5 className={`${styles["workoutActivityName"]} m-0`}>{activity.name}</h5>
					</Link>
				
					<div className={`${styles["listItemTime"]} d-flex align-items-center justify-content-end col-xs-5 pl-0 text-right`}>
						{activity.duration > 1? (<p className="mb-0">{activity.duration} min </p>
						) : ( <p className="mb-0"> - </p>)
						}
					</div>
					
				</div>
			</div>
		</>
	)
}

export default WorkoutActivityListItem