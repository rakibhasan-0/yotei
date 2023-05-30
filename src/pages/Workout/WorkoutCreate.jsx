import { useContext, useEffect, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import WorkoutFormComponent from "../../components/Workout/CreateWorkout/WorkoutFormComponent.jsx"
import { AccountContext } from "../../context.js"
import { WorkoutCreateContext } from "../../components/Workout/CreateWorkout/WorkoutCreateContext.js"
import { 
	WorkoutCreateInitialState, 
	workoutCreateReducer, 
	WORKOUT_CREATE_TYPES, 
	compareCurrentToOriginal 
} from "../../components/Workout/CreateWorkout/WorkoutCreateReducer.js"
import styles from "./WorkoutModify.module.css"
import { setSuccess, setError, setInfo } from "../../utils.js"


/**
 * This is the page for creating a new workout
 * 
 * location.state.props: 
 * 		goBackAfterCreation: @type {boolean} - If true, the user will be redirected to 
 * 							the previous page after creating a workout.
 * 							Otherwise the user is sent to the workoutView page.
 * 
 * @author Team Minotaur
 * @version 2.0
 * @since 2023-05-24
 */
const WorkoutCreate = () => {
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(
		workoutCreateReducer, JSON.parse(JSON.stringify(WorkoutCreateInitialState)))
	const { token, userId } = useContext(AccountContext)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const navigate = useNavigate()

	const location = useLocation()

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler(){
		setIsSubmitted(true)

		if(compareCurrentToOriginal(workoutCreateInfo.data, workoutCreateInfo.originalData)) {
			setInfo("Inget pass sparades.")
			return navigate("/workout", { replace: true })
		}

		const body = parseData(workoutCreateInfo.data)
		const workoutId = await addWorkout(body)

		if (workoutId) {
			setSuccess("Träningspasset skapades!")

			if(location.state?.goBackAfterCreation) return navigate(-1, { replace: true })
			navigate("/workout/" + workoutId, { replace: true })
		} else {
			setError("Träningspasset kunde inte skapas!")
		}

	}

	/**
	 * Parses the data from the workoutCreateInfo state to a format that the API accepts.
	 * 
	 * @param {*} data 
	 * @returns The parsed data.
	 */
	function parseData(data) {
		let totalDuration = 0
		data.activityItems.forEach(category => {
			category.activities.forEach(activity=> {
				totalDuration += activity.duration
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

				if (activity.techniqueId) {
					obj.techniqueId = activity.techniqueId
				} else if (activity.exerciseId){
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
				name: data.name,
				desc: data.description,
				duration: totalDuration,
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
	 * Adds a workout to the database.
	 * 
	 * @param {*} body 
	 * @returns The id of the created workout if successfull, otherwise null.
	 */
	async function addWorkout(body) {
		const requestOptions = {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json", token
			},
			body: JSON.stringify(body)
		}

		const response = await fetch("/api/workouts", requestOptions)
		
		if(response.status !== 201) {
			return null
		} else {
			const jsonResp = await response.json()
			return jsonResp.workoutId
		}
	}

	/**
	 * Saves the workoutCreateInfo state to local storage when the component unmounts.
	 * If the form was submitted, the data is removed from local storage.
	 */
	useEffect(() => {
		localStorage.setItem("workoutCreateInfo", JSON.stringify(workoutCreateInfo))

		return () => {
			if(isSubmitted) {
				localStorage.removeItem("workoutCreateInfo")
			}
		}
	}, [workoutCreateInfo, isSubmitted])

	/**
	 * Loads the workoutCreateInfo state from local storage when the component mounts.
	 */
	useEffect(() => {
		const item = localStorage.getItem("workoutCreateInfo")

		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.INIT, 
			payload: item ? JSON.parse(item) : WorkoutCreateInitialState
		})
	}, [])

	return (
		<WorkoutCreateContext.Provider value={{ workoutCreateInfo, workoutCreateInfoDispatch }} >
			<h1 className={styles.title}>Skapa pass</h1>
			<WorkoutFormComponent callback={submitHandler} />
		</WorkoutCreateContext.Provider>
	)
}

export default WorkoutCreate
