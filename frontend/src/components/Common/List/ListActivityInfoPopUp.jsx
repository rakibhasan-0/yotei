//Commented due to linter
//import { useEffect, useContext, useState } from "react"
import { useEffect, useContext } from "react"
import styles from "./ListActivityInfoPopUp.module.css"
import Divider from "../../Common/Divider/Divider.jsx"
import Button from "../../Common/Button/Button.jsx"
import { ListCreateContext } from "./ListCreateContext"
import { LIST_CREATE_TYPES } from "./ListCreateReducer"
import MinutePicker from "../../Common/MinutePicker/MinutePicker"

/**
 * Component for setting the time for each activity connected to an exercise.
 *
 * Props:
 * 	   index @type {number} - The index of the activity in the list.
 *     activityName @type {string}  - The name of the activity.
 *     id @type {number} - The id of the activity.
 *     text @type {string} - The text that is written in the text area.
 *
 * Example usage:
 *		<ActivityItem
 *			index={0}
 *			activityName={"01"}
 *			id={0}
 *			text={"Namn på aktivitet"}
 *		/>
 */
function ActivityItem({ index, activityName, id, text }) {
	const { listCreateInfo} = useContext(ListCreateContext)

	// Updates the text area height to fit the text
	useEffect(() => {
		const textArea = document.querySelector(`#${"activity-description-" + id} textarea`)
		textArea.style.height = "inherit"
		textArea.style.height = `${textArea.scrollHeight}px`
	}, [text, id])

	return (
		<fieldset className={styles.activityItem} id={"activity-description-" + id}>
			{activityName && <legend>{<h2>{activityName}</h2>}</legend>}
			<textarea
				disabled={true}
				className={styles.activityItemTextArea}
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
function ActivityList() {
	const { listCreateInfo } = useContext(ListCreateContext)

	return (
		<div className={styles.activityList}>
			{listCreateInfo.addedActivities.map((activity, index) => {
				return (
					<ActivityItem
						activityName={"Aktivitet " + (index + 1)}
						key={"activity-list-item-" + index}
						id={index}
						index={index}
						text={activity.name}
					/>
				)
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
			payload: { index: id, time: time ? time : 0 },
		})
	}

	return (
		<ul id="ActivityTimes" className={styles.activityTimesList}>
			{addedActivities.map((activity, index) => {
				return (
					<li key={index} className={styles.activityTimesItem}>
						<p className={styles.activityTimeText}>{"Aktivitet " + (index + 1)} </p>
						<i className={["bi", "bi-dash-lg", styles.activityTimeLine].join(" ")}></i>
						<MinutePicker initialValue={activity.duration} id={index} callback={minutePickerCallback} />
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
 * @author Team Tomato (6)
 * @since 2024-05-21
 * Based on ActivityInfoPopUp
 */
export default function ActivityInfoPopUp() {
	const { listCreateInfoDispatch } = useContext(ListCreateContext)

	const goBack = () => {
		listCreateInfoDispatch({ type: LIST_CREATE_TYPES.CLOSE_ACIVITY_POPUP })
	}

	const saveActivities = () => {
		listCreateInfoDispatch({ type: LIST_CREATE_TYPES.CREATE_ACTIVITY_ITEMS, payload: {} })
		listCreateInfoDispatch({ type: LIST_CREATE_TYPES.CLOSE_POPUP })
	}

	return (
		<div className={styles.container}>
			<div className={styles.infoContainer}>
				<ActivityList />
				<Divider id="ListTimeDivider" option="h2_left" title="Tid" />
				<ActivityTimes />
			</div>

			<div className={styles.infoButtons}>
				<Button onClick={goBack} outlined={true}>
					<h2>Tillbaka</h2>
				</Button>
				<div className={styles.buttonDivider} />
				<Button onClick={saveActivities}>Lägg till</Button>
			</div>
		</div>
	)
}
