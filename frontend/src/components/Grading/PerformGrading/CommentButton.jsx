import Button from "./../../Common/Button/Button.jsx"
import {Sliders} from "react-bootstrap-icons"
/**
 * THIS IS A WORK IN PROGRESS.
 *
 * @author Team Apelsin (Group 5)
 * @version 1.0
 */

/**
 *
 * @param showComment
 * @param buttonToggle
 * @returns {JSX.Element}
 * @constructor
 */
export default function CommentButton( { showComment, buttonToggle } ) {
	return (
		<div>
			<Button
				id={"comment-button"}
				onClick={showComment}
				outlined={false}
				isToggled={buttonToggle}
				width='40px'>
				<Sliders/>
			</Button>
		</div>
	)
}