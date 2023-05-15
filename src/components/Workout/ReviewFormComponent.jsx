import React, { useEffect } from "react"
import { useState, useContext } from "react"
import Popup from "../Common/Popup/Popup"
import ConfirmPopup from "../Common/ConfirmPopup/ConfirmPopup"
import Button from "../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../Common/StarButton/StarButton"
import {Trash } from "react-bootstrap-icons"
import { AccountContext } from "../../context"

/**
 * Review component for workout. The user can review the workout
 * on this page. Reviews linked to the workout are displayed in a 
 * popup. The usser can add a rating, positive comment and negative comment
 * for the review, and also remove the review if the user id match.
 * 
 * 
 * @author Cyclops (Group 5) (2023-05-15)
 * @version 1.0
 */

export default function Review({isOpen, setIsOpen, workout_id}) {  
	const[rating, setRating] = useState(0)
	const[commentList, setCommentList] = useState([])
	const[positiveComment, setpositive] = useState("")
	const[negativeComment, setNegative] = useState("")
	const[currentComment, setCurrentComment] = useState()
	const[showDeletePopup, setShowDeletePopup] = useState(false)
	const[addedReview, setAddedReview] = useState("")

	const[size, setSize] = useState(50)
	var x = window.matchMedia("(max-width: 400px)")

	function myFunction(x) {
		if (x.matches) { 
			setSize(40)
		} else {
			setSize(50)
		}
	}

	const {token, userId} = useContext(
		AccountContext
	)

	useEffect(() => {

		async function fetchComments() {
			const response = await fetch("/api/workouts/reviews?id=" + workout_id, {headers:{token,"userId": userId}})
			const data = await response.json()
			console.log(data)
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


	function deleteReview(review_id) {
		const requestOptions = {
			method: "DELETE",
			headers: {"token": token}
		}

		fetch(`/api/workouts/reviews?id=${review_id}`, requestOptions)
		setCommentList(commentList.filter(c => c.review_id != review_id))
	}

	function getPopupContainer() {
		return (
			currentComment &&
			<ConfirmPopup
				onClick={() => {deleteReview(currentComment.review_id)}}
				id={"confirm-popup"}
				showPopup={showDeletePopup}
				setShowPopup={setShowDeletePopup}
			/>
		)
	}
	
	return (
		<>
			{x.addListener(myFunction)}
			<div>
				<Popup id={"review-popup"} isOpen={isOpen} setIsOpen={setIsOpen} width={90} height={95}>
					<h1 className="align-self-start" style={{padding: "0px", margin: "0px"}}>Utvärdering</h1>
					<div className="horizontal-line align-self-start w-100"></div>
					<div className="d-flex flex-column align-items-center">
						<h2 style={{marginBottom: "20px"}}>Lägg till utvärdering</h2>
						<div className="d-flex flex-row">
							<Ratings widgetDimensions={size} rating={rating} widgetRatedColors="gold" changeRating={setRating}>
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
							<div key={index} className="row w-100 justify-content-center">
								<div style={{border: "1px solid #B4B4B4", borderRadius: "5px", minHeight: "auto"}} className="col-sm-12 col-md-6 col-lg-6 m-3 p-3 d-flex flex-column">
									<div className="d-flex justify-content-between align-items-center">
										<div className="d-flex align-items-center">
											<i className="bi bi-person m-0 p-0" style={{margin: "0px", padding: "0px", fontSize:"24px"}}/>
											<p className="font-weight-bold m-0 ml-2">{comment.username} {userId == comment.user_id && <span className="font-weight-light">(jag)</span>}</p>
										</div>
										<p className="m-0 font-italic" maxLength="10" style={{color: "#B4B4B4"}}>{comment.review_date.substring(0,10)}</p>
									</div>
									<div className="w-100 d-flex justify-content-start" style={{marginBottom: "20px"}}>
										<Ratings widgetDimensions="25px" rating={comment.rating} widgetRatedColors="gold">
											<Ratings.Widget>
												<Star/>
											</Ratings.Widget>
											<Ratings.Widget>
												<Star/>
											</Ratings.Widget>
											<Ratings.Widget>
												<Star/>
											</Ratings.Widget>
											<Ratings.Widget>
												<Star/>
											</Ratings.Widget>
											<Ratings.Widget>
												<Star/>
											</Ratings.Widget>
										</Ratings>
									</div>
									<div className="w-100 d-flex justify-content-start align-items-start flex-column">
										{comment.positive_comment?.length > 0 && <div className="d-flex flex-row col-md-6"><i className="bi bi-plus-circle" style={{fontSize:"20px", color:"green", marginRight:"10px"}}></i><p style={{marginTop: "3px", display: "block", width: "90%", wordWrap: "break-word", textAlign: "left"}}> {comment.positive_comment}</p></div>}
										{comment.positive_comment?.length > 0 && comment.negative_comment?.length > 0 && <div className="horizontal-line align-self-center w-100"/>}
										{comment.negative_comment?.length > 0 && <div className="d-flex flex-row col-md-6"><i className="bi bi-dash-circle" style={{fontSize:"20px", color:"red", marginRight:"10px"}}></i><p style={{marginTop: "3px", display: "block", width: "90%", wordWrap: "break-word", textAlign: "left", margin: "0px"}}> {comment.negative_comment}</p></div>}
									</div>
									{userId == comment.user_id && 
										<div className="d-flex align-items-end flex-column">
											<Trash
												size="24px"
												color="var(--red-primary)"
												style={{cursor: "pointer"}}
												onClick={() => {setShowDeletePopup(true), setCurrentComment(comment)}}
											/>
										</div>
									}
								</div>
							</div>
						))}
					</div>
				</Popup>
				{getPopupContainer()}
			</div>
		</>
	)
}
