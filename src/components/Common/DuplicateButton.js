import { Link } from 'react-router-dom';
import './EditButton.css';

/**
 * Defines the Duplicate button.
 *
 * @author Team Capriciosa (Group 2)
 * @version 1.0
 * @deprecated use Button.js instead
 */
function DuplicateButton(props) {
    // adds copy to the end of the name
    props.workout.name = props.workout.name + " (copy)";
    return (
        <div>
            <Link className="btn btn-edit container-fluid" state={{workout: props.workout}} onClick={console.log(props)} to={props.linkTo}>
                <img src="/copy.svg" alt="copy icon"/>
            </Link>
        </div>
    );
}

export default DuplicateButton;