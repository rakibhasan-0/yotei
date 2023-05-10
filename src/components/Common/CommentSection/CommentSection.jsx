/**
 * A comment section, used to display comments.#$
 * 
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
 * @author Chimera (Gruoup 4)
 * @since 2023-05-09
 * @version 1.0
 * @param id An id for the comment section
 * @param userId Id of the current user
 * @param comments Comment object as shown above
 * @param onDelete A delete function to be when comment is to be deleted. Sends commentId
 */
export default function CommentSection({ id, userId, comments, onDelete }) {
	return(
		<div id={id} className="w-100 d-flex flex-column justify-content-center align-items-center">
			{comments?.map(comment => (
				<div style={{border: "1px solid #B4B4B4", borderRadius: "5px"}} className="w-100 m-3 p-3 d-flex flex-column" key={comment.commentId}>
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
						<i style={{color:"#BD3B41", fontSize:"24px"}} onClick={() => onDelete(comment.commentId)} className="bi bi-trash "/>
					</div>
					}
				</div>
			))}
		</div>
	)
}
