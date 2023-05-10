import { useContext,useEffect,useState } from "react"
import classes from "./WorkoutEdit.css"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import WorkoutFormComponent from "../../components/Workout/WorkoutFormComponent.js"
import ContainerComponent from "../../components/Common/ContainerComponent"
import { AccountContext } from "../../context"

/**
 * This is the page for editing a saved workout.
 * 
 * Uses the component 'WorkoutFormComponent' for the user form.
 * 
 * @author Team Capricciosa (Group 2), Team Verona (Group 5)
 * 
 */
const WorkoutEdit = () => {

	const navigate = useNavigate()
	const { token, userId } = useContext(AccountContext)
	const location = useLocation()
	let {props} = []

	if (location.state) {
		props = location.state
		console.log(props.workout)
	}

	const [tagdata, setTagData] = useState({
		name: "",
		desc: "",
		tags: [],
		existingTags: [],
		id: -1,
		wait: false,
		errorName: ""
	})

	/**
     * Fetches the data from the API and sets the states.
     */
	useEffect(() => {
		if (props?.workout !== undefined ){
			getWorkoutAndTags()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	if (props?.workout === undefined ){
		return (<Navigate to='/workout' replace={true} />)
	}

	/**
     * Returns todays date, in swedish, standard notation.
     * @returns todays date
     */
	function getTodaysDate(){
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0") 
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}
	/**
     * Fetches the workout that corresponds to the id in the pathname. Also
     * fetches the tags related to the workout. This information is then set
     * in the state.
     */
	async function getWorkoutAndTags() {
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", token },
		}

		let workoutJson
		let filteredTags

		try {
			// Fetch the information for the id and update the state to contain the information for it.
			const response = await fetch(`/api/workouts/workout/${props.workout.id}`, requestOptions)
			workoutJson = await response.json()
		} catch (error) {
			alert("Could not find details about the workout")
			console.log("error", error)
		}

		try {
			const tagsResponse = await fetch("/api/tags/all", requestOptions)
			const allTagsJson = await tagsResponse.json()

			const tagIdResponse = await fetch(`/api/tags/get/tag/by-workout?workId=${props.workout.id}`, requestOptions)
			const tagIdJson = await tagIdResponse.json()
			filteredTags = allTagsJson.filter((tag) => tagIdJson.map(obj => obj.tag).includes(tag.id)).map((tags) => {
				return { label: tags.name, value: tags.id }
			})
		} catch (error) {
			alert("Could not find tags for the workout")
			console.log("error", error)
		}

		setTagData({
			name: workoutJson.name,
			desc: workoutJson.description,
			tags: filteredTags,
			existingTags: filteredTags,
			id: props.workout.id,
			wait: false
		})

	}

	/**
     * Takes in the user input as argument and does a post request
     * with that information to the dabase in order to store it.
     * This function is called when the button for adding new workout
     * is pressed. 
     * 
     * @param {*} valid         boolean - true if user input was
     *                          valid, false otherwise.
     * @param {*} _name         name of the new workout
     * @param {*} _desc         description of the new workout
     * @param {*} _date         date for the new workout (deprecated?)
     * @param {*} _time         time for the new workout (deprecated?)
     * @param {*} _addedUsers   Added users to comment on workout
     * @param {*} _hidden       boolean - true if private,
     * @param {*} _activities    array of all activity objects
     *                          otherwise false
     * @returns 
     */

	async function submitHandler(valid, _name, _desc, _date, _time, _addedUsers, _hidden, _activities, inputTagList){
		if (!valid){
			alert("Error")
			return
		}        

		// Set workoutId to every activity in the draggable list
		_activities.forEach(activity => {
			activity.workoutId = props.workout.id
		})

		updateUserWorkout(_addedUsers)
        
		updateWorkout(_name, _desc, _date, _time, _hidden, _activities, inputTagList)
        
	}

	/**
     * Updates the UserWorkout table with the correct user workout connections. 
     * @param {*} currentUsers The new list of users. 
     */
	async function updateUserWorkout(currentUsers) {
        
		const previousUsers = props.workout.users
        
		// Determine users to remove by difference in previousUsers and currentUsers.
		const usersToRemove = []
		for(let user in previousUsers){
			let found = false
			for(let currentUser in currentUsers){
				if(previousUsers[user].label === currentUsers[currentUser].label){
					found = true
					break
				}
			}
			if(!found)usersToRemove.push(previousUsers[user])
		}

		// Determine users to add by difference in currentUsers and previousUsers.
		const usersToAdd = []
		for(let user in currentUsers){
			let found = false
			for(let currentUser in previousUsers){
				if(currentUsers[user].label === previousUsers[currentUser].label){
					found = true
					break
				}
			}
			if(!found)usersToAdd.push(currentUsers[user])
		}
        
		// Remove user workout connections
		usersToRemove.forEach( async (user) => {
			const requestOptions = {
				method: "DELETE",
				headers: {"Content-type": "application/json", token}
			}
			await fetch(`/api/workouts/remove/workout/${props.workout.id}/user/${user.value}`, requestOptions)
		})
        
		// Add user workout connections
		usersToAdd.forEach(async (user) => {
			const requestOptions = {
				method: "POST",
				headers: {"Content-type": "application/json", token}
			}
			await fetch(`/api/workouts/add/workout/${props.workout.id}/user/${user.value}`, requestOptions)
		})
        

	}

	async function updateWorkout(_name, _desc, _date, _time, _hidden, _activities, inputTagList) {
		// Specifing arguments/data for the api request
		let _duration = _activities.reduce((sum, act) => sum + act.duration, 0)

		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", token},
			body: JSON.stringify({
				workout:{
					id: props.workout.id,
					name: _name, 
					desc: _desc, 
					duration: _duration, 
					created: props.workout.created, 
					changed: getTodaysDate(), 
					date: _date, 
					hidden: _hidden, 
					author: userId
				},
				activities: _activities
			})
		}
    
		const response = await fetch("/api/workouts/update_full_workout", requestOptions)
		// Take user to the created workout.
		await response.json()
		updateTags(inputTagList, props.workout.id).then(() => { navigate(`/workout/${props.workout.id}`) })
	}

	/**
     * Updates the taglist for the workout.
     * 
     * @param {*} inputTagList 
     * @param {*} id 
     * @returns 
     */
	async function updateTags(inputTagList, id) {
		let tag_id = null
		//let tagAddFailed;

		if(inputTagList === undefined) {
			return(alert("Error, tags are undefined"))
		} else if(inputTagList == null) {
			console.log("No tags where entered, returning")
			return
		}

		for (var i = 0; i < inputTagList.length; i++) {

			if (inputTagList[i].__isNew__) {
				const requestOptions = {
					method: "POST",
					headers: { "Content-type": "application/json", "token": token },
					body: JSON.stringify({ name: inputTagList[i].label })
				}
				try {
					const response = await fetch("/api/tags/add", requestOptions)
					if (response.ok) {
						const data = await response.json()
						tag_id = data.id
					} else {
						//tagAddFailed = true;
						setTagData({ errorName: inputTagList.label })

					}
				} catch (error) {
					console.error(error)
					alert("Error at tag insert")
					//tagAddFailed = true;
					setTagData({ errorName: inputTagList[i].label })

				}
			}
			else {
				tag_id = inputTagList[i].value.id
			}
			// Link only if it's a tag that already didn't get linked
			if (!tagdata.existingTags.includes(inputTagList[i])) {
				await linkWorkoutTag(id, tag_id, inputTagList[i].label)
			}
		}

		// Remove tags that are not present anymore
		for (i = 0; i < tagdata.existingTags.length; i++) {
			if (!inputTagList.includes(tagdata.existingTags[i])) {
				await removeTag(id, tagdata.existingTags[i].value, tagdata.existingTags[i].label)
			}
		}
	}

	/**
    * Method for api call when creating a tag.
    * 
    * @returns the id of the exercise that has been created
    */
	async function linkWorkoutTag(work_id, tag_id, tag_name) {
		//let tagLinkFailed;

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": token },
			body: JSON.stringify({ "workId": work_id })
		}
		try {
			const response = await fetch("/api/tags/add/workout?tag=" + tag_id, requestOptions)
			if (response.ok) {
				//tagLinkFailed = false;
			} else {
				//tagLinkFailed = true;
				setTagData({ errorName: tag_name })
			}
		} catch (error) {
			alert("Error at tag link")
			//tagLinkFailed = true;
			setTagData({ errorName: tag_name })
		}
	}

	/**
     * Method to remove a tag from an exercise (does not remove the tag itself).
     * 
     * @param {Workout id} work_id 
     * @param {tag id} tag_id 
     */
	async function removeTag(work_id, tag_id, tag_name){
		//let tagRemoveFailed;

		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json", "token" : token},
			body: JSON.stringify({"workId": work_id})
		}
		try {
			const response = await fetch(`/api/tags/remove/workout?tag=${JSON.stringify(tag_id)}` ,requestOptions)
			if (response.ok) {
				//tagRemoveFailed = false;
			} else {
				//tagRemoveFailed = true;
				setTagData({errorName: tag_name})
				alert("Failed to remove tag")
			}
		} catch(error) {    
			alert("Error when removing tag")
			setTagData({errorName: tag_name})
			//tagRemoveFailed = true;
		}
	}


	return (

		<ContainerComponent>
			<h2 className={classes.margin1}><b>Uppdatera pass</b></h2>
			<h6><small className="text-muted">Senast uppdaterad: {props.workout.changed}</small></h6>

			<div>
				{/* The form for this page is hidden behind this component */}
				<WorkoutFormComponent workout={props.workout} callback={submitHandler}  tags={tagdata.tags}/>
			</div>

		</ContainerComponent>
	)
}

export default WorkoutEdit
