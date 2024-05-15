import { useEffect, useContext, useState } from "react"
import styles from "./ListActivityInfoPopUp.module.css"
import Divider from "../../Common/Divider/Divider.jsx"
import Button from "../../Common/Button/Button.jsx"
import { Plus } from "react-bootstrap-icons"
import { ListCreateContext } from "./ListCreateContext"
import { WORKOUT_CREATE_TYPES } from "./ListCreateReducer"
import RadioButton from "../../Common/RadioButton/RadioButton"
import MinutePicker from "../../Common/MinutePicker/MinutePicker"

/**
 * Component for setting the time for each activity connected to an exercise.
 * 
 * Props:
 * 	   index @type {number} - The index of the activity in the list.
 *     categoryName @type {string}  - The name of the category.
 *     id @type {number} - The id of the activity.
 *     text @type {string} - The text that is written in the text area.
 * 
 * Example usage:
 *		<ActivityItem
 *			index={0}
 *			categoryName={"01"}
 *			id={0}
 *			text={"Namn på aktivitet"}
 *		/>
 */
function ActivityItem({ index, categoryName, id, text }) {
	const { listCreateInfo, listCreateInfoDispatch } = useContext(ListCreateContext)
	console.log("HATAR")
	console.log(useContext(ListCreateContext))

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
				onChange={(e) => 
					listCreateInfoDispatch({ 
						type: "UPDATE_ACTIVITY_NAME", 
						payload: { index, name: e.target.value }
					})}
				value={listCreateInfo.addedActivities[index].name}
				rows={1}
			/>
		</fieldset>
	)
}


/**
 * Component for setting the time for each activity connected to an exercise.
 * 
 * Example usage:
 * 		<ActivityList/>
 */
function ActivityList(){
	const { listCreateInfo, listCreateInfoDispatch } = useContext(ListCreateContext)

	return (
		<div className={styles.activityList}>
			{listCreateInfo.addedActivities.map((activity, index) => {
				return (
					<ActivityItem
						categoryName={"Aktivitet " + (index + 1)}
						key={"activity-list-item-" + index}
						id={index}
						index={index}
						text={activity.name} />)
			})}
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
	const { listCreateInfo, listCreateInfoDispatch } = useContext(ListCreateContext)
	const { addedActivities } = listCreateInfo

	const minutePickerCallback = (id, time) => {
		listCreateInfoDispatch({
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
export default function ActivityInfoPopUp() {
	const { listCreateInfo, listCreateInfoDispatch } = useContext(ListCreateContext)
	const { addedActivities } = listCreateInfo

	/**
	 * Removes empty activities from addedActivities if free text.
	 */
	const clearEmptyActivities = () => {
		for(let i = 0; i < addedActivities.length; i++) {
			if(addedActivities[i].name === "") {
				listCreateInfoDispatch({ 
					type: WORKOUT_CREATE_TYPES.REMOVE_ACTIVITY, 
					payload: { id: addedActivities[i].id }
				})
			}
		}
	}

	const goBack = () => {
		listCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_ACIVITY_POPUP })
	}

	const saveActivities = () => {
		listCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CREATE_ACTIVITY_ITEMS, payload: {}})
		{console.log("Breakpoint 1")}
		listCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_POPUP })
	}

	return (
		<div className={styles.container}>
			<div className={styles.infoContainer}>
				<ActivityList/>
				<Divider id="ListTimeDivider" option="h2_left" title="Tid" />
				<ActivityTimes />
			</div>
			
			<div className={styles.infoButtons}>
				<Button onClick={goBack} outlined={true}><h2>Tillbaka</h2></Button>
				<div className={styles.buttonDivider} />
				<Button onClick={saveActivities}>Lägg till</Button>
			</div>
		</div>
	)
}
