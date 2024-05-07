import React, { useEffect } from "react"
import { useState, useContext } from "react"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import ReviewComment from "./ReviewComment"
import { AccountContext } from "../../../context"
import {HTTP_STATUS_CODES, setError, setSuccess} from "../../../utils"
import { isAdmin } from "../../../utils"
import TextArea from "../../Common/TextArea/TextArea"
import Divider from "../../Common/Divider/Divider"

/**
 * Review component for workout. The user can review the workout
 * on this page. Reviews linked to the workout are displayed in a
 * popup. The user can add a rating, positive comment and negative comment
 * for the review, and also remove the review if the user id match.
 *
 *
 * @author Cyclops (Group 5) (2023-05-17)
 * @version 2.0
 */

export default function Review({isOpen, setIsOpen, workout_id}) {
	const[rating, setRating] = useState(0)
	const[commentList, setCommentList] = useState([])
	const[positiveComment, setPositive] = useState("")
	const[negativeComment, setNegative] = useState("")
	const context = useContext(AccountContext)
	const {token, userId} = context
	useEffect(() => {
		fetchComments()
	}, [token, userId, workout_id])


	async function fetchComments() {
		const response = await fetch("/api/workouts/reviews?id=" + workout_id, {headers:{token,"userId": userId}}).catch(() => {
			setError("Serverfel: Kunde inte hämta utvärderingar för passet.")
			return
		})

		if(response.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + response.status)
			return
		}

		const data = await response.json()
		setCommentList(data)
	}
	async function addReview() {
		if(rating === 0 && positiveComment === "" && negativeComment === "") {
			return
		}

		let ts = getTodaysDate()
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"workoutId": workout_id,
				"userId": userId,
				"rating": rating,
				"positiveComment": positiveComment,
				"negativeComment": negativeComment,
				"date": ts
			})
		}

		const postResponse = await fetch("/api/workouts/reviews", requestOptions).catch(() => {
			setError("Serverfel: Kunde ansluta till servern.")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}

		requestOptions.method = "GET"
		requestOptions.body = null
		fetchComments()
		setPositive("")
		setNegative("")
		setRating(0)
		setSuccess("Utvärdering tillagd")
	}

	function updateCommentList(newComment){
		let newArray = []
		for(let i = 0; i < commentList.length; i++){
			if(commentList[i].review_id === newComment.review_id){
				newArray[i] = newComment
			}else{
				newArray[i] = commentList[i]
			}
		}
		setCommentList(newArray)
	}

	function getTodaysDate() {
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0")
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

	function handleChangePos(event){
		setPositive(event.target.value)
	}

	function handleChangeNeg(event){
		setNegative(event.target.value)
	}

	return (
		<Popup title={"Utvärderingar"} id={"review-popup"} isOpen={isOpen} setIsOpen={setIsOpen}>
			<div className="d-flex flex-column align-items-center">
				<div className="d-flex flex-row" style={{marginBottom: "20px"}}>
					<Ratings widgetDimensions="40px" rating={rating} widgetRatedColors="#ffcc00" changeRating={setRating}>
						<Ratings.Widget widgetHoverColor='#ffcc00'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='#ffcc00'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='#ffcc00'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='#ffcc00'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='#ffcc00'>
							<Star/>
						</Ratings.Widget>
					</Ratings>
				</div>
				<div className="w-100">
					<TextArea  type="text" text={positiveComment} onChange={handleChangePos} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Det positiva med detta pass"/>
				</div>
				<div className="w-100">
					<TextArea  type="text" text={negativeComment} onChange={handleChangeNeg} className="col-md-6 col-md-offset-3" style={{marginBottom: "40px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Det negativa med detta pass"/>
				</div>
				<div className="col-md-6 p-0">
					<Button width={"100%"} onClick={() => addReview()}>Lägg till</Button>
				</div>
			</div>
			<Divider title={""} option={"h2_center"}/>
			<div className="w-100  d-flex flex-column justify-content-center align-items-center">
				{commentList.map((comment) => (
					<ReviewComment key={comment.review_id} updateCommentList={updateCommentList} editable={isAdmin(context) || userId == comment.user_id} comment={comment} onDelete={(comment) => {setCommentList(commentList.filter(c => c.review_id != comment.review_id))}} token={token} getTodaysDate={getTodaysDate}></ReviewComment>
				))}
			</div>
		</Popup>
	)
}
