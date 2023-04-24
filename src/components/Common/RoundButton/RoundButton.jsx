import './RoundButton.css';

/**
 * Defines the button to add activity. Props: onClick, children
 *
 * @author Team Chimera (Group 4)
 * @version 1.0
 */
function RoundButton(props) {
    return (
        <div onClick={props.onClick} className="btn btn-color btn-add-activity container-fluid">
                <p className="py-1">
                    {props.children}
                </p>
        </div>
    );
}

export default RoundButton;