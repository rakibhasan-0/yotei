import {React} from "react"
import Button from "../Common/Button/Button"
import MiniPopup from "../Common/MiniPopup/MiniPopup"
import { useNavigate } from "react-router"
import "./PopupAdd.css"


/**
 * A component that should be used in the Plan page for when the user wants to add a new plan or a new session.
 * 
 * If the user clicks 'Planering' the user is redirected to /plan/create.
 * If the user clicks 'Tillfälle' the user is redirected to /session/create.
 * 
 * @author Griffin
 * @since 2023-05-03
 * @version 1.0
 */
export default function PopupAdd({id, isOpen, setIsOpen}) {
	const navigate = useNavigate()

	const navigateAndClose = path => {
		navigate(path)
		setIsOpen(false)
	}

	return(
		<MiniPopup id={id} title={"Lägg till"} isOpen={isOpen} setIsOpen={setIsOpen} titleTopMargin={14}>
			<div className="popupContainer">
				<div className="buttonContainer">
					<Button id="newPlan" onClick={() => navigateAndClose("/plan/create")} outlined={false}>Planering</Button>
					<Button id="newSession" onClick={() => navigateAndClose("/session/create")} outlined={false}>Tillfälle</Button>
				</div>
			</div>
		</MiniPopup>
	)
}
