import Popup from "../Popup/Popup"
import styles from "./ConfirmPopup.module.css"
import Button from "../Button/Button"

/**
 * ConfirmPopup is a component that creates a popup window with a close button a back button and a delete button that runs an inputed function.
 *
 * Props:
 *    showPopup    @type {Boolean}  Sets if popup should be visible or not
 *    id 		   @type {String}   Sets the id of the popup window
 *    setShowPopup @type {useState} Sets the state of the popup window
 * 	  onClick	   @type {Function} For the delete button to do something
 *    popupText    @type {String}   Text to be displayed in the popup
 *    confirmText  @type {String}   Text to be displayed on confirm-button, default is: "Radera"
 * 	  backText     @type {String}   Text to be displayed on back-button, default is: "Tillbaka"
 * 
 * Example usage:
 *  
 *	  const [showPopup, setShowPopup] = useState(false)
 *    const [deleteVar, setDeleteVar] = useState(false)
 *
 * @author Team Chimera
 * @version 1.2
 * @since 2023-05-17
 * @updated 2023-05-30, updated documentation
 * 
 */
export default function ConfirmPopup({ onClick, id, showPopup, setShowPopup, popupText, confirmText, backText, zIndex }) {
	const deleteClickHandler = () => {
		onClick()
		setShowPopup(false)
	}
	return (
		<Popup
			id={id}
			zIndex={zIndex}
			isOpen={showPopup}
			setIsOpen={setShowPopup}
			style={{
				maxHeight: "300px",
				maxWidth: "333px",
				height: "unset",
				zIndex: zIndex ? zIndex : "100"
			}}
		>
			<div className={styles.titleContainer} id={`${id}-text`}>
				<h2>{popupText}</h2>
			</div>	
			<div className={styles.outerButtonpanel}>
				<div className={styles.innerButtonpanel} id={`${id}-buttons`}>
					<Button width='110px' outlined='false' onClick={() => setShowPopup(false)}><h2>{backText ? backText : "Tillbaka"}</h2></Button>
					<Button width='110px' onClick={deleteClickHandler}><h2>{confirmText ? confirmText : "Ta bort"}</h2></Button>
				</div>
			</div>
		</Popup>
	)
}