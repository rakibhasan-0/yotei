import React, { useEffect, useState, useReducer } from "react"

import "./ActivityInfoPopUp.css"
import Popup from "../../Common/Popup/Popup.jsx"
import ActivityItem from "./ActivityItem.jsx"
import Divider from "../../Common/Divider/Divider.jsx"
import ActivityTimes from "./ActivityTimes.jsx"
import ActivityCategories from "./ActivityCategories.jsx"
import Button from "../../Common/Button/Button.jsx"
import { Plus } from "react-bootstrap-icons"
import { ActivityInfoContext, ActivityInfoDispatchContext, activityReducer } from "./ActivityInfoContext"

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
export default function ActivityInfoPopUp({categories, activities, addPressed, tempClose}) {
	const [isFreeText, setIsFreeText] = useState(false)
	const [showPopup, setShowPopup] = useState(true)
	const [activityInfo, activityInfoDispatch] = useReducer(activityReducer, {
		activities,
		categories,
		chosenCategory: ""
	})

	useEffect(() => {
		if(activities.length === 0) setIsFreeText(true)
	}, [])

	useEffect(() => {
		if(isFreeText && activityInfo.activities.length === 0) {
			activityInfoDispatch({type: "ADD_ACTIVITIY", payload: ""})
		}
	}, [isFreeText, activityInfo])

	return (
		<ActivityInfoContext.Provider value={activityInfo}>
			<ActivityInfoDispatchContext.Provider value={activityInfoDispatch}>
				<div>
					<Popup id={"test-popup"} title={"Aktiviteter"} isOpen={showPopup} setIsOpen={(bool) => {
						setShowPopup(bool)
						tempClose()
					}} >
						<div className="acitvity-info-activity-list">
							{activityInfo.activities.map((activity, i) => {
								return (
									<ActivityItem
										categoryName={i < 9 ? "0" + (i + 1) : i + 1}
										key={"activity-key" + i}
										id={i}
										inputDisabled={!isFreeText}
										/* TEMP FIX, WAS ACTIVITY.DESCRIPTION BEFORE */
										text={activity.name} />)
							})}
							{isFreeText && 
								<div className="activity-time-add-activity-button">
									<Button id="activity-time-add-button" onClick={() => activityInfoDispatch({type: "ADD_ACTIVITIY", payload: ""})}>
										<Plus size="2em" />
									</Button>
								</div>}
						</div>
						<Divider className="heading" id="Tillagdar" option="h1_left" title="Tid" />
						<ActivityTimes id={"activity-time-1"}></ActivityTimes>
						<Divider className="heading" id="Tillagdar" option="h1_left" title="Kategori" />
						<ActivityCategories id="10"></ActivityCategories>

						<div className="activity-info-btns">
							<Button onClick={() => tempClose()} outlined={true}>Tillbaka</Button>
							<div className="acitvitiy-info-button-divider" />
							<Button onClick={() => addPressed(activityInfo)}>Lägg till</Button>
						</div>

					</Popup>
				</div>
			</ActivityInfoDispatchContext.Provider>
		</ActivityInfoContext.Provider>
	)
}
