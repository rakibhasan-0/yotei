import styles from "./ActivityListComponent.module.css"
import { Reorder } from "framer-motion"
import { useContext } from "react"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer"
import { List, Pencil } from "react-bootstrap-icons"


/**
 * Creates the UI for an item (Activity) in Activitylist in create workout. 
 * 
 * Props:
 * 	   activityName @type {string} - The name of the activity.
 *     activityTime @type {string}  - The time that the activity has been given.
 *     pinkColor @type {boolean} - Boolean that says if item should be pink or white. 
 * Example usage:
 *     <ActivityListItem 
 *			activityName={"Namn på aktivitet"}
 *			activityTime={"antal minuter"}
 *			pinkColor={true}
 *		/>
 *
 * @author Team Minotaur (Group 8)
 * @since 2023-05-24
 * @version 1.0
 */
function ActivityItem({ activityName, activityTime, pinkColor }) {
	return (
		<div className= {[styles.itemContainer, pinkColor ? styles.pink : ""].join(" ")}>
			<div className={styles.dragAndText}>
				<i><List width="32" height="32" fill="B4B4B4"/></i>
				<p className={styles.text}>{activityName}</p>
			</div>
			<div className={styles.minutesAndEdit}>
				<h2 style={{marginBottom:0}}>{activityTime} min</h2>
				<i><Pencil width="24" height="24" fill="B4B4B4"/></i>
			</div>
		</div>
	)
}

/**
 * Props:
 * 	   categoryName @type {string} - The name of the category.
 * 	   children @type {ReactNode} - The children of the component.
 * 
 * Example usage:
 *	<	ActivityList categoryName={"Namn på kategori"}>
 *		<	ActivityListItem
 *				activityName={"Namn på aktivitet"}
 *				activityTime={"antal minuter"}
 *				pinkColor={true}
 *			/>
 *		<ActivityListItem
 */
function ActivityList({ children, categoryName }) {
	return (
		<div id={1}>
			<fieldset className={styles.listContainer}>
				<legend>
					<div className={styles.legend}>
						<List/>
						<p style={{margin:0}}>{categoryName}</p>
					</div>
				</legend>
				{children}
			</fieldset>
		</div>
	)
}


/**
 * Creates the UI for the ActivityList in create workout.
 * 
 * Example usage:
 *    <ActivityListComponent />
 */
export default function ActivityListComponent() {
	const { workoutCreateInfo, workoutCreateInfoDispatch, } = useContext(WorkoutCreateContext)

	return (
		<div className={styles.container}>
			<h2>Aktiviteter</h2>
			<Reorder.Group 
				values={workoutCreateInfo.data.activityItems} 
				onReorder={(value) => workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.SET_ACTIVITY_ITEMS, activityItems: value})}>
				{workoutCreateInfo.data.activityItems.map((activityItem, index) => (
					<Reorder.Item key={activityItem.id} value={activityItem}>
						<ActivityList categoryName={activityItem.name !== "Ingen kategori" ? activityItem.name : null}>
							<Reorder.Group 
								values={activityItem.activities} 
								onReorder={(value) => workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.SET_ACTIVITIES, id: index, activities: value })}>
								{activityItem.activities.map((activity, index) => (
									<Reorder.Item key={activity.id} value={activity}>
										<ActivityItem 
											activityName={activity.name}
											activityTime={activity.duration}
											pinkColor={(index%2) === 0}
											isEditable={activity.isEditable}
										/>
									</Reorder.Item>
								))}
							</Reorder.Group>
						</ActivityList>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</div>
	)
}