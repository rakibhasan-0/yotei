import { useContext } from "react"
import classes from "./WorkoutCreate.css"
import { useLocation, useNavigate } from "react-router-dom"
import WorkoutFormComponent from "../../components/Workout/WorkoutFormComponent.js"
import ContainerComponent from "../../components/Common/ContainerComponent"
import { AccountContext } from "../../context"

/**
 * This is the page for creating a new workout
 * 
 * Uses the component 'WorkoutFormComponent'
 * for the user form.
 * 
 * @author Team Kebabpizza (Group 8), Team Verona (Group 5), Team Capricciosa (Group 2)
 * 
 * @version 1.0
 */
const WorkoutCreate = () => {
	const location = useLocation()
	let {props} = []
	if (location.state) {
		props = location.state
	}

	const navigate = useNavigate()
	const { token, userId } = useContext(AccountContext)

	/**
     * Returns todays date, in swedish
     * standard notation
     * @returns todays date
     */
	function getTodaysDate(){
		const today = new Date()
		const dd = String(today.getDate()).padStart(2, "0")
		const mm = String(today.getMonth() + 1).padStart(2, "0") 
		const yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

	/**
     * Takes in the user input as argument and does a post
     * request with that information to the dabase
     * in order to store it.
     * 
     * This function is called when the button
     * for adding new workout is pressed. 
     * 
     * 
     * @param {*} valid         boolean - true if user input was
     *                          valid, false otherwise.
     * @param {*} _name         name of the new workout
     * @param {*} _desc         description of the new workout
     * @param {*} _author       author of the new workout
     * @param {*} _date         date for the new workout (deprecated?)
     * @param {*} _time         time for the new workout (deprecated?)
     * @param {*} _addedUsers   Added users to comment on workout
     * @param {*} _hidden       boolean - true if private,
     * @param {*} activities    array of all activity objects
     *                          otherwise false
     * @returns 
     */

	async function submitHandler(valid, _name, _desc, _date, _time, _addedUsers, _hidden, activities, tags){
		if (!valid){
			alert("Error")
			return
		}
		let duration = activities.reduce((sum, act) => sum + act.duration, 0)
		const workoutId = await addWorkout(_name, _desc, _date, _time, _hidden, duration, activities)
		await addUserWorkouts(workoutId, _addedUsers)
        
		addTag(workoutId, tags).then(() => {navigate(`/workout/${workoutId}`)} )
        
        
	}

	/**
    * Method for api call when creating a user workout connection
    */
	async function addUserWorkouts(workoutId, addedUsers) {
		// Loop for creating userWorkout connections. 
		if(addedUsers !== undefined && addedUsers !== null){
			for (let user of addedUsers) {
				const requestOptionsUserWorkout = {
					method: "POST",
					headers: {"Content-type": "application/json", token},
				}
				await fetch(`/api/workouts/add/workout/${workoutId}/user/${user.value}`, requestOptionsUserWorkout)
			}
		}
	}


	/**
    * Method for api call when creating a tag
    * @returns the id of the workout that has been created
    */
	async function addTag(id,tags) {
		let tagfailed
		let tag_id = null
		// Check if tags should be added
		if (tags === undefined) {
			return alert("Error, no tags defined")
		} else if(tags === null) {
			return
		}
        

		for (let i = 0; i < tags.length; i++) {
			if (tags[i].__isNew__) {
				const requestOptions = {
					method: "POST",
					headers: { "Content-type": "application/json", "token": token },
					body: JSON.stringify({ name: tags[i].label })
				}
				try {
					const response = await fetch("/api/tags/add", requestOptions)
					if (response.ok) {
						const data = await response.json()
						tag_id = data.id
						tagfailed = false
					} else {
						tagfailed = true
					}
				} catch (error) {
					console.log("Error at tag insert")
					tagfailed = true
				}
			} else {
				tag_id = tags[i].value.id
			}
			await linkExerciseTag(id, tag_id)
		}
		return tagfailed
	}

	/**
    * Method for api call when creating a tag
    * @returns the id of the workout that has been created
    */
	async function linkExerciseTag(work_id, tag_id) {
		//let tagfailed;
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": token },
			body: JSON.stringify({ "workId": work_id })
		}

		try {
			const response = await fetch("/api/tags/add/workout?tag=" + tag_id, requestOptions)
			if (response.ok) {
				//tagfailed = false;
			} else {
				//tagfailed = true;
			}
		} catch (error) {
			console.log("Error at tag link")
			//tagfailed = true;
		}
	}

	/**
     * Method for API call when creating a workout, including workout details and activities
     * @param {*} _name Name of the workout
     * @param {*} _desc Workout's description
     * @param {*} _date 
     * @param {*} _time 
     * @param {*} _hidden Visible for unadded users
     * @param {*} _duration Total amount of time for activities
     * @param {*} _activities The activities to add to the workout
     * @returns 
     */
	async function addWorkout(_name, _desc, _date, _time, _hidden, _duration, _activities) {
		const today = getTodaysDate()
        
		// Specifing arguments/data for the api request
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", token},
			body: JSON.stringify({
				workout:{
					name: _name, 
					desc: _desc, 
					duration: _duration, 
					created: today, 
					changed: today, 
					date: _date, 
					hidden: _hidden, 
					author: userId
				},
				activities:_activities
			})
		}

		// The actual api request
		const response = await fetch("/api/workouts/add_full_workout", requestOptions)
		// Take user to the created workout.
		const jsonResp = await response.json()

		return jsonResp.id
	}

	const prefilledWorkout = props ? props.workout : []

	return (
		<ContainerComponent>
			<h2 className={classes.margin1}><b>Skapa pass</b></h2>
			<h6><small className="text-muted">Skapat: {getTodaysDate()}</small></h6>
			<div>
				{/* The form for this page is hidden behind this component */}
				<WorkoutFormComponent workout={prefilledWorkout} callback={submitHandler} />
			</div>
		</ContainerComponent>
	)
}

export default WorkoutCreate
