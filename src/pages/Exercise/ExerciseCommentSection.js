import React, {useEffect, useState} from "react"
import "./ExerciseComments.css"
import { useContext } from "react"
import { AccountContext } from "../../context"

/**
 * Comment section for exercise details page.
 * @author Team 3 Hawaii
 */
export default function ExerciseCommentSection ({ex_id}) {
	const [commentList, setCommentList] = useState([])
	const [comment, setComment] = useState("")

	const {token, userId} = useContext(
		AccountContext
	)

	/**
     * Submits a comment from the form to the database.
     * @returns {Promise<void>}
     */
	async function onSubmitComment() {
		if(comment.length === 0){
			return
		}
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				"userId": userId
			},
			body: JSON.stringify({
				commentText: comment
			})
		}

		const response = await fetch(`/api/comment/exercise/add?id=${ex_id}`, requestOptions)
		if(response.status != 201){
			alert("Error adding comment")
		}
		await fetchComments()
		setComment("") 
	}


	/**
     * A function for deleting a comment from the commentlist. Sends a request to the API and deletes the item from
     * the list if successful.
     * @param comment
     * @returns {Promise<void>}
     */
	async function deleteComment({comment}) {
		if (window.confirm("Är du säker på att du vill ta bort kommentaren?")){

			const requestOptions = {
				method: "DELETE",
				headers: {token}
			}
            
			const response = await fetch(`/api/comment/delete?id=${comment.commentId}`, requestOptions)
			const data = await response
            
			if (data.status === 200) {
				setCommentList(commentList.filter(
					(c) => c.commentId !== comment.commentId
				))
			}
		}
	}

	/**
     * Fetches a comment based on the currently displayed exercises' id.
     * @returns {Promise<void>}
     */
	async function fetchComments() {
		const response = await fetch(`/api/comment/exercise/get?id=${ex_id}`, {headers:{token}})
		const data = await response.json()
		setCommentList(data)
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				fetchComments()
			} catch (error) {
				console.log("error", error)
				alert("Could not get comments for the exercise")
			}
		}
		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/**
     * A function for setting the state to be equal to the value of the event.
     * @param event
     */
	function handleChange(event){
		setComment(event.target.value)
	}

	/**
     * A function for the form, button and the list of comments. Returns a component containing these.
     * @returns {JSX.Element}
     * @private
     */
	function getComments() {
		return (
			<div className="d-flex flex-column align-items-center">
				{/*Ask the user for the name of the exercise*/}
				<div className="d-flex">
					<form className="d-flex flex-column padding-right">
						<input
							name="name"
							id="name"
							type="text"
							placeholder={"Skriv din kommentar"}
							className="form-control"
							value={comment}
							onChange={ handleChange }
							required
						/>
					</form>
					<button className="btn-done-2 btn" type='button' onClick={() => onSubmitComment()}>
                        +
					</button>
				</div>
				<div className="w-100  d-flex flex-column justify-content-center align-items-center">
					{commentList.map((comment) => (
						<div style={{border: "1px solid #B4B4B4", borderRadius: "5px"}} className="col-sm-12 col-md-6 col-lg-4 m-3 p-3 d-flex flex-column" key={comment.commentId}>
							<div className="d-flex justify-content-between align-items-center">
								<div className="d-flex align-items-center">
									<i className="bi bi-person m-0 p-0" style={{margin: "0px", padding: "0px", fontSize:"24px"}}/>
									<p className="font-weight-bold m-0 ml-2">{comment.user} {userId == comment.userId && <span className="font-weight-light">(jag)</span>}</p>
								</div>
								<p className="m-0 font-italic" style={{color: "#B4B4B4"}}>{comment.date}</p>
							
							</div>
							<p className="mt-2" style={{textAlign: "left"}}>{comment.commentText}</p>
							{userId == comment.userId && 
								<div className="d-flex align-items-end flex-column">
									<i style={{color:"#BD3B41", fontSize:"24px"}} onClick={() => deleteComment({comment})} className="bi bi-trash "/>
								</div>
							}
						</div>
					))}
				</div>
			</div>)
	}


	/**
     * The returned component.
     */
	return (
		<div className="comment-box">
			<div className="w-100">{getComments()}</div>
		</div>
	)
}
