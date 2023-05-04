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
 * 	   height @type {percentage} - Height of the popup as a percentage of the screen
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
export default function Popup({ title, id, isOpen, setIsOpen, children, width, height, noBackground }) {
	if (!isOpen)
		return null

	return (
		<>
			{noBackground ? <div className="popup-no-bg" onClick={() => setIsOpen(false)} /> : <div className="popup-bg" onClick={() => setIsOpen(false)} />}
			<div className="popup" id={id} style={{width: `${width}%`, height: `${height}%`}}>
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
