/* eslint-disable no-unused-vars */
import { useContext, useEffect, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import WorkoutFormComponent from "../../components/Common/List/ListFormComponent.jsx"
import { AccountContext } from "../../context.js"
import { 
	workoutCreateReducer, 
	WorkoutCreateInitialState, 
	WORKOUT_CREATE_TYPES,
} from "../../components/Common/List/ListCreateReducer.js"
import { WorkoutCreateContext } from "../../components/Common/List/ListCreateContext.js"
import styles from "./WorkoutModify.module.css"
import { setSuccess, setError } from "../../utils.js"
import { Spinner } from "react-bootstrap"

/**
 * This is the page for editing a saved workout.
 * 
 * @author Team Minotaur, Team Kiwi, Team Durian (Group 3) (2024-04-23)
 * @version 2.0
 * @since 2023-05-24
 * @updated 2024-04-23 Team Kiwi, Removed blockers and Pop-up for redirecting to technique descriptions
 */
const ListEdit = () => {
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(
		workoutCreateReducer)//,JSON.parse(JSON.stringify(WorkoutCreateInitialState)))
	const navigate = useNavigate()
	const { token, userId } = useContext(AccountContext)
	const location = useLocation()
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)

		const data = parseData(workoutCreateInfo.data)
		const workoutId = await updateWorkout(data)

		if(workoutId) {
			setSuccess("Träningen uppdaterades!")
		} else {
			setError("Träningen kunde inte uppdateras.")
		}
		navigate(-1)
	}

	/**
	 * Parses the data from the workoutCreateInfo state to a format that the API accepts.
	 * 
	 * @param {*} data 
	 * @returns The parsed data.
	 */
	function parseData(data) {
		let totDuration = 0
		data.activityItems.forEach(category => {
			category.activities.forEach(activity=> {
				totDuration += +activity.duration
			})
		})

		let activities = []
		data.activityItems.forEach((category, index) => {
			let categoryOrder = index + 1
			category.activities.forEach((activity, index) => {
				const activityOrder = index + 1

				const obj = {
					categoryName: category.name,
					categoryOrder: categoryOrder,
					name: activity.name,
					desc: activity.description,
					duration: activity.duration,
					order: activityOrder,
				}

				if(activity.technique) {
					obj.techniqueId = activity.technique.id
				} else if (activity.techniqueId) {
					obj.techniqueId = activity.techniqueId
				}

				if(activity.exercise) {
					obj.exerciseId = activity.exercise.id
				} else if (activity.exerciseId) {
					obj.exerciseId = activity.exerciseId
				}


				activities.push(obj)
			})
		})

		// Temp solution
		const date = new Date()
		const todaysDate = date.getFullYear() + "-" + 
				("0" + (date.getMonth()+1)).slice(-2) + "-" + 
				("0" + date.getDate()).slice(-2)
		
		return {
			workout: {
				id: data.id,
				name: data.name,
				desc: data.description,
				created: data.created,
				duration: totDuration,
				date: data.date.length > 0 ? data.date : todaysDate,
				hidden: data.isPrivate,
				author: userId,
			},
			activities,
			users: data.users.map(user => user.userId),
			tagIds: data.tags.map(tag => tag.id),
		}
	}

	/**
	 * Updates the workout in the database.
	 * 
	 * @param {*} body
	 * @returns The id of the updated workout if successfull, otherwise null.
	 */
	async function updateWorkout(body) {
		const requestOptions = {
			method: "PUT",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json", token
			},
			body: JSON.stringify(body)
		}
    
		const response = await fetch("/api/workouts", requestOptions)
		const jsonResp = await response.json()

		return jsonResp.workoutId
	}

	/**
     * Fetches the data from the local storage and context.
     */
	useEffect(() => {
		setIsLoading(true)
		const item = localStorage.getItem("workoutCreateInfoEdit")
		const workoutData = location.state?.workout
		const userData = location.state?.users
		if (workoutData){
			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.INIT_EDIT_DATA,
				payload: { workoutData, userData: userData ? userData : [] }
			})
			window.history.replaceState({}, document.title)
		} else if (item) {
			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.INIT_WITH_DATA,
				payload: JSON.parse(item)
			})
		} else {
			navigate(-1, {replace: true})
		}
		setIsLoading(false)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	
	/**
     * Saves the data to local storage when the user leaves the page.
     * Or removes it if the user has submitted the form.
     */
	useEffect(() => {
		localStorage.setItem("workoutCreateInfoEdit", JSON.stringify(workoutCreateInfo))
		
		return () => {
			if (isSubmitted) localStorage.removeItem("workoutCreateInfoEdit")
		}
	}, [workoutCreateInfo, isSubmitted])
	return (
		<>
			{isLoading ? <Spinner/> :
				<WorkoutCreateContext.Provider value={{workoutCreateInfo, workoutCreateInfoDispatch}} >
					<title>Redigera lista</title>
					<h1 className={styles.title}>Redigera pass</h1>

					<WorkoutFormComponent callback={submitHandler} edit={true} />	

				</WorkoutCreateContext.Provider> 
			}
		</>
	)
}
export default ListEdit
