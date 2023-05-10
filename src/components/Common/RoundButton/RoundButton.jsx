import { useNavigate } from "react-router-dom"
import "./RoundButton.css"

/**
 * Defines the button to add activity. Props: onClick, children, linkTo, id
 * 
 * Use linkTo for changing page and onClick for custom 
 *
 * @author Team Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
function RoundButton({onClick, children, linkTo, id}) {
	const navigate = useNavigate()

	return (
		<div id={id} onClick={linkTo != null ? () => navigate(linkTo) : onClick} className="btn btn-color btn-add-activity container-fluid">
			{children}
		</div>
	)
}



export default RoundButton