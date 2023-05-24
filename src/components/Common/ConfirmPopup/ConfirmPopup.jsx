import Popup from "../Popup/Popup"
import styles from "./ConfirmPopup.module.css"
import Button from "../Button/Button"

/**
 * ConfirmPopup is a component that creates a popup window with a close button a back button and a delete non functional delete button.
 * 
 * 
 * Props:
 *     id @type {string} - Sets the id of the popup window
 * 	   showPopup @type {boolean} - Sets if popup should be visible or not
 *     setShowPopup @type {useState} - Sets the state of the popup window
 *     onClick @type {function} - For the delete button to do something
 * 	   popupText @type {string} - Text to be displayed in the popup
 * 	   confirmText @type {string} - Text to be displayed on confirm-button, default is: "Radera"
 * 	   backText @type {string} - Text to be displayed on back-button, default is: "Tillbaka"
 *
 *Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *  const [deleteVar, setDeleteVar] = useState(false)
 *
 *	return (
 *		<div>
 *			<Popup id={"test-popup"} isOpen={showPopup} setIsOpen={setShowPopup} onClick={() => setdeleteVar(true)}/>
 *			<RoundButton onClick={() => setShowPopup(true)} />
 *		</div>
 * 	)
 *
 * @author Team Chimera
 * @version 1.1
 * @since 2023-05-16
 */

export default function ConfirmPopup({ onClick, id, showPopup, setShowPopup, popupText, confirmText, backText}) {
	const deleteClickHandler = () => {
		onClick()
		setShowPopup(false)
	}
	return (
		<Popup
			id={id}
			isOpen={showPopup}
			setIsOpen={setShowPopup}
			style={{
				maxHeight: "300px",
				maxWidth: "333px"
			}}
		>
			<div className={styles.titleContainer} id={`${id}-text`}>
				<h2>{popupText}</h2>
			</div>	
			<div className={styles.outerButtonpanel}>
				<div className={styles.innerButtonpanel} id={`${id}-buttons`}>
					<Button width='110px' outlined='false' onClick={() => setShowPopup(false)}><h2>{backText ? backText : "Tillbaka"}</h2></Button>
					<Button width='110px' onClick={deleteClickHandler}><h2>{confirmText ? confirmText : "Radera"}</h2></Button>
				</div>
			</div>
		</Popup>
	)
}