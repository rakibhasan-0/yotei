import { Link } from 'react-router-dom';
import './EditButton.css';

/**
 * Defines the edit button.
 * 
 * @author Team Capriciosa (Group 2)
 * @version 1.0
 */
function EditButton(props) {
    return (
        <div>
            <Link className="btn btn-edit container-fluid" state={{workout: props.workout}} to={props.linkTo}>
                <img src="/edit.svg" alt="edit icon"/>
            </Link>
        </div>
    );
}

export default EditButton;