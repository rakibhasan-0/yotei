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
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import ActivityDelete from "../../components/Activity/ActivityDelete/ActivityDelete"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import { isEditor } from "../../utils"
import {setError as setErrorToast} from "../../utils"

/**
 * A component for displaying details about an exercise.
 * 
<<<<<<< HEAD
 * @author Chimera, Phoenix, Team Coconut, Team Durian, Team Orange
 * @since 2024-04-23
=======
 * @author Chimera, Phoenix, Team Coconut, Team Durian
 * @since 2024-04-18
>>>>>>> main
 * @version 2.2
 * @returns A page for displaying details about an exercise.
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
	const [showDiscardComment, setShowDiscardComment] = useState(false)
	const [error, setError] = useState()
	const navigate = useNavigate()
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const accountRole = useContext(AccountContext)


	const fetchComments = () => {
		fetch(`/api/comment/exercise/get?id=${ex_id}`, {
			headers: { token }
		})
			.then(res => res.json())
			.then(data => setComments(data))
			.catch(ex => {
				setErrorToast("Kunde inte hämta kommentarer")
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
				setErrorToast("Kunde inte hämta taggar")
				console.error(ex)
			})
	}, [token, ex_id])

	/**
     * Handles the deletion of an exercise by sending a DELETE request to the API.
     * Navigates back to the previous page if the deletion is successful.
     * Displays an error toast and logs the error if the deletion fails.
     */
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
			setErrorToast("Kunde inte ta bort övningen!")
			console.error(error)
		}
	}

	/**
     * Handles the deletion of a comment by sending a DELETE request to the API.
     * Removes the deleted comment from the comments state and clears the selectedComment state.
     * Displays an error toast and logs the error if the deletion fails.
     */ 
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
			setErrorToast("Kunde inte ta bort kommentaren")
			console.error(error)
			return
		}
		setComments(comments => comments.filter(comment => comment.commentId !== id))
		setSelectedComment()
		setShowDeleteComment(false)
	}
    
	/**
     * Handles the addition of a comment by sending a POST request to the API.
     * Validates the comment text and displays an error if it is empty.
     * Clears the comment text and sets addComment to false after a successful addition.
     * Fetches the updated comments by calling fetchComments.
     */
	const onAddComment = async () => {
<<<<<<< HEAD
		if (!commentText || !commentText.trim() || commentText.length === 0) {
=======
		if (!commentText || commentText.trim().length === 0) {
>>>>>>> main
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
			setErrorToast("Ett fel uppstod när kommentaren skulle läggas till")
			return
		}
		onDiscardComment()
		// TODO: The comments add method does not
		// return the comment id, so we have to
		// refetch the comments after adding one.
		// This should probably be fixed in the API
		fetchComments()
	}

	/**
	 * Closes the addComment popup, unless it contains text in which case it shows
	 * a warning that the user input will be lost.
	 * @param {bool} show Whether the add comment popup should be shown.
	 */
	const toggleAddComment = async (show) => {
		if (!show && commentText && commentText.trim().length > 0) {
			setShowDiscardComment(true)
			return
		}
		setAddComment(show)
	}

	/**
	 * Discards the current comment draft and closes the comment input popup.
	 */
	const onDiscardComment = async () => {
		setCommentText("")
		setAddComment(false)
	}

	if (error) {
		return <ErrorState message={error} onBack={() => navigate("/exercise")} />
	}
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Övningar</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{exercise?.name}</h1>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
				<div className="d-flex align-items-center">
					<Clock />
					<p style={{ marginBottom: "0", marginLeft: "5px" }}>{exercise?.duration} min</p>
				</div>
				{isEditor(accountRole) && (
					<div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
						<Pencil
							onClick={() => {
								window.localStorage.setItem("popupState", true)
								navigate("/excercise/edit/" + ex_id)
							}
							}
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

			<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left", marginTop: "5px", alignContent: "left" }}>Beskrivning</h2>
			<p style={{ textAlign: "left", whiteSpace: exercise?.description ? "pre-line" : "normal", fontStyle: !exercise?.description ? "italic" : "normal", color: !exercise?.description ? "var(--gray)" : "inherit" }}>
				{exercise?.description || "Beskrivning saknas."}
			</p>


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
			<div style={{ marginTop: "1rem", marginBottom:"1rem" }}>
				<Button outlined={true} onClick={() => navigate(-1)}><p>Tillbaka</p></Button>
			</div>
<<<<<<< HEAD
			<Popup isOpen={isAddingComment} title={"Lägg till kommentar"} style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset"}} setIsOpen={setAddComment} onClose={() => setCommentError(false)}>
				<TextArea errorMessage={commentError} onInput={e => {setCommentText(e.target.value); setCommentError(false)}} />
=======
			<Popup isOpen={isAddingComment} title={"Lägg till kommentar"} style={{ overflow: "hidden", overflowY: "hidden", maxHeight: "85vh", height: "unset"}} setIsOpen={toggleAddComment}>
				<TextArea errorMessage={commentError} onInput={e => setCommentText(e.target.value)} autoFocus={true} />
>>>>>>> main
				<Button onClick={onAddComment}>Lägg till</Button>
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
			<ConfirmPopup
				popupText={"Är du säker på att du vill ta bort kommentarsutkastet?"}
				showPopup={showDiscardComment}
				onClick={() => onDiscardComment()}
				setShowPopup={() => setShowDiscardComment(false)}
				zIndex={200} // Above the comment popup.
			/>

			<div>
				<Popup
					title="Ta bort övning"
					isOpen={showDeletePopup}
					setIsOpen={setShowDeletePopup}
					style={{height: "unset"}}>
					<ActivityDelete id={"exercise-delete-popup"} activityID={ex_id} name={exercise?.name} setIsOpen={setShowDeletePopup} what={"Övning"}/>
				</Popup>
			</div>
		</div>
	)
}