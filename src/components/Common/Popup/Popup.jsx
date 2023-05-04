import { X } from "react-bootstrap-icons"
import "./Popup.css"
import React from "react"

/**
 * Popup is a component that creates a popup window with a title and a close button.
 * 
 * 
 * Props:
 *     title @type {string}  - Sets the title of the popup window. Empty title
 * 							   omits the line under the title
 *     id @type {string} - Sets the id of the popup window
 * 	   isOpen @type {boolean} - Sets if popup should be visible or not
 *     setIsOpen @type {useState} - Sets the state of the popup window
 * 	   width @type {percentage} - Width of the popup as a percentage of the screen
 * 	   maxWidth @type {pixels} - Max width of the popup window
 * 	   height @type {pixels} - Height of the popup as a percentage of the screen
 * 	   maxHeight @type {pixels} - Max width of the popup window
 * 	   noBackground @type {boolean} - disables the tinted background. 
 * 									  Should be used in nested popups.
 *
 *Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *
 *	return (
 *		<div>
 *			<Popup id={"test-popup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup} width={60} height={40}>
 *			</Popup>
 *			<RoundButton onClick={() => setShowPopup(true)} />
 *		</div>
 * 	)
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-02
 */
export default function Popup({ title, id, isOpen, setIsOpen, children, width, height, noBackground, maxWidth, maxHeight }) {
	if (!isOpen)
		return null
	else 
		document.body.style.overflowY = "hidden"

	const closePopup = () => {
		setIsOpen(false)
		document.body.style.overflowY = "visible"
	}

	return (
		<>
			{noBackground ? <div className="popup-no-bg" onClick={closePopup} /> : <div className="popup-bg" onClick={closePopup}  />}
			<div className="popup" id={id} style={{width: `${width}%`, height: `${height}%`, maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px`}}>
				<div className="topbar">
					{title && <h1 className="title" role="title">{title}</h1>}
					<button className="closebutton" onClick={() => setIsOpen(false)}>
						<X width={44} height={44} />
					</button>
					{title && <div className="horizontal-line" />}
				</div>
				<div className="popup-content">
					{children}
				</div>
			</div>
		</>
	)
}
