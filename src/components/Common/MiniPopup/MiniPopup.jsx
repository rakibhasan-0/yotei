import { X } from "react-bootstrap-icons"
import "./MiniPopup.css"
import React from "react"

/**
 * MiniPopup is a component that creates a mini popup window with a title and a 
 * close button. This popup serves as an alternative for Popup.jsx where a
 * smaller popup with rounded corners and shadow is required by design.
 * 
 * 
 * Props:
*     	title @type {string}  - Sets the title of the popup window. Empty title
* 							   omits the line under the title
*     	id @type {string} - Sets the id of the popup window
* 	   	isOpen @type {boolean} - Sets if popup should be visible or not
*     	setIsOpen @type {useState} - Sets the state of the popup window
* 		titleTopMargin @type {pixels} - Sets the top margin of the title, 
										be cautious since a too high margin will
										result in title placed beneath the popup
 *
 *Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *
 *	return (
 *		<div>
 *			<MiniPopup id={"test-miniPopup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup} titleTopMargin={14}>
 *			</MiniPopup>
 *			<RoundButton onClick={() => setShowPopup(true)} />
 *		</div>
 * 	)
 *
 * @author Griffin
 * @since 2023-05-05
 * @version 1.0
 */
export default function MiniPopup({ title, id, isOpen, setIsOpen, children, noBackground, titleTopMargin }) {
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
			<div className="miniPopup" id={id}>
				<div className="topbar">
					{title && <h1 className="title" role="title" style={{ marginTop: `${titleTopMargin}px` }}>{title}</h1>}
					<button className="closebutton" onClick={() => setIsOpen(false)}>
						<X width={44} height={44} />
					</button>
				</div>
				<div className="popup-content">
					{children}
				</div>
			</div>
		</>
	)
}
