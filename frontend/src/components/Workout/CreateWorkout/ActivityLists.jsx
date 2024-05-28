import InfiniteScrollComponent from "../../Common/List/InfiniteScrollComponent"
import { React, useContext, useState, useEffect } from "react"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import CheckBox from "../../Common/CheckBox/CheckBox"

import DropDown from "../../Common/List/Dropdown"
import ListItem from "./ListItem.jsx"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer"

/**
 * Displays a list of dropdowns with Activity lists. The user can select activities to be added to the workout.
 * @author Team Tomato
 * @since 2024-05-28
 */
export const ActivityLists = ({ lists, fetchingListContent, listContents, setListUpdate, listUpdate }) => {
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)
	const { checkedActivities } = workoutCreateInfo
	const [listCheckboxStatus, setListCheckboxStatus] = useState([false])
	const [listToToggle, setListToToggle] = useState(null)

	// This calls the onAllActivitiesToggle function when the listContents state is updated and runs only when the checkbox to toggle all activities in a list is pressed.
	useEffect(() => {
		if (listToToggle) {
			onAllActivitiesToggle(listToToggle)
			setListToToggle(null) // Reset listToToggle
		}
	}, [listContents])

	const onActivityToggleAllTrue = (listId) => {
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.CHECK_ALL_ACTIVITIES,
			payload: listContents[listId],
		})
	}

	const onActivityToggleAllFalse = (listId) => {
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.UNCHECK_ALL_ACTIVITIES,
			payload: listContents[listId],
		})
	}

	const onAllActivitiesToggle = (listId) => {
		if (!listCheckboxStatus[listId]) {
			onActivityToggleAllFalse(listId)
		} else {
			onActivityToggleAllTrue(listId)
		}
	}

	const onListActivityToggle = (activity, type, isChecked, listId) => {
		activity.type = type

		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.TOGGLE_CHECKED_ACTIVITY, payload: activity })
		updateAllActivitiesListCheckbox(isChecked, listId, activity)
		setListUpdate(listUpdate + 1)
	}

	const updateAllActivitiesListCheckbox = (isChecked, listId, activity) => {
		if (!isChecked) {
			setListCheckboxStatus((prevState) => ({
				...prevState,
				[listId]: false,
			}))
		} else {
			const allChecked = listContents[listId]
				?.filter((item) => item.id !== activity.id)
				.every((item) => {
					if (item.type === "technique" && item.techniqueID !== undefined) {
						return checkedActivities.some((a) => a.techniqueID === item.techniqueID)
					} else if (item.type === "exercise" && item.id !== undefined) {
						return checkedActivities.some((a) => a.id === item.id)
					}

					return false
				})

			if (allChecked) {
				setListCheckboxStatus((prevState) => ({
					...prevState,
					[listId]: true,
				}))
			}
		}
	}
	return (
		<InfiniteScrollComponent activities={lists}>
			{lists.map((list) => {
				const isChecked = !!listCheckboxStatus[list.id]
				return (
					<DropDown
						text={list.name}
						autoClose={false}
						id={list.id}
						onClick={() => fetchingListContent(list.id)}
						key={list.id}
						checkBox={
							<CheckBox
								checked={isChecked}
								onClick={() => {
									fetchingListContent(list.id, () => {
										setListToToggle(list.id)
									})
									setListCheckboxStatus((prevState) => ({
										...prevState,
										[list.id]: !isChecked,
									}))
								}}
							/>
						}
						style={{
							display: "flex",
							alignItems: "center",
							margin: "5px 15px 5px 15px",
						}}
					>
						<div style={{ borderTop: "1px solid black" }}>
							{listContents[list.id]?.map((item, index) => {
								if (item.type === "technique") {
									return (
										<ListItem
											id={index + "-technique-list-item-" + item.techniqueID}
											item={item}
											checkBox={
												<CheckBox
													checked={checkedActivities.some(
														(a) => a.techniqueID === item.techniqueID
													)}
													onClick={(newCheckedState) =>
														onListActivityToggle(
															item,
															"technique",
															newCheckedState,
															list.id
														)
													}
												/>
											}
											key={index}
											index={index}
											popUp={true}
										></ListItem>
									)
								} else if (item.type === "exercise") {
									return (
										<ListItem
											id={item.id}
											item={item}
											checkBox={
												<CheckBox
													checked={checkedActivities.some((a) => a.id === item.id)}
													onClick={(newCheckedState) =>
														onListActivityToggle(item, "exercise", newCheckedState, list.id)
													}
												/>
											}
											key={index}
											index={index}
											popUp={true}
										></ListItem>
									)
								} else {
									return null
								}
							})}
						</div>
					</DropDown>
				)
			})}
		</InfiniteScrollComponent>
	)
}
