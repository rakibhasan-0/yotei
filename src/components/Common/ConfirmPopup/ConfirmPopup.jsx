import Popup from "../Popup/Popup"
import "./ConfirmPopup.css"
import Button from "../Button/Button"

/**
 * ConfirmPopup is a component that creates a popup window with a close button a back button and a delete non functional delete button.
 * 
 * 
 * Props:
 *     id @type {string} - Sets the id of the popup window
 * 	   showPopup @type {boolean} - Sets if popup should be visible or not
 *     setShowPopup @type {useState} - Sets the state of the popup window
 * 	   maxWidth @type {pixels} - Max width of the popup window
 * 	   maxHeight @type {pixels} - Max width of the popup window
 *     onClick @type {function} - For the delete button to do something
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
 * @version 1.0
 * @since 2023-05-04
 */

export default function ConfirmPopup({ onClick, id, showPopup, setShowPopup, popupText}) {
	const deleteClickHandler = () => {
		onClick()
		setShowPopup(false)
	}
	return (
		<Popup
			id={id}
			isOpen={showPopup}
			setIsOpen={setShowPopup}
			useNoHeightWidth={true}
			maxHeight={231}
			maxWidth={333}>
			<div id={`${id}-text`}>
				<p className="font">{ popupText }</p>
			</div>	
			<div className="outer-buttonpanel">
				<div className="inner-buttonpanel" id={`${id}-buttons`}>
					<Button width='100px'  outlined='false' onClick={() => setShowPopup(false)}>Tillbaka</Button>
					<Button width='100px'  onClick={deleteClickHandler}>Radera</Button>
				</div>
			</div>
		</Popup>
	)
}