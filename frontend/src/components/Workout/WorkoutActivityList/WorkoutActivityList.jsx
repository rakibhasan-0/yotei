/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param categoryName - The name of the category 
 * @param activities - A list of activities. 
 * @param id - Component id
 * 
 * @author G5 Cyclops (2023-05-04)
 */
import WorkoutActivityListItem from "../WorkoutActivityListItem/WorkoutActivityListItem.jsx"
import styles from "./WorkoutActivityList.module.css"
import {useState} from "react"

export default function WorkoutActivityList({categoryName, activities, id}) {
	
	const [isCollapsed, setIsCollapsed] = useState(false)
	
	const rotatedIcon = {
		transform: "rotate(180deg)",
		fontSize: "16px",
		cursor: "pointer"
	}
	return (
		<fieldset className={styles[setPadding(activities.length, categoryName) + " my-3 "]} id={id}>
			<legend style={{textAlign: "left"}}>
				<div className={"d-flex align-items-center justify-content-center"} onClick={() => setIsCollapsed(!isCollapsed)}>
					{categoryName != null && <p className="m-0">{categoryName}</p> }
					<i style={isCollapsed? {fontSize: "16px"} : rotatedIcon} 
						className={categoryName != null ? "ml-2 bi bi-chevron-down" : "bi bi-chevron-down"}/>
				</div>
			</legend>
			{!isCollapsed && sortActivities(activities).map((activity, index) =>
				<WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)}
			{categoryName === null && <div style={{margin:"20px"}}></div>}
		</fieldset>
	)
}

function sortActivities(activities) {
	const  sortedActivites = activities.sort((a, b) => a.order - b.order)
	return sortedActivites
}

function setPadding(length, categoryName) {
	const paddingY = !categoryName ? "py-0" : "pb-3"
	return ["container workout-activity-list "] + paddingY
}