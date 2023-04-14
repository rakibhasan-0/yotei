import React, {useEffect, useState} from "react";
import "../Exercise/ExerciseComments.css"

/**
 * Comment section for exercise details page.
 * @author Team 3 Hawaii
 */
export default function TechniqueCommentSection ({technique_id}) {
    const [commentList, setCommentList] = useState([])
    const [comment, setComment] = useState('');

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
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                comment: comment
            })
        };

        await fetch(`/api/exercises/comment/?techniqueId=${technique_id}`, requestOptions);
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
        const requestOptions = {
            method: "DELETE"
        };

        const response = await fetch(`/api/exercises/techniqueId?id=${comment.id}`, requestOptions);
        const data = await response;

        if (data.status === 200) {
            setCommentList(commentList.filter(
                (c) => c.id !== comment.id
            ))
        }
    }

    /**
     * Fetches a comment based on the currently displayed exercises' id.
     * @returns {Promise<void>}
     */
    async function fetchComments() {
        const response = await fetch(`/api/exercises/comment?techniqueId=${technique_id}`);
        const data = await response.json();
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
            <div>
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
                            required/>
                    </form>
                    <button className="btn-done-2" type='button' onClick={() => onSubmitComment()}>
                        +
                    </button>
                </div>
                {commentList.map((comment) => (
                    <div className="comment" key={comment.id}>
                        <p className="comment-header">{comment.comment}</p>
                        <div className="comment-footer">
                            <button className="comment-footer-delete" onClick={() => deleteComment({comment})}>Ta bort
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )

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
