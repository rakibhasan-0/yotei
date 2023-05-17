import React, { useEffect } from "react"
import { useState, useContext } from "react"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import ReviewComment from "./ReviewComment"
import { AccountContext } from "../../../context"
//import { isAdmin } from "../../../utils"

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
	const[positiveComment, setpositive] = useState("")
	const[negativeComment, setNegative] = useState("")
	const[addedReview, setAddedReview] = useState("")

	const context = useContext(AccountContext)
	const {token, userId} = context

	useEffect(() => {

		async function fetchComments() {
			const response = await fetch("/api/workouts/reviews?id=" + workout_id, {headers:{token,"userId": userId}})
			const data = await response.json()
			setCommentList(data)
		}

		fetchComments()
	}, [token, userId, workout_id])

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

		await fetch("/api/workouts/reviews", requestOptions)
		requestOptions.method = "GET"
		requestOptions.body = null
		const response =  await fetch("/api/workouts/reviews?id=" + workout_id, {headers:{token,"userId": userId}})
		setCommentList(await response.json())

		setpositive("")
		setNegative("")
		setRating(0)
		setAddedReview("Utvärdering tillagd")
	}


	function getTodaysDate() {
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0")
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

	function handleChangePos(event){
		setpositive(event.target.value)
	}
	
	function handleChangeNeg(event){
		setNegative(event.target.value)
	}
	
	return (
		<Popup title={"Utvärderingar"} id={"review-popup"} isOpen={isOpen} setIsOpen={setIsOpen} width={90} height={95} noBackground={false} isNested={false}>
			<div className="d-flex flex-column align-items-center">
				<h2 style={{marginBottom: "20px"}}>Lägg till utvärdering</h2>
				<div className="d-flex flex-row">
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
				<div className="w-100">
					<textarea  type="text" value={positiveComment} onChange={handleChangePos} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Det positiva med detta pass"></textarea>
				</div>
				<div className="w-100">
					<textarea  type="text" value={negativeComment} onChange={handleChangeNeg} className="col-md-6 col-md-offset-3" style={{marginBottom: "40px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Det negativa med detta pass"></textarea>
				</div>
				<div className="col-md-6 p-0"> 
					<Button width={"100%"} onClick={() => addReview()}>Lägg till</Button>
					<p style={{color: "green", marginTop: "20px"}}>{addedReview}</p>
				</div>
			</div>
			<div className="horizontal-line align-self-center w-100" style={{marginTop: "20px"}}></div>
			<div>
				<h2>Tidigare utvärderingar</h2>
			</div>
			<div className="w-100  d-flex flex-column justify-content-center align-items-center">
				{commentList.map((comment, index) => (
					<ReviewComment key={index} editable={/*isAdmin(context) ||*/ userId == comment.user_id} comment={comment} onDelete={(comment) => {setCommentList(commentList.filter(c => c.review_id != comment.review_id))}} token={token}></ReviewComment> 
				))}
			</div>
		</Popup>
	)
}
