import { X } from "react-bootstrap-icons"
import styles from "./Popup.module.css"
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
 * 	   style @type {object} - Additional styles to add to the popup container.
 * 	   isNested @type {boolean} - disables the tinted background and fills the parent container. 
 * 								  Should be used in nested popups.
 *
 *Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
 *
 *	return (
 *		<div>
 *			<Popup id={"test-popup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup}>
				<>some children</>
			<Popup>
 *			<RoundButton onClick={() => setShowPopup(true)} />
 *		</div>
 * 	)
 *
 * @author Team Medusa, Team Chimera
 * @version 3.0
 * @since 2023-05-16
 */
export default function Popup({ title, id, isOpen, setIsOpen, children, isNested, style}) {

	// Synchronize react state with CSS-styling in browser
	useEffect(() => {
		// The body scroll should not be disabled when a nested popup is closed.
		// That should be done when a non-nested popup is closed.
		if(isNested) return
		// If it is nested, these things are already applied.
		document.body.style.overflowY = isOpen ? "hidden" : "visible"
		document.body.style.touchAction = isOpen ? "none" : "auto"
		document.body.style.height = isOpen ? "100vh" : "auto"
	}, [isNested, isOpen])

	if (!isOpen) return

	return (
		<>
			<div className={styles.backdrop} onClick={() => setIsOpen(false)}/>
			<div
				className={styles.container}
				id={id}
				style={style}
			>
				<div className={styles.topbar}>
					{title && <h1 className={styles.title} role="title">{title}</h1>}
					<button
						className={styles.closebutton}
						onClick={() => setIsOpen(false)}
					>
						<X width={44} height={44} color="black"/>
					</button>
					{title && <div className={styles.horizontalLine} />}
				</div>
				<div className={styles.content} id = "scrollable-content">
					{children}
					{/* This div is here to force the browser to make this container scrollable
						It needs to be here so that Safari prioritizes scrolling this container
						instead of the body. */}
					<div style={{opacity: 0}}>k</div>
				</div>
			</div>
		</>
	)
}
