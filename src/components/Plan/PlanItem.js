import DescriptionToggle from "../Common/DescriptionToggle"
import React, { useState } from "react"
import DeleteSessionDialog from "./DeleteSessionDialog"
import { useNavigate } from "react-router"
import { PencilSquare } from "react-bootstrap-icons"

/**
 * The component for a ListItem
 * @author Grupp 3 (Hawaii), Grupp 4 (Calzone)
 */
const PlanItem = ({ session , color, onDelete}) => {
	const navigate = useNavigate()
	const [isActive, setIsActive] = useState(false)
	const hasWorkout = !!session.workoutObj
	let bgColor = hasWorkout ? "#ffdfe3" : "#fafafa"

	let timeArr = ""

	if(session.time != null){
		timeArr = session.time.split(":")
	}


	return (
		<div>

			<div className="row planRow"
				style={{
					backgroundColor: bgColor
				}}>
				<svg width="10" height="35" style={{
					fill: color
				}} className="bi bi-circle-fill" viewBox="0 0 16 16"> <circle cx="8" cy="8" r="8" />
				</svg>

				<div className="col text-left listItemName" style={{wordBreak:"break-word"}}>
					{hasWorkout ?
						<a href={"workout/" + session.workout}>
							<p> {session.workoutObj.name} </p>
						</a>
						:
						<p> {session.text} </p>
					}

				</div>
				<div>
					<p className="col text-right listItemTime "> {session.time == null? "" : timeArr[0] + ":" + timeArr[1]} </p>
				</div>

				<div className="toggleIcon" onClick={() => setIsActive(!isActive)}>
					<DescriptionToggle isActive={isActive} />
				</div>
			</div>

			<div>
				{isActive &&
				<div className="row" style={{ backgroundColor: bgColor }}>{hasWorkout && <p>{session.workoutObj.desc}</p>}<div className="col" />
					<DeleteSessionDialog session={session} onDelete={onDelete} />
					<PencilSquare onClick={() => navigate("/session/edit/"+session.id)} />
					{/* <EditSessionDialog session={session} onClick={() => {Navigate("session/edit/"+session.id)}} onDelete={onDelete} /> */}
				</div>
				}
			</div>
		</div>
	)
}

export default PlanItem