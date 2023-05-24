import React, { useState, useEffect, useContext } from "react"
import { AccountContext } from "../../context"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import Button from "react-bootstrap/Button"
import WorkoutSelectionList from "./WorkoutSelectionList"
import Modal from "react-bootstrap/Modal"

/**
 * This class is responsible for selecting activity
 *
 * @author Kebabpizza (Group 8)
 */
function PlanWorkoutSelection({onClose, onAddClick, workout}) {
	const { token, userId} = useContext(AccountContext)

	const [workouts, setWorkouts] = useState([])
	const [selectedWorkout, setSelectedWorkout] = useState(workout)

	useEffect(() => {
		const requestOptions = {
			headers: {"Content-type": "application/json", token}
		}

		fetch(`/api/workouts/all/${userId}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				setWorkouts(data)
				let allUsernames = []
				// After the workouts are set, get the username of all the authors
				fetch("/api/users", {headers: {token: token}})
					.then(res => res.json())
					.then((data) => {
						allUsernames = data.map(({user_id, username}) => ({user_id, username}))
						allUsernames.forEach(user => {
							let res = workouts.filter(obj => {
								return obj.author === user.user_id
							})
							res.forEach(workout => {
								workout.authorName = user.username
							})
						})
					})
					.catch(console.log)
			})
	}, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

	return (

		<>
			<div className="popup-close-btn-container">
				<Button className="popup-close-btn" onClick={onClose} variant="inline"><img alt="cross" src="/cross.svg" /></Button>
			</div>
			<Modal.Body>
				<Tabs defaultActiveKey="workouts" className="mb-3">
					<Tab eventKey="workouts" title="Pass">
						<WorkoutSelectionList workouts={workouts} radioChanged={ workout => {
							setSelectedWorkout(workout)
						}} />
					</Tab>
				</Tabs>

			</Modal.Body>
			<Button className="select-activity-button" variant="inline" onClick={() => onAddClick(selectedWorkout)}>Välj</Button>
		</>
	)
}

export default PlanWorkoutSelection
