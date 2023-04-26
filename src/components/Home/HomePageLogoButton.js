import "./HomePageLogoButton.css"
import { Link } from "react-router-dom"

/**
 * Defines the button used in the home page. 
 * 
 * @author Team Capricciosa (Group 2), Kebabpizza (Group 8)
 * @version 1.0
 * @deprecated use Button.js instead
 */
function HomePageLogoButton(props) {
	const buttonName = props.buttonName
	return (
		<div className="row col-12 mt-4">
			<Link to={props.linkTo} className="btn btn-color btn-home container-fluid">{buttonName}</Link>
		</div>
	)
}

export default HomePageLogoButton
