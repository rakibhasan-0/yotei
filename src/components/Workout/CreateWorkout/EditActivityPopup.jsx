import React , {useState, useContext, useEffect} from "react"
import Button from "../../Common/Button/Button.jsx"
import Divider from "../../Common/Divider/Divider.jsx"
import MinutePicker from "../../Common/MinutePicker/MinutePicker.jsx"
import {ActivityCategories} from "./ActivityInfoPopUp.jsx"
import { TrashFill } from "react-bootstrap-icons"
import style from "./EditActivityPopup.module.css"
import Textarea from "../../Common/TextArea/TextArea.jsx"
import { WorkoutCreateContext } from "./WorkoutCreateContext.js"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer.js"

/** 
 * EditActivityPopup is a component that can be put inside a popup window, where you can edit an existing
 * activity's name, time and category or choose to delete the activity as a whole.
 * 
 * Needs context to work. Used in ActivityListComponent.
 * 
 * Props:
 *     id @type {string} - Sets the id of the EditActivityPopup. 
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-25
 */
export default function EditActivityPopup({id}) {
	const [newName, setNewName] = useState(null)
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)

	/**
	 * Sets the new name to the text entered in the TextArea.
	 * 
	 * @param {event} e Event for change in the TextArea.
	 */
	const handleTextChange = (e) => {
		activity.name = e.target.value
		setActivity(activity)
		setNewName(e.target.value)
	}

	const minutePickerCallback = (id, time) => {
		activity.duration = time
		setActivity(activity)
	}
	
	const handleRemoveActivity = () => {
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.REMOVE_ACTIVITY_ITEM, payload: {id: workoutCreateInfo.popupState.currentlyEditing}})
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.CLOSE_POPUP})
	}

	const [activity, setActivity] = useState(null)

	useEffect(() => {
		let currentCategoryId = 0
		for (let i = 0; i < workoutCreateInfo.data.activityItems.length; i++) {
			for (let j = 0; j < workoutCreateInfo.data.activityItems[i].activities.length; j++) {
				const element = workoutCreateInfo.data.activityItems[i].activities[j]
				
				if(element.id === workoutCreateInfo.popupState.currentlyEditing) {
					currentCategoryId = workoutCreateInfo.data.activityItems[i].id
					setActivity({...element})
				}
			}
		}
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.CHECK_CATEGORY_BY_ID, payload: {id: currentCategoryId}})
	}, [])

	const handleSaveChanges = () => {
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.UPDATE_ACTIVITY, payload: {activity: activity}})
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.CLOSE_POPUP})
	}

	return (
		<div className={style.popup_wrapper} id = {id}>
			{activity && (<div>
				{activity.isEditable ?
					<>
						<Divider id="name_header" option="h2_left" title="Namn"/>
						<Textarea 
							text={newName == null ? activity.name : newName} 
							onChange={handleTextChange}
						>
						</Textarea>
					</>
					: 
					<>	
						<div className={style.name_container}>
							<div className={style.big_name_container}>
								<Divider id="name_header" option="h2_left" title="Namn (kan inte redigeras)"/>
							</div>
							{/*<div className={style.small_name_container}>
								<Divider id="name_header" option="p_left" title="(Kan inte redigeras)"/>
							</div>*/}
						</div>
						<p className={style.text}>{activity.name}</p>
					</>
				}
				<div className={style.time_header}>
					<Divider id="time_header" option="h2_left" title="Tid"/>
				</div>
				<div className={style.minute_picker}>
					<MinutePicker initialValue={activity.duration} callback={minutePickerCallback} id={workoutCreateInfo.popupState.currentlyEditing}></MinutePicker>
				</div>
				
				<Divider id="category_header" option="h2_left" title="Kategori"/>
				<ActivityCategories id = "edit-activity_categories"></ActivityCategories>
				
			</div>)}
			<div className={style.edit_activity_popup_button_container}>
				<div className={style.delete_button}>
					<Button 
						id="popup_delete_button" 
						outlined={false} 
						onClick={(activity) => {
							activity.id = name
							handleRemoveActivity(activity)
						}}>
						<TrashFill size={30}/>
					</Button>
				</div>
				<Button 
					id="popup_save_button" 
					outlined={false} 
					onClick={()=> {
						handleSaveChanges()
					}}>
					<h2>Spara</h2>
				</Button>
			</div>	
		</div>
	)
}
