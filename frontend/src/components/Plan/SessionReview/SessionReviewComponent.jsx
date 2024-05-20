import React, { useEffect } from "react"
import { useState, useContext, useReducer } from "react"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import TextArea from "../../Common/TextArea/TextArea"
import Divider from "../../Common/Divider/Divider"
import CheckBox from "../../Common/CheckBox/CheckBox"
import styles from "./SessionReviewComponent.module.css"
import { HTTP_STATUS_CODES, setError, setSuccess } from "../../../utils"
import { AccountContext } from "../../../context"
import AddActivity from "../../Workout/CreateWorkout/AddActivity"
import {
	workoutCreateReducer,
	WorkoutCreateInitialState,
} from "../../Workout/CreateWorkout/WorkoutCreateReducer"
import { WorkoutCreateContext } from "../../Workout/CreateWorkout/WorkoutCreateContext"
import { WORKOUT_CREATE_TYPES } from "../../Workout/CreateWorkout/WorkoutCreateReducer"
import ActivityInfoPopUp from "../../Workout/CreateWorkout/ActivityInfoPopUp"

/**
 * Review component for an individual session.
 * A session can have one review on it, filled in by the trainer
 * The review can be seen and edited through the plan window
 * Based on "ReviewFormComponent.jsx"
 *
 * @author Hannes c21hhn (Group 1, pomegranate), Team Coconut
 * @since 2024-05-20
 * @version 1.1
 */

export default function Review({id, isOpen, setIsOpen, session_id, workout_id}) {

	const [sessionData, setSessionData] = useState(null)

	const[rating, setRating] = useState(0)
	const[doneList, setDone] = useState([])
	const[positiveComment, setPositiveComment] = useState("")
	const[negativeComment, setNegativeComment] = useState("")
	const[savedDate, setSavedDate] = useState("")
	const[reviewId, setReviewId] = useState(-1)

	const [, setErrorStateMsg] = useState("")

	//const [loading, setLoading] = useState(true)

	const context = useContext(AccountContext)

	const {token, userId} = context

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}

			const response = await fetch(`/api/workouts/detail/${workout_id}`, requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				//setLoading(false)
				return
			})

			if(response.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Pass med ID '" + workout_id + "' existerar inte. Felkod: " + response.status)
				//setLoading(false)
			} else {
				const json = await response.json()
				//console.log(json)
				setSessionData(() => json)
				//setLoading(false)
				setErrorStateMsg("")
			}
		}

		const fetchLoadedData = async() => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token },
			}

			const loadedResponse = await fetch("/api/session/" + session_id + "/review/all", requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				//setLoading(false)
				return
			})

			if(loadedResponse.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Session med ID '" + session_id + "' existerar inte. Felkod: " + loadedResponse.status)
				//setLoading(false)
			} else {
				const json = await loadedResponse.json()
				//console.log(session_id)
				if(json[0] !== null && json[0] !== undefined) {
					//console.log(json[0])
					setDoneActivities(json[0]["activities"])
					setRating(json[0]["rating"])
					setPositiveComment(json[0]["positiveComment"])
					setNegativeComment(json[0]["negativeComment"])
					setReviewId(json[0]["id"])
					setSavedDate(json[0]["date"])
				}
			}
		}

		fetchData()
		fetchLoadedData()
	}, [])

	function setDoneActivities(activities) {
		setDone(prevDoneList => {
			const updatedDoneList = [...prevDoneList]
			for (let i = 0; i < activities.length; i++) {
				updatedDoneList.push(activities[i]["activity_id"])
			}
			return updatedDoneList
		})
	}



	function handleCheckBoxChange (checked, id) {
		if(checked) { //Add exercise
			setDone([...doneList,id])
		} else { //Remove exercise
			setDone(doneList.filter(doneId=>doneId !== id))
		}
	}

	function handleChangePositive(event) {
		setPositiveComment(event.target.value)
	}

	function handleChangeNegative(event) {
		setNegativeComment(event.target.value)
	}

	async function saveReview() {
		if(rating === 0) {
			setError("Kunde inte spara utvärdering, vänligen sätt ett betyg")
			return
		}
		console.log(doneList)
		//console.log("Review id: " + reviewId)
		if(reviewId < 0) {
			addReview()
		} else {
			updateReview()
		}
	}

	async function addReview() {
		let ts = getTodaysDate()
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"rating": rating,
				"userId": userId,
				"positiveComment": positiveComment,
				"negativeComment": negativeComment,
				"date": ts
			})
		}

		const postResponse = await fetch("/api/session/" + session_id + "/review", requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern.")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}

		const requestOptions2 = {
			headers: { "Content-type": "application/json", token: context.token },
		}

		const loadedResponse = await fetch("/api/session/" + session_id + "/review/all", requestOptions2).catch(() => {
			setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
			//setLoading(false)
			return
		})

		if(loadedResponse.status != HTTP_STATUS_CODES.OK){
			setErrorStateMsg("Session med ID '" + session_id + "' existerar inte. Felkod: " + loadedResponse.status)
			//setLoading(false)
		} else {
			const json = await loadedResponse.json()
			if(json[0] !== null && json[0] !== undefined) {
				setReviewId(json[0]["id"])
				clearActivities(json[0]["id"], session_id)
				for(let i = 0; i < doneList.length; i++) {
					submitActivity(json[0]["id"], session_id, doneList[i])
				}
			}
		}

		updateSavedDateDisplay(ts)
		setSuccess("Utvärdering skapad")
	}

	async function updateReview() {
		let ts = getTodaysDate()
		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"id": reviewId,
				"session_id": session_id,
				"rating": rating,
				"userId": userId,
				"positiveComment": positiveComment,
				"negativeComment": negativeComment,
				"date": ts,
				"exercises": []
			})
		}
		const postResponse = await fetch("/api/session/" + session_id + "/review" , requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern.")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}
		updateSavedDateDisplay(ts)
		clearActivities(reviewId, session_id)
		for(let i = 0; i < doneList.length; i++) {
			submitActivity(reviewId, session_id, doneList[i])
		}
		setSuccess("Utvärdering sparad")
	}

	async function clearActivities(review_id, session_id) {
		//console.log("Clearing activities")
		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"review_id": review_id
			})
		}
		const deleteResponse = await fetch("/api/session/" + session_id + "/review/" + review_id + "/activity", requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern")
			return
		})
		if(deleteResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + deleteResponse.status)
			return
		}
	}

	async function submitActivity(review_id, session_id, activity_id) {
		//console.log("Submitting activity: " + activity_id)
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"activity_id": activity_id
			})
		}
		const postResponse = await fetch("/api/session/" + session_id + "/review/" + review_id + "/activity", requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}
	}

	function getTodaysDate() {
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0")
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

	function updateSavedDateDisplay(date) {
		setSavedDate(date)
		//savedDateValue.textContent = date
	}

	function markAll(sessionData) {
		const allActivityIds = sessionData.activityCategories.flatMap((category) =>
			category.activities.map((activity) => activity.id)
		)
		setDone(allActivityIds)
	}

	/**
   * workout state and dispatch which is managed by the reducer.
   */
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(
		workoutCreateReducer,
		WorkoutCreateInitialState
	)

	/**
   * Function to toggle the popup in the added more activities functionality
   */
	function toggleAddMore() {
		if (workoutCreateInfo.popupState.isOpened) {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CLOSE_POPUP })
		} else {
			workoutCreateInfoDispatch({
				type: WORKOUT_CREATE_TYPES.OPEN_ADD_ACTIVITY_POPUP,
			})
		}
	}

	/**
   * it sets the activities that user wants to add
   * it sets the activities data in the reducer.
   * @param activities the activities that are added.
   */
	function getActivities(activities) {
		console.log("added", workoutCreateInfo.addedActivities)
		console.log("activities", workoutCreateInfo.checkedActivities)
		console.log("categories", workoutCreateInfo.addedCategories)
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.SET_ACTIVITIES_WITH_PARSING,
			payload: { result: activities },
		})
	}

	/**
   * it clears the activities that are added in the reducer.
   */
	function clearActivitiesStorage() {
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.CLEAR_ADDED_ACTIVITIES,
		})
		workoutCreateInfoDispatch({
			type: WORKOUT_CREATE_TYPES.CLEAR_CHECKED_ACTIVITIES,
		})
	}

	/**
   *
   * That function is responsible for adding the newly added activities to the existing categories
   * or creating a new category with the newly added activities.
   *
   * @param data the data that contains the newly added activities information
   *             it can be techniques or exercises with belonging information
   * @param categories the categories that are checked by the user
   */
	function newlyAddedActivity(data, categories) {
		console.log("newlyAddedActivity data: ", data)
		console.log("newlyAddedActivity category: ", categories)

		// calculate the duration of the data
		addDurationToSessionData(data)

		categories.forEach((category) => {
			if (category.checked) {
				let categoryExistence = findExistingCategory(category)
				console.log("categoriesExistence", categoryExistence)

				if (categoryExistence) {
					addActivitiesToExistingCategory(categoryExistence, data)
				} else {
					createNewCategoryWithActivities(category, data)
				}
			}
		})

		clearActivitiesStorage()
	}

	/**
   * that function is responsible for adding the duration of the activities to the sessionData.
   * @param data the data that contains the newly added activities information
   */

	function addDurationToSessionData(data) {
		let duration = countDuration(data)
		sessionData.duration = duration
	}

	/**
   * it calculates the total duration of the activities
   *
   * @param data it contains the newly added activities information
   * @returns the total duration of the activities
   */
	function countDuration(data) {
		let duration = 0
		data.forEach((activity) => {
			duration += activity.duration
		})
		console.log("duration", duration)
		return duration
	}

	/**
   * it checks if the category is already exist in the sessionData.
   * if it is exist, it returns the category.
   * otherwise, it returns null.
   *
   * @param category the category that is checked by the user
   * @returns the category that is already exist in the sessionData.
   */
	function findExistingCategory(category) {
		return sessionData.activityCategories.find((element) => {
			console.log("element category", element.categoryName)
			return element.categoryName.toLowerCase() === category.name.toLowerCase()
		})
	}

	/**
   * that function is responsible for adding the activities to the existing category.
   * it creates the activity object and adds it to the category.
   *
   * @param category the category that is checked by the user
   * @param activities the activities that are added by the user
   */
	function addActivitiesToExistingCategory(category, activities) {
		let order = 20 // Start order at 20, may need adjustment based on requirements
		activities.forEach((activity) => {
			console.log("activity", activity)
			const newActivity = createActivityObject(activity, order)
			category.activities.push(newActivity)
			order++
		})
	}

	/**
   * that function is responsible for creating a new category with the
   * activities that are added by the user.
   *
   * @param category the category that is checked by the user
   * @param activities the activities that are added by the user
   */
	function createNewCategoryWithActivities(category, activities) {
		const newCategory = {
			categoryName: category.name,
			categoryOrder: category.id + 144, // Unique ID logic
			activities: activities.map((activity, index) =>
				createActivityObject(activity, index)
			),
		}
		sessionData.activityCategories.push(newCategory)
	}

	/**
   *
   * that function is responsible for creating the activity object.
   * based on the activity type as it can be technique or exercise.
   *
   *
   * @param  activity the activity that is added by the user
   * @param order some random number that is used for ordering the activities
   * @returns it will successfully add the activity to the sessionData
   */
	function createActivityObject(activity, order) {
		if (activity.techniqueId) {
			getIdForActivity(activity, order)
			return {
				id: activity.id + 144, // Unique ID logic
				text: "",
				duration: activity.duration,
				technique: {
					id: activity.techniqueId,
					name: activity.name,
					description: activity.techniqueDescription || "",
					duration: activity.duration,
					belts: activity.belts || [],
					tags: activity.tags || "",
				},
				name: activity.name,
				exercise: null,
				order: order,
			}
		} else {
			const newId = sessionData.activityCategories.activities

			return {
				id: newId + 144, // Unique ID logic
				text: "",
				duration: activity.duration,
				exercise: {
					id: activity.exerciseId,
					name: activity.name,
					description: activity.exerciseDescription || "",
					duration: activity.duration,
					belts: activity.belts || [],
					tags: activity.tags || "",
				},
				name: activity.name,
				order: order,
				technique: null,
			}
		}
	}

	/**
   *
   * that function is responsible for getting the id for the activity.
   */
	function getIdForActivity(activity, order) {
		const obj = {
			workoutId: null,
			exerciseId: activity.exerciseId ? activity.exerciseId : null,
			techniqueId: activity.techniqueId ? activity.techniqueId : null,
			name: activity.name,
			description: activity.techniqueDescription || "",
			duration: activity.duration,
			order: order,
		}

		const respons = fetch("/api/workouts/activities/add", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token: token,
			},
			body: JSON.stringify(obj),
		})
			.then((response) => response.json())
			.catch((error) => console.log(error))

		console.log("respons", respons)
	}

	function getActivityContainer(sessionData) {
		//console.log(sessionData)
		return (
			sessionData !== null && (
				<div>
					<Divider option={"h2_center"} title={"Aktiviteter"} />
					<div>
						<ul>
							{console.log(sessionData)}
						{sessionData.activityCategories.map((category, categoryIndex) => (
							<React.Fragment key={categoryIndex}>
								{category.activities.map((activity, activityIndex) => (
									<div key={activityIndex} className={styles["activity_wrapper"]}>
										<li className={styles["check_box_li"]}>
											<CheckBox id={"CheckBox" + activity.id} value={activity.id} onClick={() => handleCheckBoxChange(!doneList.includes(activity.id), activity.id)} checked={doneList.includes(activity.id)} />
										</li>
										<li className={styles["activity_text_li"]}>
											{activity.technique !== null ? activity.technique.name : activity.name}
										</li>
									</div>
								))}
							</React.Fragment>
						))}
					</ul>
				</div>

					{/** here we will add plus button and by clicking on that button will create a new popup*/}

					<button
						className={styles.add_more_button_container}
						onClick={toggleAddMore}
					>
						<img src="/add_more_icon.svg" />
					</button>

					{/* here are pop-ups for the adding activities*/}
					<Popup
						title={"Lägg till aktivitet"}
						id={"addMorePopup"}
						isOpen={workoutCreateInfo.popupState.isOpened}
						setIsOpen={toggleAddMore}
					>
						<WorkoutCreateContext.Provider value={{ workoutCreateInfo, workoutCreateInfoDispatch }}>
							{workoutCreateInfo.popupState.types.showAddActivity && (
								<AddActivity
									id="add-activity-popup"
									sendActivity={getActivities}
								/>
							)}
							{workoutCreateInfo.popupState.types.showActivityInfo && (
								<ActivityInfoPopUp
									isFreeText={false}
									backToAddActivity={true}
									newlyAddedActivities={newlyAddedActivity}
								/>
							)}
						</WorkoutCreateContext.Provider>
					</Popup>

					{/* More components if necessary */}

					<div style={{ marginBottom: "4%" }}>
						<Button
							id="allButton"
							width={"100%"}
							onClick={() => markAll(sessionData)}
						>
              				Markera alla
						</Button>
					</div>
				</div>
			)
		)
	}

	return (
		<Popup title={"Utvärdering av tillfälle"} id={id} isOpen={isOpen} setIsOpen={setIsOpen}>
			<div className="d-flex flex-column align-items-center">
				<Divider option={"h2_center"} title={"Betyg"} />
				<div className="d-flex flex-row" style={{marginBottom: "20px"}}>
					<Ratings widgetDimensions="40px" rating={rating} widgetRatedColors="gold" changeRating={setRating}>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
					</Ratings>
				</div>
				{
					getActivityContainer(sessionData)
				}

				<Divider option={"h2_center"} title={"Kommentarer"} />
				<div className="w-100">
					<TextArea  type="text" id={"positiveComment"} text={positiveComment} onChange={handleChangePositive} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Vad var bra med passet?"/>
				</div>
				<div className="w-100">
					<TextArea  type="text" id={"negativeComment"} text={negativeComment} onChange={handleChangeNegative} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Vad var dåligt med passet?"/>
				</div>
				<div className="col-md-6 p-0">
					<Button id="saveButton" width={"100%"} onClick={() => saveReview()}>Spara</Button>
					<p id="savedDateDisplay">Senast sparad: <span id="savedDateValue">{savedDate}</span></p>

				</div>
			</div>
		</Popup>
	)
}
