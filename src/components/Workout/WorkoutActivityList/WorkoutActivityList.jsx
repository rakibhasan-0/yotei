/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param categoryName - The name of the category 
 * @param activities - A list of activities. 
 * @param id - Component id
 * 
 * @author G5 Cyclops (2023-05-04)
 */
import WorkoutActivityListItem from "../WorkoutActivityListItem.js"
import "./WorkoutActivityList.css"

export default function WorkoutActivityList({categoryName, activities, id}) {
	return (
		<fieldset className="mt-5 mb-5 py-2 container workout-activity-list" id={id}>
			{categoryName != null && <legend className="px-2 h3 w-auto">{categoryName}</legend>}
			{
				activities.map((activity, index) => <WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)
			}
		</fieldset>
	)
}