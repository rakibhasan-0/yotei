/**
 * List item for an activity part of an workout. Either exercise/technique or free text element
 *
 * @author KEBABPIZZA (Group 8)
 */
import React, { useEffect, useState } from "react"
import "./WorkoutListItem.css"
import { Link } from "react-router-dom"
import DescriptionToggle from "../Common/DescriptionToggle"
import FetchActivityDesc from "../Activity/FetchActivityDesc"

const WorkoutActivityListItem = ({ activity, apiPath, index }) => {
	const [isActive, setIsActive] = useState(false)
	let bgColor = "#ffdfe3"

	const isFreeTextElem = () => {
		return activity.exerciseId === null && activity.techniqueId === null
	}

	useEffect(() => {
		if (isFreeTextElem()) {
			const element = document.getElementById(`textarea-${activity.id}`)
			element.style.cssText = `height:${element.scrollHeight}px`
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const name = isFreeTextElem() ? (
		<textarea id={`textarea-${activity.id}`} className="textarea" readOnly value={activity.name}/>
	) : (
		activity.exerciseId !== null ? (
			<Link to={`/exercise/exercise_page/${activity.exerciseId}`}>{activity.name}</Link>
		) : (
			<Link to={`/technique/technique_page/${activity.techniqueId}`}>{activity.name}</Link>
		))

	const createStripes = () => {
		if (index % 2 === 0) {
			bgColor = "#ffdfe3"
		}
		else {
			bgColor = "#ffffff"
		}
	}

	return (
		<div>
			{createStripes()}
			<div className="row align-items-center py-2" key={activity.id}
				style={{
					backgroundColor: bgColor
				}}>

				<div className="col text-left">
					<h5 className="text-left workout-name">{name}</h5>
				</div>

				<div className="listItemTime col text-right">{activity.duration} min</div>
				{!isFreeTextElem() && (
					<>
						<div className="toggleIcon" onClick={() => setIsActive(!isActive)}>
							<DescriptionToggle isActive={isActive} />
						</div>
					</>
				)}
			</div>
			<div>
				{isActive &&
                    <div className="row pb-3" style={{ backgroundColor: bgColor }}><FetchActivityDesc activity = {activity} apiPath={apiPath}/>
                    </div>
				}
			</div>
		</div>
	)
}

export default WorkoutActivityListItem