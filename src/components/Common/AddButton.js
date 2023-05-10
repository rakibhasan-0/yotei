import "./AddButton.css"
import { useNavigate } from "react-router-dom"

/**
 * Defines the button to add elements.
 * 
 * Redirects to <navPath>, if defined.
 *
 * 
 * @author Capricciosa (2022-04-28), Calzone (2022-05-16), Hawaii (2022-05-16)
 * @version 2.0
 * @deprecated use RoundButton.jsx instead
 */
function AddButton(props) {

	const navigate = useNavigate()
    
	const buttonName = props.buttonName
	const navPath = props.navPath

	const response = () => {
		if (navPath) {
			navigate(navPath)
		} 
	}

	return (
		<button onClick={response} className="btn btn-color btn-add-activity container-fluid">
			<p className="py-1">{buttonName}</p>
		</button>
	)
}

export default AddButton