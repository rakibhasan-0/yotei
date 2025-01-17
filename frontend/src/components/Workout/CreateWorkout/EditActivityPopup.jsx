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
	const [activity, setActivity] = useState(null)
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)

	useEffect(() => {
		if (activity) workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.UPDATE_EDITING_ACTIVITY, payload: activity})
	}, [activity, workoutCreateInfoDispatch])

	/**
	 * Sets the new name to the text entered in the TextArea.
	 * 
	 * @param {event} e Event for change in the TextArea.
	 */
	const handleTextChange = (e) => {
		setActivity(prev => ({...prev, name: e.target.value}))
		setNewName(e.target.value)
	}

	const minutePickerCallback = (id, time) => {
		setActivity(prev => ({...prev, duration: time}))
	}
	
	const handleRemoveActivity = () => {
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.REMOVE_ACTIVITY_ITEM, payload: {id: workoutCreateInfo.popupState.currentlyEditing.id}})
		workoutCreateInfoDispatch({type: WORKOUT_CREATE_TYPES.CLOSE_POPUP})
	}


	useEffect(() => {
		let currentCategoryId = 0
		for (let i = 0; i < workoutCreateInfo.data.activityItems.length; i++) {
			for (let j = 0; j < workoutCreateInfo.data.activityItems[i].activities.length; j++) {
				const element = workoutCreateInfo.data.activityItems[i].activities[j]
				
				if(element.id === workoutCreateInfo.popupState.currentlyEditing.id) {
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
							<h2>Namn</h2>
							<p>{"(Kan inte redigeras)"}</p>
						</div>
						<p className={style.text}>{activity.technique?.name || activity.exercise?.name || activity.name}</p>
					</>
				}
				<div className={style.time_header}>
					<Divider id="time_header" option="h2_left" title="Tid"/>
				</div>
				<div className={style.minute_picker}>
					<MinutePicker initialValue={activity.duration} callback={minutePickerCallback} id={workoutCreateInfo.popupState.currentlyEditing.id} />
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
					onClick={()=> handleSaveChanges()}>
					<h2>Spara</h2>
				</Button>
			</div>	
		</div>
	)
}
