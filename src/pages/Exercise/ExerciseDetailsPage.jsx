import React, { useContext, useEffect, useState } from "react"
import {Trash, Pencil, Clock, Plus} from "react-bootstrap-icons"
import "./ExerciseDetailsPage.css"
import { AccountContext } from "../../context"
import { useNavigate, useParams } from "react-router"
import CommentSection from "../../components/Common/CommentSection/CommentSection"
import Popup from "../../components/Common/Popup/Popup"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import TextArea from "../../components/Common/TextArea/TextArea"
import Button from "../../components/Common/Button/Button"
import Tag from "../../components/Common/Tag/Tag"

export default function ExerciseDetailsPage() {
	const {ex_id} = useParams()
	const { token, userId } = useContext(AccountContext)
	const [exercise, setExercise] = useState()
	const [comments, setComments] = useState()
	const [tags, setTags] = useState()
	const [isAddingComment, setAddComment] = useState(false)
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	const [selectedComment, setSelectedComment] = useState()
	const [commentText, setCommentText] = useState()
	const navigate = useNavigate()
	
	const fetchComments = () => {
		fetch(`/api/comment/exercise/get?id=${ex_id}`, {
			headers: { token }
		})
			.then(res => res.json())
			.then(data => setComments(data))
			.catch(ex => {
				alert("Kunde inte hämta kommentarer")
				console.error(ex)
			})
	}

	useEffect(() => {
		fetch(`/api/exercises/${ex_id}`, {
			headers: { token }
		})
			.then(res => res.json())
			.then(data => setExercise(data))
			.catch(ex => {
				alert("Kunde inte hämta övning")
				console.error(ex)
			})

		fetchComments()
		
		fetch(`/api/tags/get/tag/by-exercise?exerciseId=${ex_id}`, {
			headers: { token }
		}).then(res => res.json())
			.then(data => setTags(data))
			.catch(ex => {
				alert("Kunde inte hämta taggar")
				console.error(ex)
			})
	}, [token, ex_id])

	const onDelete = async () => {
		try {
			const response = await fetch("/api/exercises/remove/" + ex_id, {
				headers: {token}, method: "DELETE"
			})
			if (!response.ok) {
				throw new Error("Got a non ok status response from the API")
			}
			navigate(-1)
		} catch (error) {
			alert("Kunde inte ta bort övningen!")
			console.error(error)
		}
	}

	const onDeleteComment = async () => {
		const id = selectedComment
		try {
			const response = await fetch(`/api/comment/delete?id=${id}`, {
				headers: { token }, method: "DELETE"
			})
			if (!response.ok) {
				throw new Error("Got a non ok status response from the API")
			}
		} catch (error) {
			alert("Kunde inte ta bot kommentar!")
			console.error(error)
		}
		setComments(comments => comments.filter(comment => comment.commentId !== id))
		setSelectedComment()
		setShowConfirmPopup(false)
	}

	const onAddComment = async () => {
		const response = await fetch(`/api/comment/exercise/add?id=${ex_id}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				commentText: commentText
			})
		})
		if(response.status != 201){
			alert("Error adding comment")
		}
		setAddComment(false)
		// TODO: The comments add method does not
		// return the comment id, so we have to
		// refetch the comments after adding one.
		// This should probably be fixed in the API
		fetchComments()
	}
	
	const showDeletePopup = (commentId) => {
		setSelectedComment(commentId)
		setShowConfirmPopup(true)
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8 text-left">
					{/* TODO: Add video player here */}

					<div className="d-flex flex-row align-items-center justify-content-between">
						<h1 className="mt-2">{exercise?.name || "Laddar"}</h1>
						<div className="d-flex flex-row" style={{gap: "10px"}}>
							<Pencil onClick={() => navigate(`/exercise/edit/${ex_id}`)} size="24px" style={{color: "var(--red-primary)"}} />
							<Trash onClick={onDelete} size="24px" style={{color: "var(--red-primary)"}} />
						</div>
					</div>

					<div className="d-flex flex-row" style={{ gap: "10px" }}>
						<Clock />
						<p>{exercise?.duration || "Laddar"} min</p>
					</div>
					
					<h2 className="bold-font">Beskrivning</h2>
					<p>{exercise?.description || "Laddar beskrivning..."}</p>
					
					{tags && <>
						<h2 className="bold-font">Taggar</h2>
						<div className="d-flex flex-wrap mb-4" style={{gap: "10px"}}>
							{tags.map((tag, index) => (
								<Tag key={index} tagType={"default"} text={tag.tagName} />
							))}
						</div>
					</>}

					<div className="d-flex justify-content-between align-items-center">
						<h2 className="bold-font">Kommenterer</h2>
						<Plus size={"24px"} onClick={() => setAddComment(true)} style={{ color: "var(--red-primary)" }} />
					</div>
					<div className="w-100">
						<CommentSection onDelete={showDeletePopup} id="${ex_id}-cs" userId={userId} comments={comments} />
					</div>
					
				</div>
			</div>
			<Popup isOpen={isAddingComment} title={"Lägg till kommentar"} height={"50"} setIsOpen={setAddComment}>
				<TextArea onInput={e => setCommentText(e.target.value)} />
				<Button onClick={onAddComment}>Skicka</Button>
			</Popup>
			<ConfirmPopup id={`${ex_id}-confirm-popup`} showPopup={showConfirmPopup} setShowPopup={setShowConfirmPopup} onClick={onDeleteComment} />
		</div>
	)
}