import React, {useEffect, useState} from "react";
import "./ExerciseComments.css"
import { useContext } from "react";
import { AccountContext } from "../../context";

/**
 * Comment section for exercise details page.
 * @author Team 3 Hawaii
 */
export default function ExerciseCommentSection ({ex_id}) {
    const [commentList, setCommentList] = useState([])
    const [comment, setComment] = useState('');

    const {token} = useContext(
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

        /*const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                token
            },
            body: JSON.stringify({
                commentText: comment
            })
        };*/

        // FIXME: Används verkligen detta???
        //const response = await fetch(`/api/comment/exercise/add?id=${ex_id}`, requestOptions);
        //const data = await response.json();

        await fetchComments()
        setComment('')
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
            };
            
            const response = await fetch(`/api/comment/delete?id=${comment.commentId}`, requestOptions);
            const data = await response;
            
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
        const response = await fetch(`/api/comment/exercise/get?id=${ex_id}`, {headers:{token}});
        const data = await response.json()
        setCommentList(data)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                fetchComments()
            } catch (error) {
                console.log("error", error);
                alert("Could not get comments for the exercise")
            }
        };
        fetchData()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <div className={"comment-container"}>
                {/*Ask the user for the name of the exercise*/}
                <div className={"add-comment"}>
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
                {commentList.map((comment) => (
                <div className="comment" key={comment.commentId}>
                    <p className="comment-header">{comment.commentText}</p>
                    <div className="comment-footer">
                        <button className="comment-footer-delete button-details" onClick={() => deleteComment({comment})}>Ta bort
                        </button>
                    </div>
                </div>
            ))}
        </div>)
    }

    /**
     * The returned component.
     */
    return (
        <div className="comment-box">
            <div className="comment-list">{getComments()}</div>
        </div>
    );
}
