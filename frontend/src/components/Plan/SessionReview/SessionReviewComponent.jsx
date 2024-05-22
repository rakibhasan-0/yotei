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
	const [extraActivityId, setExtraActivityId] = useState(-1)
	const [isTransformComplete, setIsTransformComplete] = useState(false)
	const [activeRequests, setActiveRequests] = useState(0)


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
				setSessionData(() => json)
				//setLoading(false)
				setErrorStateMsg("")
				fetchLoadedData()

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

					fetchLoadedExtraData();
				}

				
			}


		}

		const fetchLoadedExtraData = async() => {

			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token },
			}
			const extraActivitiesloadedResponse = await fetch("/api/session/" + session_id + "/review/extraactivities", requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				//setLoading(false)
				return
			})

			if(extraActivitiesloadedResponse.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Kunde inte hämta anonyma aktiviteter. Felkod: " + extraActivitiesloadedResponse.status)
			
			} else if (extraActivitiesloadedResponse.status == HTTP_STATUS_CODES.OK) {
				const json = await extraActivitiesloadedResponse.json()
				// that json data will be used to add the sessionData
				setSessionData((prevSessionData) => {
					return {
						...prevSessionData, // spread the previous state to maintain other properties
						activityCategories: [
							...prevSessionData.activityCategories, // spread the existing categories
							json, // add the new json object
						],
					}
				})

	
			}

		}

		fetchData()

	}, [])




	function setDoneActivities(activities) {
		setDone(prevDoneList => {
			const newIds = activities.map(activity => activity["activity_id"])
			const uniqueNewIds = newIds.filter(id => !prevDoneList.includes(id))
			return [...prevDoneList, ...uniqueNewIds]
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
		
		await transformDoneList()

	}


	function removingNotCheckedActivities() {
		const extraCategory = sessionData.activityCategories.find(category => category.categoryName === "Extra");

		if (extraCategory) {
			extraActivities.forEach(activity => {
				if (!doneList.includes(activity.id)) {
					removeActivity(activity.id)
				}
			})
		} 

	}
	

	
	function replaceDoneId(oldId, newId) {
		console.log("Replacing", oldId, "with", newId)
		setDone(doneList.map(id => id === oldId ? newId : id))
		console.log("Done list after replacing", doneList)
	}



	async function transformDoneList() {
		const promises = doneList.map(async activityID => {
			if (activityID < 0) {
				const extraActivitiesCategory = sessionData.activityCategories.find(category => 
					category.categoryName.toLowerCase() === "extraactivities"
				)

				if (extraActivitiesCategory) {
					const foundActivity = extraActivitiesCategory.activities.find(act => act.id === activityID)
					if (foundActivity) {
						try {
							const newId = await getIdForActivity(foundActivity, foundActivity.order)
							foundActivity.id = newId
							console.log("Transformed new ID:", newId)
							//replaceDoneId(activityID, newId)
							return newId
						} catch (error) {
							console.error("Error fetching new ID:", error)
						}
					}
				}
			}
			return activityID;
		});

		const updatedList = await Promise.all(promises)
		console.log("Updated list", updatedList)
		console.log("Done list after the transform of ids and before updating", doneList)
		setDone(updatedList)
		console.log("list after setting the transform", doneList)
		setIsTransformComplete(true) 

		removingNotCheckedActivities()

	}


	/**
	 * it will trigger when the transformation of the done list is complete, 
	 * we can proceed with the review. So that setDone() can be updated synchronously.
	 */
	useEffect(() => {
		if (isTransformComplete) {
			//console.log("Done list updated and transform complete:", doneList);
			proceedWithReview();
			setIsTransformComplete(false)
    	}

	}, [isTransformComplete])


	useEffect(() => {
		console.log("ACTIVE REQUESTS:", activeRequests)

	}, [activeRequests])


	function proceedWithReview() {
		if (reviewId < 0) {
			addReview();
		} else {
			updateReview();
		}
	}


	useEffect(() => {
		//console.log("session Data has been updated", sessionData)
	}, [sessionData])

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
				console.log("doneList", doneList)
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

	async function removeActivity(activity_id) {
		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json", "token": token}
		}
		setActiveRequests((prev) => {
			return prev + 1;
		})

		const deleteResponse = await fetch("/api/workouts/activities/delete/" + activity_id , requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern.")
			return
		})
		if(deleteResponse.status == HTTP_STATUS_CODES.BAD_REQUEST) {
			console.log("Kunde inte radera aktivitet med id: " + activity_id)
			setActiveRequests((prev) => {
				return prev - 1;
			})
		} else if (deleteResponse.status == HTTP_STATUS_CODES.NOT_FOUND) {
			console.log("Hittade ingen aktivitet med id: " + activity_id)
			return prev - 1;
		} else if (HTTP_STATUS_CODES.status == HTTP_STATUS_CODES.OK) {
			console.log("Raderade aktivitet med id: " + activity_id)
			return prev - 1;
		}
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
		console.log("Submitting activity: " + activity_id)
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
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(workoutCreateReducer,WorkoutCreateInitialState)

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


	const [extraActivities, setExtraActivities] = useState([])

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

		//createNewCategoryWithActivities("ExtraActivities", data)

		// calculate the duration of the data
		//addDurationToSessionData(data)
		

		/*categories.forEach((category) => {
			if (category.checked) {
				let categoryExistence = findExistingCategory(category)
				console.log("categoriesExistence", categoryExistence)

				if (categoryExistence) {
					addActivitiesToExistingCategory(categoryExistence, data)
				} else {
					createNewCategoryWithActivities(category, data)
				}
			}
		})*/

		const categoryExistence= sessionData.activityCategories.find((element) => {
			return element.categoryName.toLowerCase() === "ExtraActivities".toLowerCase()
		})


		if (categoryExistence) {
			addActivitiesToExistingCategory(categoryExistence, data);
		} else {
			createNewCategoryWithActivities("ExtraActivities", data)
		}


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
		let currentExtraId = extraActivityId
		console.log("currentExtraId", currentExtraId)
		setSessionData(prevSessionData => {
			const newCategories = prevSessionData.activityCategories.map(cat => {
				if (cat.categoryName === category.categoryName) {
					return {
						...cat,
						activities: [...cat.activities, ...activities.map((activity, index) => 
							createActivityObject(activity, cat.activities.length + index, currentExtraId--))
						]
					};
				}
				return cat;
			});

			return { ...prevSessionData, activityCategories: newCategories };
		})

		setExtraActivityId(currentExtraId)
	}


	/**
   * that function is responsible for creating a new category with the
   * activities that are added by the user.
   *
   * @param category the category that is checked by the user
   * @param activities the activities that are added by the user
   */
	function createNewCategoryWithActivities(category, activities) {
		let categoryOrder = sessionData.activityCategories
		categoryOrder = categoryOrder.length + 1
		let currentExtraId = extraActivityId

		const newCategory = {
			categoryName: category,
			categoryOrder: categoryOrder, // Unique ID logic
			activities: activities.map((activity, index) =>
				createActivityObject(activity, index, currentExtraId--)
			),
		}

		// Adding new category to the sessionData 
		setSessionData(prevSessionData => ({
			...prevSessionData,
			activityCategories: [...prevSessionData.activityCategories, newCategory]
		}))

		setExtraActivityId(currentExtraId)

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
	function createActivityObject(activity, order, negativeId) {
		if (activity.techniqueId) {
			//getIdForActivity(activity, order)
			return {
			 // Unique ID logic
			 	id: negativeId,
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
			//getIdForActivity(activity, order)
			return {
	// Unique ID logic
				id: negativeId,
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
	async function getIdForActivity(activity, order) {

		const obj = {
			workoutId: null,
			exerciseId: activity.exercise ? activity.exercise.id : null,
			techniqueId: activity.technique ? activity.technique.id : null,
			name: activity.name,
			description: activity.techniqueDescription || "",
			duration: activity.duration,
			order: order,
		}


		try {
			const response = await fetch("/api/workouts/activities/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: token,
				},
				body: JSON.stringify(obj),
			})

			const responseData = await response.json()
			console.log("response", responseData)
			return responseData.id
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}


	function getActivityContainer(sessionData) {
		//console.log(sessionData)
		return (
			sessionData !== null && (
				<div>
					<Divider option={"h2_center"} title={"Aktiviteter"} />
					<div>
						<ul>
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
