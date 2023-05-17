/**
 * Creates the container for the List items. Each item represents a row in the list.
 *
 * @author G3 HAWAII, G8 KEBABPIZZA
 * @param activity The exercise or technique
 * @param apiPath The path to the function (either 'exercises' or 'techniques')
 */
import ListItem from "../Common/ListItem"
import TechniqueCard from "../Common/Technique/TechniqueCard/TechniqueCard"
import WorkoutListItem from "../Workout/WorkoutListItem"
import WorkoutActivityListItem from "../Workout/WorkoutActivityListItem/WorkoutActivityListItem"
import ExerciseCard from "../Common/ExerciseCard/ExerciseListItem"
import "../Common/ExerciseCard/ExerciseListItem"

/** 
 * @deprecated
 */
const ActivityList = ({activities, apiPath, detailURL, favoriteCallback}) => {
	return (
		<div className="container grid-striped activity-list">
			{renderItems()}
		</div>
	)

	function renderItems() {
		const items = activities.map((activity, index) => {
			switch(apiPath) {
			case "workouts":
				return <WorkoutListItem key={index} workout={activity} favoriteCallback={favoriteCallback}/>

			case "workouts/activities":
				return <WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>

			case "techniques":
				return <TechniqueCard key={activity.id} technique={activity} checkBox={false}/>

			case "exercises":
				return <ExerciseCard item={activity.name} text={activity.duration + " min"} key={index} id={activity.id} detailURL={detailURL} index={index}></ExerciseCard>  

			default:
				return <ListItem key={activity.id} activity={activity} apiPath = {apiPath} detailURL={detailURL} index={index}/>
			}
		})
		
		return items
	}
}

export default ActivityList
