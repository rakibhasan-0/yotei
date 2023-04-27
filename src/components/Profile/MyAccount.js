import Button from "react-bootstrap/Button"
import ChangePasswordForm from "../../components/Forms/ChangePasswordForm"
import ChangeUsernameForm from "../../components/Forms/ChangeUsernameForm"
import "./MyAccount.css"
import { logOut } from "/src/utils"

/**
 * Page for viewing various features related to the user
 * @author Team Quattro Formaggio (Group 1) 
 */
function MyAccount() {

	return (
		<div>
			<div className="btn-logout-container">
				<Button className="btn btn-admin btn-color container-fluid" type="button" onClick={() => logOut()}>
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

export default MyAccount