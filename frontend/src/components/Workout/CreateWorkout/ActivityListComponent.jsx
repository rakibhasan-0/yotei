import styles from "./ActivityListComponent.module.css"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useContext } from "react"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer"
import { List, Pencil } from "react-bootstrap-icons"

/**
 * Creates the UI for the ActivityList in create workout.
 *
 * Example usage:
 *    <ActivityListComponent />
 *
 * @author Team Minotaur (Group 8)
 * @since 2023-05-24
 * @version 1.0
 */
export default function ActivityListComponent() {
	const { workoutCreateInfo, workoutCreateInfoDispatch } =
		useContext(WorkoutCreateContext)

	const handleDragEnd = (result) => {
		const { source, destination } = result

		if (!destination) {
			return
		}

		const sourceType = source.droppableId.startsWith("group") ? "group" : "activity"
		const destinationType = destination.droppableId.startsWith("group") ? "group" : "activity"

		if (sourceType === "group" && destinationType === "group") {
			const sourceIndex = source.index
			const destinationIndex = destination.index
			if (sourceIndex === destinationIndex) {
				return
			}

			const groups = [...workoutCreateInfo.data.activityItems]
			const [draggedGroup] = groups.splice(sourceIndex, 1)
			groups.splice(destinationIndex, 0, draggedGroup)
			const updatedGroups = groups.map((group) => ({
				...group,
				id: group.id, // Assign a unique ID based on the index
			}))

			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.SET_ACTIVITY_ITEMS,
				activityItems: updatedGroups,
			})
		} else if (sourceType === "activity" && destinationType === "activity") {
			const sourceGroupId = parseInt(source.droppableId.replace("activityGroup", ""))
			const destinationGroupId = parseInt(destination.droppableId.replace("activityGroup", ""))
			const sourceIndex = source.index
			const destinationIndex = destination.index

			if (sourceGroupId === destinationGroupId && sourceIndex === destinationIndex) return

			const groups = [...workoutCreateInfo.data.activityItems]
			const sourceGroup = groups.find(group => group.id === sourceGroupId)
			const [draggedActivity] = sourceGroup.activities.splice(sourceIndex, 1)

			const destinationGroup = groups.find(group => group.id === destinationGroupId)
			destinationGroup.activities.splice(destinationIndex, 0, draggedActivity)

			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.SET_ACTIVITY_ITEMS,
				activityItems: groups,
			})
		}
	}

	return (
		<div className={styles.container}>
			<h2>Aktiviteter</h2>

			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="groups" direction="vertical" type="group">
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{workoutCreateInfo.data.activityItems.map((activityItem, groupIndex) => (
								<ActivityList 
									categoryName={activityItem.name !== "Ingen kategori" ? activityItem.name : null}
									key={activityItem.id}
									id={activityItem.id}
									groupIndex={groupIndex}>
									{activityItem.activities.map((activity, itemIndex) => (
										<ActivityItem
											key={activity.id}
											activityName={activity.technique?.name || activity.exercise?.name || activity.name}
											activityTime={activity.duration}
											pinkColor={itemIndex % 2 === 0}
											isEditable={activity.isEditable}
											id={activity.id}
											itemIndex={itemIndex}
										/>
									))}
								</ActivityList>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
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
function ActivityList({ children, categoryName, groupIndex, id }) {
	return (
		<Draggable
			key={id}
			draggableId={`group${id}`}
			index={groupIndex} >
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps} >
					<fieldset className={[
						styles.listContainer,
						snapshot.isDragging ? styles.listDragging : ""
					].join(" ")} >
						<legend>
							<div className={styles.legend} {...provided.dragHandleProps}>
								<List width="24px" height="24px"/>
								<p style={{ margin: 0 }}>{categoryName}</p>
							</div>
						</legend>
						<Droppable droppableId={`activityGroup${id}`} direction="vertical" type="activity">
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									{children}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</fieldset>
				</div>
			)}
		</Draggable>
	)
}

/**
 * Creates the UI for an item (Activity) in Activitylist in create workout.
 *
 * Props:
 * 	   activityName @type {string} - The name of the activity.
 *     activityTime @type {string}  - The time that the activity has been given.
 *     pinkColor @type {boolean} - Boolean that says if item should be pink or white.
 *	   id @type {num} - id of the activity.
 *
 * Example usage:
 *     <ActivityListItem
 *			activityName={"Namn på aktivitet"}
 *			activityTime={"antal minuter"}
 *			pinkColor={true}
 *		/>
 */
function ActivityItem({ activityName, activityTime, pinkColor, id, itemIndex}) {
	const { workoutCreateInfoDispatch, } = useContext(WorkoutCreateContext)
	return (
		<Draggable
			key={id}
			draggableId={`activity${id}`}
			index={itemIndex} >
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps} >
					<div
						className={[
							styles.itemContainer,
							snapshot.isDragging ? styles.itemDragging : "",
							pinkColor ? styles.pink : ""
						].join(" ")} >
						<div className={styles.dragAndText}>
							<i {...provided.dragHandleProps}>
								<List width="24" height="24" fill="B4B4B4" />
							</i>
							<p className={styles.text}>{activityName.trim()}</p>
						</div>
						<div className={styles.minutesAndEdit}>
							<p style={{ marginBottom: 0 }}><b>{activityTime} min</b></p>
							<i onClick={() => {
								workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.OPEN_EDIT_ACTIVITY_POPUP}), 
								workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.SET_CURRENTLY_EDITING, payload: {id: id}})
							}}>
								<Pencil size="20px"	color="var(--red-primary)" style={{cursor: "pointer"}} />
							</i>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	)
}
