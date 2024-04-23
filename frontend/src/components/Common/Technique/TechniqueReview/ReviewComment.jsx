import {Trash, Pencil } from "react-bootstrap-icons"
import Ratings from "react-ratings-declarative"
import Star from "../../../Common/StarButton/StarButton"
import { useState } from "react"
import ConfirmPopup from "../../../Common/ConfirmPopup/ConfirmPopup"
import React from "react"
import Button from "../../../Common/Button/Button"
import TextArea from "../../../Common/TextArea/TextArea"
import styles from "./ReviewStyles.module.css"
import {isAdmin} from "../../../../utils"
import {useContext} from "react"
import {AccountContext} from "../../../../context"
import {HTTP_STATUS_CODES, setError, setSuccess} from "../../../../utils"

/**
 *  Component for review comment. Includes name, positive comment, negative comment, date.
 *
 * @author Cyclops (Group 5) (2023-05-16) & Granatäpple (Group 1) (2024-04-19)
 * @version 1.0
 */

export default function ReviewComponent({comment, onDelete, token, getTodaysDate, updateCommentList, testId}) {
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [positiveComment, setPositiveComment] = useState(comment.positive_comment)
	const [negativeComment, setNegativeComment] = useState(comment.negative_comment)
	const [rating, setRating] = useState(comment.rating)
	const { userId, accountRole } = useContext(AccountContext)

	async function deleteReview() {
		const requestOptions = {
			method: "DELETE",
			headers: {"token": token}
		}

		const response = await fetch("/api/techniques/reviews?id=" + comment.review_id, requestOptions).catch(() => {
			setError("Serverfel: Kunde inte ansluta till servern.")
			return
		})

		if(response.status === HTTP_STATUS_CODES.NOT_FOUND) {
			setError("Utvärderingen existerar inte längre!")
			return
		} else if(response.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + response.status)
			return
		}
		setSuccess("Utvärdering borttagen!")
		return onDelete(comment)
	}
	async function saveEdits(){
		let ts = getTodaysDate()
		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"id": comment.review_id,
				"rating": rating,
				"userId": comment.user_id,
				"techniqueId": comment.technique_id,
				"positiveComment": positiveComment,
				"negativeComment": negativeComment,
				"date": ts
			})
		}

		const postResponse = await fetch("/api/techniques/reviews", requestOptions).catch(() => {
			setError("Serverfel: Kunde ansluta till servern.")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}
		let commentOK = {
			username: comment.username,
			review_id: comment.review_id,
			rating: rating,
			user_id: comment.user_id,
			technique_id: comment.technique_id,
			positive_comment: positiveComment,
			negative_comment: negativeComment,
			review_date: ts
		}

		updateCommentList(commentOK)
		setSuccess("Kommentar uppdaterad")
		setEditMode(false)

	}
	function turnOffEditMode(){
		setPositiveComment(comment.positive_comment)
		setNegativeComment(comment.negative_comment)
		setRating(comment.rating)
		setEditMode(false)
	}

	function generateRatings(){
		const onChangeRating = editMode ? setRating : undefined
		return <Ratings changeRating={onChangeRating} widgetDimensions="25px" rating={rating} widgetRatedColors="gold">
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
	}
	return (
		<>
			<div className="row w-100 justify-content-center m-2">
				<div style={{border: "1px solid #B4B4B4", borderRadius: "5px", minHeight: "auto"}} className="col-sm-12 col-md-12 col-lg-12 p-3 d-flex flex-column">
					<div className="d-flex justify-content-between align-items-center">
						<div className="d-flex align-items-center">
							<i className="bi bi-person m-0 p-0" style={{margin: "0px", padding: "0px", fontSize:"24px"}}/>
							<p className="font-weight-bold m-0 ml-2">{comment.username} {(userId == comment.user_id || testId == comment.user_id) && <span id="me" className="font-weight-light">(jag)</span>}</p>
						</div>
						<p className="m-0 font-italic" maxLength="10" style={{color: "#B4B4B4"}}>{comment.review_date.substring(0,10)}</p>
					</div>
					<div id="review_rating" className="w-100 d-flex justify-content-start" style={{marginBottom: "20px"}}>
						{generateRatings()}
					</div>
					<div className="w-100 d-flex justify-content-start align-items-start flex-column">
						<div className="d-flex flex-row w-100">
							{(comment.positive_comment?.length > 0 || editMode) && <i id="positive_icon" role="icon" aria-label="positive" className="bi bi-plus-circle" style={{fontSize:"20px", color:"green", marginRight:"10px"}}></i>}
							{editMode ?
								<TextArea type="text" rows={4} onChange={(e) => setPositiveComment(e.target.value)} text={positiveComment} />
								:
								comment.positive_comment?.length > 0 && <p className={styles.comment}> {comment.positive_comment}</p>
							}
						</div>
						<div className="d-flex flex-row w-100 mt-2">
							{(comment.negative_comment?.length > 0 || editMode) && <i id="negative_icon" role="icon" aria-label="negative"
								className="bi bi-dash-circle" style={{fontSize:"20px", color:"red", marginRight:"10px"}}></i>}

							{editMode ?
								<TextArea type="text" rows={4} onChange={(e) => setNegativeComment(e.target.value)} text={negativeComment} />
								:
								comment.negative_comment?.length > 0 && <p className={styles.comment}> {comment.negative_comment}</p>
							}
						</div>
					</div>
					{(isAdmin(accountRole) || userId == comment.user_id) &&
					<div className="d-flex align-items-center justify-content-end">
						{editMode ?
							<>
								<div className="d-flex align-items-center mt-4">
									<div style={{marginRight:"10px"}}>
										<Button width="100px" onClick={saveEdits}>Spara</Button>
									</div>
									<Button width="100px" outlined={true} onClick={turnOffEditMode}>Avbryt</Button>
								</div>
							</>
							:
							<div style={{marginTop:"10px"}}>
								<Pencil
									size="24px"
									color="var(--red-primary)"
									style={{cursor: "pointer", marginRight: "20px" }}
									onClick={() => setEditMode(!editMode)}
								/>
								<Trash
									size="24px"
									color="var(--red-primary)"
									style={{cursor: "pointer"}}
									onClick={setShowDeletePopup}
								/>
							</div>
						}
					</div>
					}
				</div>
			</div>
			{<ConfirmPopup
				onClick={() => {deleteReview()}}
				id={"confirm-popup"}
				popupText={"Radera utvärdering"}
				showPopup={showDeletePopup}
				setShowPopup={setShowDeletePopup}
			/>}
		</>
	)
}
