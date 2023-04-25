import Button from 'react-bootstrap/Button';
import { Cookies } from 'react-cookie';
import ChangePasswordForm from '../../components/Forms/ChangePasswordForm';
import ChangeUsernameForm from '../../components/Forms/ChangeUsernameForm';
import './MyAccount.css';
import {useNavigate} from "react-router-dom";

/**
 * Page for viewing various features related to the user
 * @author Team Quattro Formaggio (Group 1) 
 */
function MyAccount() {
    const cookies = new Cookies();
    const navigate = useNavigate();

    /**
     * Function to log out the user.
     */
    function logout() {
        cookies.remove('token')
        navigate("/");
    }


    return (
        <div>
            <div className="btn-logout-container">
                <Button className="btn btn-admin btn-color container-fluid" type="button" onClick={() => logout()}>
                        Logga ut
                </Button>
            </div>

            <div className="new-password-container card bg-light center">
                <ChangePasswordForm />
            </div>

            <div className="new-username-container card bg-light center">
                <ChangeUsernameForm />
            </div>
        </div>
    )
}

export default MyAccount;