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
 */
import React, { useState } from "react"
import styles from "./WorkoutActivityListItem.module.css"
import { Link } from "react-router-dom"
import DescriptionToggle from "../../Common/DescriptionToggle"
import PopupMini from "../../Common/Popup/PopupMini"
import TechniqueDetailMini from "../../../pages/Activity/Technique/TechniqueDetail/TechniqueDetailMini"
import ExerciseDetailMini from "../../../pages/Activity/Exercise/ExerciseDetailMini"

const WorkoutActivityListItem = ({ activity, index, id}) => {
	const [isActive, setIsActive] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	let bgColor = "#ffdfe3"

	console.log(activity)


	const isFreeTextElem = () => {
		return activity.exercise == null && activity.technique == null
	}

	const name = isFreeTextElem() ? (
		<Link className={styles["noCursor"]} to={"#"} onClick={(e) => e.preventDefault()}>{activity.name}</Link>
	) : (
		activity.exercise ? (
			activity.exercise.name
		) : (
			activity.technique.name
		))


	const createStripes = () => {
		index % 2 == 0 ? bgColor = "#F8EBEC" : bgColor = "#FFFFFF"
	}

	const handleClick = () => {
		setIsOpen(true)
		console.log(isOpen)
	}

	return (
		<>
			{
				isFreeTextElem ? (
					activity.name ? 
						<PopupMini title = {name} id = "popup-list-item-exer" isOpen = {isOpen} setIsOpen = {setIsOpen} >
							<TechniqueDetailMini id = {activity.id}></TechniqueDetailMini>
						</PopupMini>
						:
						<PopupMini title = {name} id = "popup-list-item-exer" isOpen = {isOpen} setIsOpen = {setIsOpen} >
							<ExerciseDetailMini id = {activity.id}></ExerciseDetailMini>
						</PopupMini>
				)
					: 
					(
						activity.technique ?
							<PopupMini title = {name} id = "popup-list-item-tech" isOpen = {isOpen} setIsOpen = {setIsOpen} >
								<TechniqueDetailMini id = {activity.technique.id}></TechniqueDetailMini>
							</PopupMini>
							:
							<PopupMini title = {name} id = "popup-list-item-exer" isOpen = {isOpen} setIsOpen = {setIsOpen} >
								<ExerciseDetailMini id = {activity.exercise.id}></ExerciseDetailMini>
							</PopupMini>
					)
			}		

			<div id={id} className="animate">
				{createStripes()}
				<div className={"row align-items-center " + (isActive ? "pt-2 pb-2" : "py-2")}  key={activity.id}
					style={{
						backgroundColor: bgColor
					}}>

					
					<div className="col text-left">
						<Link onClick = {handleClick} >
							<p className={`${styles["workoutActivityName"]} m-0`}>{name}</p>
						</Link>
					</div>
					
					
					<div className={`${styles["listItemTime"]} d-flex align-items-center justify-content-end col-xs-5 pl-0 text-right`}>
						{activity.duration > 1? (<p className="mb-0">{activity.duration} min </p>
						) : ( <p className="mb-0"> - </p>)
						}
						{
							(!isFreeTextElem() && (activity.exercise?.description || activity.technique?.description))
						&&
						(<div role="optional-toggle" className="toggleIcon ml-2" onClick={() => setIsActive(!isActive)}>
							<DescriptionToggle isActive={isActive} />
						</div>)	
						}
					</div>
					
				</div>
				<div>
					{isActive && 
						<div className="row pb-2" style={{ backgroundColor: bgColor }}>
							<div className="col">
								<p role="description-div" className={styles["textDesc"]}>{isFreeTextElem() ? activity.text : activity.exercise ? activity.exercise.description : activity.technique.description}</p>
							</div>
						</div>
					}
				</div>
			</div>
		</>
	)
}

export default WorkoutActivityListItem