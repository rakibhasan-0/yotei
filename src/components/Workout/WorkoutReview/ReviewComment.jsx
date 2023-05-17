import {Trash } from "react-bootstrap-icons"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import { useState } from "react"
import ConfirmPopup from "../../Common/ConfirmPopup/ConfirmPopup"
import React from "react"

/**
 *  Component for review comment. Includes name, positive comment, negative comment, date.
 * 
 * @author Cyclops (Group 5) (2023-05-16)
 * @version 1.0
 */

export default function ReviewComponent({comment, onDelete, editable, token}) {
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	function deleteReview() {
		const requestOptions = {
			method: "DELETE",
			headers: {"token": token}
		}

		fetch(`/api/workouts/reviews?id=${comment.review_id}`, requestOptions)
		return onDelete(comment)
	}

	return (
		<>
			<div className="row w-100 justify-content-center m-2">
				<div style={{border: "1px solid #B4B4B4", borderRadius: "5px", minHeight: "auto"}} className="col-sm-12 col-md-6 col-lg-6 p-3 d-flex flex-column">
					<div className="d-flex justify-content-between align-items-center">
						<div className="d-flex align-items-center">
							<i className="bi bi-person m-0 p-0" style={{margin: "0px", padding: "0px", fontSize:"24px"}}/>
							<p className="font-weight-bold m-0 ml-2">{comment.username} {editable && <span id="me" className="font-weight-light">(jag)</span>}</p>
						</div>
						<p className="m-0 font-italic" maxLength="10" style={{color: "#B4B4B4"}}>{comment.review_date.substring(0,10)}</p>
					</div>
					<div id="review_rating" className="w-100 d-flex justify-content-start" style={{marginBottom: "20px"}}>
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
						{ comment.positive_comment?.length > 0 && 
						<div className="d-flex flex-row col-md-6">
							<i id="positive_icon" role="icon" aria-label="positive" className="bi bi-plus-circle" style={{fontSize:"20px", color:"green", marginRight:"10px"}}></i>
							<p style={{marginTop: "3px", display: "block", width: "90%", wordWrap: "break-word", textAlign: "left"}}> {comment.positive_comment}</p>
						</div>
						}
						{ comment.positive_comment?.length > 0 && comment.negative_comment?.length > 0 && 
						<div id="comment_divider" className="horizontal-line align-self-center w-100"/>
						}
						{ comment.negative_comment?.length > 0 && 
						<div className="d-flex flex-row col-md-6">
							<i id="negative_icon" role="icon" aria-label="negative" className="bi bi-dash-circle" style={{fontSize:"20px", color:"red", marginRight:"10px"}}></i>
							<p style={{marginTop: "3px", display: "block", width: "90%", wordWrap: "break-word", textAlign: "left", margin: "0px"}}> {comment.negative_comment}</p>
						</div>
						}
					</div>
					{editable && 
					<div className="d-flex align-items-end flex-column">
						<Trash
							size="24px"
							color="var(--red-primary)"
							style={{cursor: "pointer"}}
							onClick={setShowDeletePopup}
						/>
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