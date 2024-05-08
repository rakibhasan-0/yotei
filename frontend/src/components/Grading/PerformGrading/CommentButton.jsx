import  "react-bootstrap-icons"

/**
 * This component is representing a commentbutton during
 * grading an examination
 *
 * @author Team Apelsin (Group 5)
 * @version 1.0
 * @since 2024-05-02
 */


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function CommentButton( {id, onClick}) {
	return (
		<div  id={id} onClick={onClick}>
			<i className="bi bi-file-text h2"/>
		</div>
	)
}