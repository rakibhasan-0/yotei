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
 */
import React, { useState } from "react"
import "./WorkoutActivityListItem.css"
import { Link } from "react-router-dom"
import DescriptionToggle from "../../Common/DescriptionToggle"

const WorkoutActivityListItem = ({ activity, index, id}) => {
	const [isActive, setIsActive] = useState(false)
	let bgColor = "#ffdfe3"

	const isFreeTextElem = () => {
		return activity.exercise == null && activity.technique == null
	}

	const name = isFreeTextElem() ? (
		<Link className="no-cursor" to={"#"} onClick={(e) => e.preventDefault()}>{activity.name}</Link>
	) : (
		activity.exercise ? (
			<Link to={`/exercise/exercise_page/${activity.exercise.id}`}>{activity.name}</Link>
		) : (
			<Link to={`/technique/technique_page/${activity.technique.id}`}>{activity.name}</Link>
		))

	const createStripes = () => {
		index % 2 == 0 ? bgColor = "#F8EBEC" : bgColor = "#FFFFFF"
	}

	return (
		<div id={id}>
			{createStripes()}
			<div className="row align-items-center py-4" key={activity.id}
				style={{
					backgroundColor: bgColor
				}}>

				<div className="col text-left">
					<h5 className="d-flex align-items-center text-left workout-name">{name}</h5>
				</div>

				
				<div className="listItemTime col text-right">{activity.duration} min</div>
				{
					(!isFreeTextElem() && (activity.exercise?.description || activity.technique?.description))
						? (	
							<div className="toggleIcon pr-2" onClick={() => setIsActive(!isActive)}>
								<DescriptionToggle isActive={isActive} />
							</div>
						)
						: (
							<div className="pr-5"></div> // Empty div to aligne durations
						)
						
				}
			</div>
			<div>
				{isActive && 
					<div className="row pb-3" style={{ backgroundColor: bgColor }}>
						<div className="col">
							<div className="textDesc">{isFreeTextElem() ? activity.text : activity.exercise ? activity.exercise.description : activity.technique.description}</div>
						</div>
					</div>
				}
			</div>
		</div>
	)
}

export default WorkoutActivityListItem