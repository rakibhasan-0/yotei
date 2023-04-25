import './AddActivityButton.css';
import { Link } from "react-router-dom";

/**
 * Defines the button to add activity.
 *
 * @author Team Capricciosa (Group 2) and Team Hawaii
 * @version 1.0
 * @deprecated use RoundButton.jsx instead
 */
function AddActivityButton(props) {
    const buttonName = props.buttonName;
    return (
        <div>
            <Link to={props.linkTo} className="btn btn-color btn-add-activity container-fluid"><p className="py-1">{buttonName}</p></Link>
        </div>
    );
}

export default AddActivityButton;