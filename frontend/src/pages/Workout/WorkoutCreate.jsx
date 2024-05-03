/* eslint-disable no-unused-vars */
import { useContext, useEffect, useReducer, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import WorkoutFormComponent from "../../components/Workout/CreateWorkout/WorkoutFormComponent.jsx"
import { AccountContext } from "../../context.js"
import { WorkoutCreateContext } from "../../components/Workout/CreateWorkout/WorkoutCreateContext.js"
import {
	WorkoutCreateInitialState,
	workoutCreateReducer,
	WORKOUT_CREATE_TYPES,
	checkIfChangesMade,
} from "../../components/Workout/CreateWorkout/WorkoutCreateReducer.js"
import styles from "./WorkoutModify.module.css"
import { setSuccess, setError, setInfo } from "../../utils.js"
import { unstable_useBlocker as useBlocker } from "react-router-dom"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup.jsx"


/**
 * This is the page for creating a new workout
 * 
 * location.state.props: 
 * 		goBackAfterCreation: @type {boolean} - If true, the user will be redirected to 
 * 							the previous page after creating a workout.
 * 							Otherwise the user is sent to the workoutView page.
 * 
 * @author Team Minotaur, Team 3 Durian, Team Kiwi
 * @version 2.1
 * @since 2023-05-24
 * @updated 2024-04-22 Removed blockers and pop-up window from this component. They are only commented out for now
 */
const WorkoutCreate = () => {
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(
		workoutCreateReducer, JSON.parse(JSON.stringify(WorkoutCreateInitialState)))
	const { token, userId } = useContext(AccountContext)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [hasLoadedData, setHasLoadedData] = useState(false)
	const [goBackPopup, setGoBackPopup] = useState(false)

	const [isBlocking, setIsBlocking] = useState(false)

	const navigate = useNavigate()

	const { state } = useLocation()

	
	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return false
		}
		return false
	})
	

	useEffect(() => {	
		setIsBlocking(checkIfChangesMade(workoutCreateInfo))
	}, [workoutCreateInfo])
	

	/**
	 * Submits the form data to the API.
	 */
	async function submitHandler() {
		setIsSubmitted(true)
		//setIsBlocking(false)
		if (!checkIfChangesMade(workoutCreateInfo)) {
			setInfo("Inget pass sparades.")
			console.log("check")
			return navigate(-1, { replace: true, state })
		}

		const body = parseData(workoutCreateInfo.data)
		const workoutId = await addWorkout(body)

		if (workoutId) {
			setSuccess("Träningspasset skapades!")

			if(state?.fromSession && !state.fromCreate) {
				state.session.workout = body.workout
				state.session.workout.id = workoutId
				return navigate(`/session/edit/${state.session.sessionId}`, { replace: true, state })
			}

			if (state?.session) {
				state.session.workout = body.workout
				state.session.workout.id = workoutId
				return navigate("/session/create", { replace: true, state })
			}
			
			//blocker.proceed()
			navigate("/workout/" + workoutId, {})
		} else {
			setError("Träningspasset kunde inte skapas!")
		}
		//blocker.state = "unblocked"

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
			category.activities.forEach(activity => {
				totalDuration += +activity.duration
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
				} else if (activity.exerciseId) {
					obj.exerciseId = activity.exerciseId
				}

				activities.push(obj)
			})
		})

		// Temp solution
		const date = new Date()
		const todaysDate = date.getFullYear() + "-" +
			("0" + (date.getMonth() + 1)).slice(-2) + "-" +
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

		if (response.status !== 201) {
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
		if (hasLoadedData) localStorage.setItem("workoutCreateInfo", JSON.stringify(workoutCreateInfo))

		return () => {
			if (isSubmitted) localStorage.removeItem("workoutCreateInfo")
		}
	}, [workoutCreateInfo, isSubmitted, hasLoadedData])

	/**
	 * Loads the workoutCreateInfo state from local storage when the component mounts.
	 */
	useEffect(() => {
		const item = localStorage.getItem("workoutCreateInfo")

		if (item) {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.INIT_WITH_DATA, payload: JSON.parse(item) })
		} else {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.SET_INITIAL_STATE })
		}

		setHasLoadedData(true)
	}, [])

	return (
		<WorkoutCreateContext.Provider value={{ workoutCreateInfo, workoutCreateInfoDispatch }} >
			<title>Skapa pass</title>
			<h1 className={styles.title}>Skapa pass</h1>
			<WorkoutFormComponent callback={submitHandler} state={state}/>
			
			{ // Old pop-up window from 2023 
			}
			<ConfirmPopup
				id="TillbakaMiniPopup"
				showPopup={goBackPopup}
				setShowPopup={setGoBackPopup}
				popupText="Är du säker på att du vill gå tillbaka?"
				confirmText="Ja"
				zIndex={1000}
				backText="Avbryt"
				onClick={async () => {
					await workoutCreateInfoDispatch({
						type: WORKOUT_CREATE_TYPES.RESET
					})
					blocker.proceed()
				}}
			/>
		</ WorkoutCreateContext.Provider>
	)
}

export default WorkoutCreate
