import React, { useEffect } from "react"
import { useState, useContext } from "react"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import TextArea from "../../Common/TextArea/TextArea"
import Divider from "../../Common/Divider/Divider"
import CheckBox from "../../Common/CheckBox/CheckBox"
import styles from "./SessionReviewComponent.module.css"
import {HTTP_STATUS_CODES, setError, setSuccess} from "../../../utils"
import { AccountContext } from "../../../context"

/**
 * Review component for an individual session. 
 * A session can have one review on it, filled in by the trainer
 * The review can be seen and edited through the plan window
 * Based on "ReviewFormComponent.jsx"
 * 
 * @author Hannes c21hhn (Group 1, pomegranate) (2024-04-22) 
 * @version 1.0
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
				headers: {"Content-type": "application/json", token: context.token}
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

	function handleChangePositive(event){
		setPositiveComment(event.target.value)
	}

	function handleChangeNegative(event){
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
			headers: {"Content-type": "application/json", token: context.token}
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
		const allActivityIds = sessionData.activityCategories.flatMap(category => category.activities.map(activity => activity.id))
		setDone(allActivityIds)
	}
	


	function getActivityContainer(sessionData) {
		//console.log(sessionData)
		return sessionData !== null && (
			<div className="container">
				<Divider option={"h2_center"} title={"Aktiviteter"} />
				<div className="row">
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
				<Button id="allButton" width={"100%"} onClick={() => markAll(sessionData)}>Markera alla</Button>
			</div>
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