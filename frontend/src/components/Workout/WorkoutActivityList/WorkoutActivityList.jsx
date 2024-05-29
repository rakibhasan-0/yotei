/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param categoryName @type {String} - The name of the category 
 * @param activities @type {Array/List} - A list of activities. 
 * @param id @type {String} - Component id
 * 
 * @author G5 Cyclops (2023-05-04)
 * @update G2 Team kiwi (2024-05-23) Removed chevron for description and added popups instead
 * @updated 2024-05-29 Kiwi, Updated props comment.
 */
import WorkoutActivityListItem from "../WorkoutActivityListItem/WorkoutActivityListItem.jsx"
import styles from "./WorkoutActivityList.module.css"

export default function WorkoutActivityList({categoryName, activities, id}) {
	
	return (
		<fieldset className={setPadding(activities.length, categoryName) + " my-3 "} id={id}>
			<legend style={{textAlign: "left"}}>
				<div className="d-flex align-items-center justify-content-center" >
					{categoryName != null && <p className="m-0">{categoryName}</p> }
				</div>
			</legend>
			{sortActivities(activities).map((activity, index) =>
				<WorkoutActivityListItem key={activity.id} activity={activity} index={index}  />)}
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
	return `container ${styles["workout-activity-list"]} ` + paddingY
}