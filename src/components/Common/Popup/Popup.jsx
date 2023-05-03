import { X } from "react-bootstrap-icons"
import "./Popup.css"
import React from "react"

/**
 * Popup is a component that creates a popup window with a title and a close button.
 * 
 * 
 * Props:
 *     title @type {string}  - Sets the title of the popup window
 *     id @type {string} - Sets the id of the popup window
 * 	   isOpen @type {boolean} - Sets if popup should be visible or not
 *     setIsOpen @type {useState} - Sets the state of the popup window
 *
 * Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *		return (
 *			<div>
 *				<button onClick={() => setShowPopup(true)}>Skapa teknik</button>
 *				<Popup isOpen={showPopup} setIsOpen={setShowPopup} title="Skapa teknik">
 *					<InputTextField placeholder="Namn"></InputTextField>
 *				</Popup>
 *			</div>
 *		)
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-02
 */
export default function Popup({ title, id, isOpen, setIsOpen, children }) {
	if (!isOpen)
		return null

	return (
		<>
			<div className="popup-bg" onClick={() => setIsOpen(false)} />
			<div className="popup" id={id}>
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
