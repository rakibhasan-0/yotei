import { useEffect, useContext, useState } from "react"
import styles from "./ActivityInfoPopUp.module.css"
import Divider from "../../Common/Divider/Divider.jsx"
import Button from "../../Common/Button/Button.jsx"
import { TrashFill } from "react-bootstrap-icons"
import { Plus } from "react-bootstrap-icons"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer"
import RadioButton from "../../Common/RadioButton/RadioButton"
import MinutePicker from "../../Common/MinutePicker/MinutePicker"

/**
 * Component for setting the time for each activity connected to an exercise.
 * 
 * Props:
 * 	   index @type {number} - The index of the activity in the list.
 *     categoryName @type {string}  - The name of the category.
 *     id @type {number} - The id of the activity.
 *     inputDisabled @type {boolean} - Boolean that says if the input should be disabled or not.
 *     text @type {string} - The text that is written in the text area.
 * 
 * Example usage:
 *		<ActivityItem
 *			index={0}
 *			categoryName={"01"}
 *			id={0}
 *			inputDisabled={false}
 *			text={"Namn på aktivitet"}
 *		/>
 */
function ActivityItem({ index, categoryName, id, inputDisabled, text }) {
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)

	// Updates the text area height to fit the text
	useEffect(() => {
		const textArea = document.querySelector(`#${"activity-description-" + id} textarea`)
		textArea.style.height = "inherit"
		textArea.style.height =  `${textArea.scrollHeight}px`
	}, [text, id])

	return (
		<fieldset className={styles.activityItem} id={"activity-description-" + id}>
			{categoryName && <legend>{<h2>{categoryName}</h2>}</legend>}
			<textarea 
				className={styles.activityItemTextArea}
				placeholder="Fri text ..."
				disabled={inputDisabled} 
				onChange={(e) => 
					workoutCreateInfoDispatch({ 
						type: "UPDATE_ACTIVITY_NAME", 
						payload: { index, name: e.target.value }
					})}
				value={workoutCreateInfo.addedActivities[index].name}
				rows={1}
			/>
		</fieldset>
	)
}


/**
 * Component for setting the time for each activity connected to an exercise.
 * 
 * Props:
 *    isFreeText @type {boolean} - Boolean that says if the input should be disabled or not.
 * 
 * Example usage:
 * 		<ActivityList isFreeText={true} />
 */
function ActivityList({ isFreeText }){
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)

	return (
		<div className={styles.activityList}>
			{workoutCreateInfo.addedActivities.map((activity, index) => {
				return (
					<ActivityItem
						categoryName={"Aktivitet " + (index + 1)}
						key={"activity-list-item-" + index}
						id={index}
						index={index}
						inputDisabled={!isFreeText}
						text={activity.name} />
					)
			})}
			{isFreeText && 
				<div className={styles.activityAddButton}>
					<Button 
						id="activity-time-add-button" 
						width={90} 
						onClick={() => workoutCreateInfoDispatch({
							type: "ADD_ACTIVITY", 
							payload: { name: "" }})} >
						<Plus />
					</Button>
				</div>}
		</div>
	)
}


/**
 * Component for setting the time for each activity connected to an exercise.
 * Context will handle the time update.
 *
 * Example usage:
 *		<ActivityTimes />
 */
function ActivityTimes() {
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)
	const { addedActivities } = workoutCreateInfo

	const minutePickerCallback = (id, time) => {
		workoutCreateInfoDispatch({
			type: "UPDATE_ACTIVITY_TIME", 
			payload: { index: id, time: time ? time : 0 }
		})
	}

	return (
		<ul id="ActivityTimes" className={styles.activityTimesList}>
			{addedActivities.map((activity, index) => {
				return (
					<li key={index} className={styles.activityTimesItem}>
						<p className={styles.activityTimeText}>{"Aktivitet " + (index + 1)} </p>
						<i className={["bi", "bi-dash-lg", styles.activityTimeLine].join(" ")}></i>
						<MinutePicker 
							initialValue={activity.duration} 
							id={index} 
							callback={minutePickerCallback} />
					</li>
				)
			})}
		</ul>
	)
}


/**
 * Component for setting the time for each activity connected to an exercise.
 * 
 * Example usage:
 * 		<ActivityTime />
 */
export function ActivityCategories() {
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)
	const [inputValue, setInputValue] = useState("")

	const handleEnter = (event) => {
		if (!workoutCreateInfo.addedCategories.some((c)=>c.name===inputValue) 
			&& inputValue.length > 0
			&& event.key === "Enter") {
			workoutCreateInfoDispatch({type: "ADD_CATEGORY", payload: { name: inputValue }})
			setInputValue("")
			event.preventDefault()
		}
	}

	return (
		<>
			<ul id="ActivityCategories" className={styles.categoryList}>
				{workoutCreateInfo.addedCategories.map((category, index) =>  (
					<li key={`activity-${index}`}>
						<div className={styles.categoryItem}>
							<p className={styles.categoryText}>
								{category.name || "Ingen kategori"}
							</p>
							<RadioButton
								id={"cateogry-radio-" + index}
								onClick={() => workoutCreateInfoDispatch({
									type: "CHECK_CATEGORY", payload: { index }})}
								toggled={workoutCreateInfo.addedCategories[index].checked} />
						</div>
					</li>
				))}
			</ul>
			<div className={styles.categoryListItem}>
				<input
					type="text"
					value={inputValue}
					placeholder="+ Lägg till ny"
					className={styles.categoryInput}
					onKeyDown={handleEnter}
					onChange={(e) => setInputValue(e.target.value)} />
			</div>
		</>
	)
}

/**
 * Component for setting the time for each activity connected to a exercise.
 *
 *
 * Props:
 *     prop1 @id {string}  - Id for the component.
 *     prop2 @activityTimes {list with variables}  - List with variables for the time for each activity.
 *     prop3 @updateTime {list with setters for the variables} - List with setters for the variables containing time.
 *
 * Example usage:
 *		const [time1, updateTime1] = useState("")
 * 		const [time2, updateTime2] = useState("")
 * 		const [time3, updateTime3] = useState("")
 *
 * 		const list1 = [time1, time2, time3]
 * 		const list2 = [updateTime1, updateTime2,updateTime3]
 *
 *		<ActivityTimes activityTimes={list1} activityTimesHandler={list2}></ActivityTimes>
 *
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-24
 */
export default function ActivityInfoPopUp({ isFreeText }) {
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)
	const { addedActivities } = workoutCreateInfo

	// Add empty activity if free text and empty addedActivities
	useEffect(() => {
		if(addedActivities.length === 0 && isFreeText) {
			workoutCreateInfoDispatch({type: "ADD_ACTIVITY", payload: { name: "" }})
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Removes empty activities from addedActivities if free text.
	 */
	const clearEmptyActivities = () => {
		for(let i = 0; i < addedActivities.length; i++) {
			if(addedActivities[i].name === "") {
				workoutCreateInfoDispatch({ 
					type: WORKOUT_CREATE_TYPES.REMOVE_ACTIVITY, 
					payload: { id: addedActivities[i].id }
				})
			}
		}
	}

	const goBack = () => {
		if (isFreeText){
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES })
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_POPUP })
		} else {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_ACIVITY_POPUP })
		}
	}

	const saveActivities = () => {
		if(isFreeText) clearEmptyActivities()
		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CREATE_ACTIVITY_ITEMS, payload: { isFreeText }})
		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_POPUP })
	}

	return (
		<div className={styles.container}>
			<div className={styles.infoContainer}>
				<ActivityList isFreeText={isFreeText} />
				<Divider id="ListTimeDivider" option="h2_left" title="Tid" />
				<ActivityTimes />
				<Divider id="TimesCategoriesDivider" option="h2_left" title="Kategori" />
				<ActivityCategories />
			</div>
			
			<div className={styles.infoButtons}>
				<Button onClick={goBack} outlined={true}><h2>Tillbaka</h2></Button>
				<div className={styles.buttonDivider} />
				<Button onClick={saveActivities}>Lägg till</Button>
			</div>
		</div>
	)
}
