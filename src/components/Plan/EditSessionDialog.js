import React, {useContext, useState} from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { AccountContext } from "../../context"
import TimePicker from "react-time-picker"
import { includeTimeInDate } from "../../pages/Plan/PlanIndex"
import PlanWorkoutSelection from "./PlanWorkoutSelection"

/**
 * Edit session dialog that pops up when pressing edit button that is placed in the dropdown menu of a session
 * @author Group 4 (Calzone) and Group 3(Hawaii)
 */

const EditSessionDialog = ({ session , onChange }) => {

	const handleShow = () => setShow(true)
	const handleClose = () => {
		setShow(false)
		setResetSession(true)
	}
	const handleSave = async () => {
		await editSession()
		setShow(false)
	}

	const [listShown, setListShown] = useState(false)
	const [show, setShow] = useState(false)
	const [newText, setNewText] = useState(session.text)
	const [newTime, setNewTime] = useState(session.time)
	const [newWorkout, setNewWorkout] = useState(session.workoutObj)
	const [resetSession, setResetSession] = useState(true)

	if(resetSession){
		setResetSession(!resetSession)
		setNewWorkout(session.workoutObj)
	}

	const { token } = useContext(AccountContext)

	async function editSession() {
		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", token: token},
			body: JSON.stringify({
				text: newText,
				time : newTime === "" ? null : newTime,
				workout : newWorkout !== undefined ? newWorkout.id : null,
			})
		}
		console.log(requestOptions.body)
		// Send the edit and retrieve response
		const response = await fetch(`/api/session/update?id=${session.id}`, requestOptions)
		const sessionResponse = await response.json()
		includeTimeInDate(sessionResponse)
		onChange(sessionResponse)
	}

	return (
		<div>
			<Modal show={show} onHide={handleClose} dialogClassName="editPlanModal">
				<Modal.Header >
					<Modal.Title>Redigera tillfälle</Modal.Title>
					<Button onClick={handleClose} style={{ color: "gray", borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" }}>
						<i className="bi bi-x-lg"/>
					</Button>
				</Modal.Header>
				<Modal.Body>

					<label className="form-check-label" form="sessionString">
                        Placeholder namn
					</label>
					<Form.Group className="mb-3 formCheck">
						<Form.Control type="select" id ="nameInput" defaultValue={session.text} onChange={(e) => setNewText(e.target.value)}/>
					</Form.Group>


					<label className="form-check-label" form="sessionWorkout" >
                        Befintligt pass
					</label>

					{newWorkout !== undefined && <div className="row">
						<div className="col">
							<input type="text " readOnly className=" planWorkout form-control-plaintext" value={newWorkout.name} />
						</div>
						<Button onClick={() => setNewWorkout(undefined)} style={{ color: "gray", borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" }}>
							<i className="bi bi-trash3-fill text-right trashCanIcon " />
						</Button>
					</div>}



					<div id="getWorkout">
						<Button className="addWorkoutButton" style={{ color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41" }} onClick= {() => setListShown(true)}>
                            + Koppla till pass</Button>
					</div>

					<label> Ändra tid:
						<Form.Group className="mb-3 mr-1 row ">
							<TimePicker 
								disableClock={true}
								locale="sv-SV"
								value={session.time} 
								className="col form -control" 
								type="time" 
								clearIcon={null}
								defaultValue={session.time}  
								onChange={(e) => setNewTime(e)}
							/>

						</Form.Group>
					</label>

					<Modal show={listShown} >
						<PlanWorkoutSelection onClose={() => setListShown(false)} onAddClick={workout => {
							setListShown(false)
							setNewWorkout(workout)
						}} />
					</Modal>



				</Modal.Body>
				<Modal.Footer>
					<Button style={{ color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41" }} onClick={handleSave}>
                        Spara redigerat tillfälle</Button>
					<Button style={{ color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41" }} onClick={handleClose}>
                        Avbryt</Button>
				</Modal.Footer>
			</Modal>
			<i className="bi bi-pencil-fill editSesIcon " onClick={handleShow}> </i>
		</div>

	)
}

export default EditSessionDialog