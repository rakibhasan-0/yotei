import { Trash } from "react-bootstrap-icons"
import styles from "./CommentSection.module.css"
import { isAdmin } from "../../../utils"
import { useContext} from "react"
import { AccountContext } from "../../../context"

/**
 * A comment section, used to display comments.#$
 * User and Editors can only delete their own comment, but Admin can delete all comments.
 *  
 *  Props:
 *  	userId   @type {String}   userId Id of the current user
 *  	id 		 @type {String}   An id for the comment section
 *  	comments @type {Object}   Comment object as shown above
 * 		onDelete @type {Function} A delete function to be run with commentID when comment is to be deleted.
 * 
 * Example usage:
 * comments = [
 *   {
 *       "commentId": 3,
 *       "workoutId": null,
 *       "exerciseId": 285,
 *       "userId": 1,
 *       "commentText": "Buh hu",
 *       "date": "2023-05-09",
 *       "user": "admin"
 *   }
 * ]
 * 
 * @author Chimera (Gruoup 4) & Cyclops(Group 5)
 * @since 2023-05-30
 * @version 3.0
*/


export default function CommentSection({ id, userId, comments, onDelete }) {
	
	const accountRole = useContext(AccountContext)
	
	return(
		<div id={id} className="w-100 d-flex flex-column align-items-center">
			{comments?.map(comment => (
				<div style={{border: "1px solid #B4B4B4", borderRadius: "5px"}} className="w-100 m-1 p-1 d-flex flex-column" key={comment.commentId}>
					<div className="d-flex justify-content-between align-items-center">
						<div className="d-flex align-items-center">
							<i className="bi bi-person m-0 p-0" style={{fontSize:"1.2rem"}}/>
							<p className="font-weight-bold m-0 ml-2">{comment.user} {userId == comment.userId && <span className="font-weight-light">(jag)</span>}</p>
						</div>
						<p className="m-0 font-italic" style={{color: "#B4B4B4"}}>{comment.date}</p>
				
					</div>
					<p className={`mt-2 ${styles.text}`}>{comment.commentText}</p>
					{(isAdmin(accountRole) || userId == comment.userId) && 
					<div className="d-flex align-items-end flex-column">
						<Trash
							size="24px"
							color="var(--red-primary)"
							style={{cursor: "pointer"}}
							onClick={() => onDelete(comment.commentId)}
						/>
					</div>
					}
				</div>
			))}
		</div>
	)
}