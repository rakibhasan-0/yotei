import React from "react"
import Popup from "../Popup/Popup"

/**
 * MiniPopup is a component that creates a mini popup window with a title and a 
 * close button. 
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
 *  Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *
 *	return (
 *		<div>
 *			<MiniPopup id={"test-miniPopup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup}>
 *			</MiniPopup>
 *			<RoundButton onClick={() => setShowPopup(true)} />
 *		</div>
 * 	)
 *
 * @author Griffin & Medusa
 * @since 2023-05-05
 * @version 2.0
 */
export default function MiniPopup({ title, id, isOpen, setIsOpen, children }) {

	return (
		<Popup id={id} isOpen={isOpen} setIsOpen={setIsOpen} style={{maxWidth: "350px", maxHeight: "250px"}}>
			<h1>{title}</h1>
			{children}
		</Popup>
	)
}
