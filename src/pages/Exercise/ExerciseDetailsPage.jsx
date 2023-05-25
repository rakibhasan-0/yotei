import React, { useContext, useEffect, useState } from "react"
import { Trash, Pencil, Clock, Plus } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import { useNavigate, useParams } from "react-router"
import CommentSection from "../../components/Common/CommentSection/CommentSection"
import Popup from "../../components/Common/Popup/Popup"
import TextArea from "../../components/Common/TextArea/TextArea"
import Button from "../../components/Common/Button/Button"
import Tag from "../../components/Common/Tag/Tag"
import Gallery from "../../components/Gallery/Gallery"
import { toast } from "react-toastify"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import ActivityDelete from "../../components/Activity/ActivityDelete/ActivityDelete"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import ExerciseEdit from "./ExerciseEdit"
import { isEditor } from "../../utils"
/**
 * A page for displaying details about an exercise.
 * 
 * @author Chimera
 * @since 2023-05-16
 * @version 1.0
 */

export default function ExerciseDetailsPage() {
	const { ex_id } = useParams()
	const { token, userId } = useContext(AccountContext)
	const [exercise, setExercise] = useState()
	const [comments, setComments] = useState()
	const [tags, setTags] = useState()
	const [isAddingComment, setAddComment] = useState(false)
	const [selectedComment, setSelectedComment] = useState()
	const [commentText, setCommentText] = useState()
	const [commentError, setCommentError] = useState()
	const [showAlert, setShowAlert] = useState(false)
	const [showDeleteComment, setShowDeleteComment] = useState(false)
	const [error, setError] = useState()
	const navigate = useNavigate()
	const [showEditPopup, setShowEditPopup] = useState(false)
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const accountRole = useContext(AccountContext)

	const fetchComments = () => {
		fetch(`/api/comment/exercise/get?id=${ex_id}`, {
			headers: { token }
		})
			.then(res => res.json())
			.then(data => setComments(data))
			.catch(ex => {
				toast.error("Kunde inte hämta kommentarer")
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
				setError("Kunde inte hämta övning")
				console.error(ex)
			})

		fetchComments()

		fetch(`/api/tags/get/tag/by-exercise?exerciseId=${ex_id}`, {
			headers: { token }
		}).then(res => res.json())
			.then(data => setTags(data))
			.catch(ex => {
				toast.error("Kunde inte hämta taggar")
				console.error(ex)
			})
	}, [token, ex_id])

	const onDelete = async () => {
		try {
			const response = await fetch("/api/exercises/remove/" + ex_id, {
				headers: { token }, method: "DELETE"
			})
			if (!response.ok) {
				throw new Error("Got a non ok status response from the API")
			}
			navigate(-1)
		} catch (error) {
			toast.error("Kunde inte ta bort övningen!")
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
			toast.error("Kunde inte ta bort kommentaren")
			console.error(error)
			return
		}
		setComments(comments => comments.filter(comment => comment.commentId !== id))
		setSelectedComment()
		setShowDeleteComment(false)
	}

	const onAddComment = async () => {
		if (!commentText || commentText.length === 0) {
			setCommentError("Kommentaren får inte vara tom")
			return
		}
		const response = await fetch(`/api/comment/exercise/add?id=${ex_id}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				token,
				userId
			},
			body: JSON.stringify({
				commentText
			})
		})
		if (response.status != 201) {
			toast.error("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		setCommentText("")
		setAddComment(false)
		// TODO: The comments add method does not
		// return the comment id, so we have to
		// refetch the comments after adding one.
		// This should probably be fixed in the API
		fetchComments()
	}

	if (error) {
		return <ErrorState message={error} onBack={() => navigate("/exercise")} />
	}
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div style={{ display: "flex", justifyContent: "flex-start" }}>
				<div style={{ flex: "0 0 100%" }}>
					<div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<h1 style={{ marginTop: "0", textAlign: "left", marginRight: "auto" }}>
							{exercise?.name}
						</h1>
						{isEditor(accountRole) && (
							<div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
								<Pencil
									onClick={() => setShowEditPopup(true)}
									size="24px"
									style={{ color: "var(--red-primary)" }}
								/>
								<Trash
									onClick={() => setShowDeletePopup(true)}
									size="24px"
									style={{ color: "var(--red-primary)" }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "row", alignItems: "left", gap: "10px" }}>
				<Clock />
				<p style={{ marginBottom: "0" }}>{exercise?.duration} min</p>
			</div>

			<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left", marginTop: "5px", alignContent: "left" }}>Beskrivning</h2>
			{exercise?.description ? (
				<p style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", textAlign: "left" }}>{exercise.description}</p>
			) : (
				<p style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", fontStyle: "italic", color: "var(--gray)", textAlign: "left" }}>Beskrivning saknas.</p>
			)}

			{tags?.length > 0 && (
				<>
					<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left"}}>Taggar</h2>
					<div style={{ display: "flex", flexWrap: "wrap", marginBottom: "4px", gap: "10px" }}>
						{tags.map((tag, index) => (
							<Tag key={index} tagType={"default"} text={tag.tagName} />
						))}
					</div>
				</>
			)}

			<div>
				<Gallery id={ex_id} />
			</div>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h2 style={{ fontWeight: "bold", marginBottom: "0" }}>Kommentarer</h2>
				<Plus size={"24px"} onClick={() => setAddComment(true)} style={{ color: "var(--red-primary)", border: "2px solid var(--button-border)", borderRadius: "50%" }} />
			</div>
			<div style={{ width: "100%" }}>
				<CommentSection onDelete={id => {
					setSelectedComment(id)
					setShowDeleteComment(true)
				}} id={`${ex_id}-cs`} userId={userId} comments={comments} />
			</div>
			<div style={{ marginTop: "1rem" }}>
				<Button outlined={true} onClick={() => navigate(-1)}><p>Tillbaka</p></Button>
			</div>
			<Popup isOpen={isAddingComment} title={"Lägg till kommentar"} style={{ overflow: "hidden", overflowY: "hidden", height: "50%" }} setIsOpen={setAddComment}>
				<TextArea errorMessage={commentError} onInput={e => setCommentText(e.target.value)} />
				<Button onClick={onAddComment}>Skicka</Button>
			</Popup>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort övningen?"}
				showPopup={showAlert}
				onClick={() => onDelete()}
				setShowPopup={() => setShowAlert(false)}
			/>
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentaren?"}
				showPopup={showDeleteComment}
				onClick={() => onDeleteComment()}
				setShowPopup={() => setShowDeleteComment(false)}
			/>

			<div>
				<Popup
					title="Ta bort övning"
					isOpen={showDeletePopup}
					setIsOpen={setShowDeletePopup}>
					<ActivityDelete id={"exercise-delete-popup"} activityID={ex_id} name={exercise?.name} setIsOpen={setShowDeletePopup} what={"Övning"}/>
				</Popup>
			</div>

			<Popup
				title={"Redigera Övning"}
				id={"edit-exercise-popup"}
				isOpen={showEditPopup}
				setIsOpen={setShowEditPopup}
				noBackground={false}
			>
				<ExerciseEdit setShowPopup={setShowEditPopup} />
			</Popup>
		</div>
	)
}