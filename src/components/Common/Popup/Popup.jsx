import { X } from "react-bootstrap-icons"
import "./Popup.css"
import React, { useEffect } from "react"

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
 * 	   isNested @type {boolean} - disables the tinted background and fills the parent container. 
 * 								  Should be used in nested popups.
 * 	   useNoHeightWidth @type {boolean} - disables the height and width properties of the popup.
 * 					Should be used when the popup should adjust its size to its content.
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
 * @author Team Medusa, Team Chimera
 * @version 1.1
 * @since 2023-05-16
 */
export default function Popup({ title, id, isOpen, setIsOpen, children, width, height, isNested, maxWidth, maxHeight, useNoHeightWidth }) {

	useEffect(() => {
		// Locks the scroll of the parent when the popup is not nested
		if (!isNested) {
			document.body.style.overflowY = isOpen ? "hidden" : "visible"
			document.body.style.touchAction = isOpen ? "none" : "auto"
		}
	}, [isOpen, isNested])

	if (!isOpen) { return null }

	const background = isNested ? "popup-no-bg" : "popup-bg"

	let popupStyle = {}

	if (!useNoHeightWidth) {
		popupStyle = {
			width: "90%",
			height: "95%",
			maxWidth: `${maxWidth}px`,
			maxHeight: `${maxHeight}px`
		}
		if (width) {
			popupStyle.width = `${width}%`
		}
		if (height) {
			popupStyle.height = `${height}%`
		}

	}

	return (
		<>
			<div className={background} onClick={() => setIsOpen(false)} />
			<div
				className={`popup ${isNested && "popup-nested"}`}
				id={id}
				style={popupStyle}>

				<div className="popup-topbar">
					{title && <h1 className="popup-title" role="title">{title}</h1>}
					<button className="popup-closebutton" onClick={() => setIsOpen(false)}>
						<X width={44} height={44} color="black" />
					</button>
					{title && <div className="popup-horizontal-line" />}
				</div>
				<div className="popup-content">
					{children}
				</div>
			</div>
		</>
	)
}
