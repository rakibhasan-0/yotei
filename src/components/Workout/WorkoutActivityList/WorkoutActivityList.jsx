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
import "./WorkoutActivityList.css"

export default function WorkoutActivityList({categoryName, activities, id}) {
	return (
		<fieldset className={setPadding(activities.length, categoryName)} id={id}>
			{categoryName != null && <legend className="px-2 w-auto"><p className="m-0">{categoryName}</p></legend>}
			{
				sortActivities(activities).map((activity, index) => <WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)
			}
		</fieldset>
	)
}

function sortActivities(activities) {
	const  sortedActivites = activities.sort((a, b) => a.order - b.order)
	return sortedActivites
}

function setPadding(length, categoryName) {
	const paddingY = (length != 1 ? "pt-3" : (!categoryName ? "px-0" : "pt-3"))
	return "container workout-activity-list " + paddingY
}