import "./ActivityItem.css"
import {useEffect, useState, useContext} from "react"
import { ActivityInfoDispatchContext } from "./ActivityInfoContext"

export default function ActivityItem({categoryName, id, inputDisabled, text}) {
	const [description, setDescription] = useState("")
	const dispatch = useContext(ActivityInfoDispatchContext)

	function onKeyDown(e){
		e.target.style.height = "inherit"
		e.target.style.height =  `${e.target.scrollHeight}px`
		console.log(e.target.value)
	}

	useEffect(() => {
		const textArea = document.querySelector(`#${"activity-description-" + id} textarea`)
		textArea.style.height = "inherit"
		textArea.style.height =  `${textArea.scrollHeight}px`
	}, [text])

	useEffect(() => {
		if(!inputDisabled){
			dispatch({type: "UPDATE_ACTIVITY_DESCRIPTION", payload: {id, description}})
		}
	}, [description])

	return (
		<fieldset className="container workout-activity-item" id={"activity-description-" + id}>
			{categoryName != null && <legend className="px-2 h3 w-auto">{categoryName}</legend>}
			<textarea 
				className={"activity-item-textArea"} 
				onChange={(e) => setDescription(e.target.value)} 
				onKeyDown={onKeyDown} placeholder={"Fri text ..."} 
				disabled={inputDisabled} 
				value={inputDisabled ? text : description}
			/>
		</fieldset>
	)
}