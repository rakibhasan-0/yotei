import React, { useContext } from "react"
import "./ActivityTimes.css"
import { ActivityInfoDispatchContext, ActivityInfoContext } from "./ActivityInfoContext"
import MinutePicker from "../../Common/MinutePicker/MinutePicker"

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
 * @since 2023-05-04
 */
export default function ActivityTimes({id}) {
	const dispatch = useContext(ActivityInfoDispatchContext)
	const activityInfo = useContext(ActivityInfoContext)

	const minutePickerCallback = (id, time) => {
		dispatch({type: "UPDATE_ACTIVITY_TIME", payload: {id: id, time: time ? time : 0}})
	}

	const components = []
	for (let i = 0; i < activityInfo.activities.length; i++) {
		components.push(
			<li key={i}>
				<div className= "activity-time-list-item">
					<div className={"activity-time-text"}>
						<p className = "activity-time-text-item">{(i+1) < 10 ? 0 :""}{i + 1} </p>
					</div>
					<div className="activity-time-line-container">
						<i className="bi bi-dash-lg"></i>
					</div>
					<MinutePicker id={i} callback={minutePickerCallback} />
				</div>
			</li>

		)
	}
	return <div><ul id ={id} className={"activity-time-list"}>{components}</ul></div>
}