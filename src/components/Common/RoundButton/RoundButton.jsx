import { useNavigate } from 'react-router-dom';
import './RoundButton.css';

/**
 * Defines the button to add activity. Props: onClick, children, linkTo
 * 
 * Use linkTo for changing page and onClick for custom 
 *
 * @author Team Chimera (Group 4)
 * @version 1.0
 */
function RoundButton({onClick, children, linkTo}) {
    let navigate = useNavigate();

    function goTo() {
        console.log(linkTo);
        navigate(linkTo);
    }

    return (
        <div onClick={linkTo != null ? () => goTo(linkTo) : onClick} className="btn btn-color btn-add-activity container-fluid">
                <p className="py-1">
                    {children}
                </p>
        </div>
    );
}



export default RoundButton;