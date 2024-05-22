import { X } from "react-bootstrap-icons"
import styles from "./PopupSmall.module.css"
import React, { useEffect } from "react"
import Divider from "../Divider/Divider"
import Button from "../Button/Button"


/**
 * PopupMini is a component that creates a mini popup window with a title and a close button.
 * Mostly used for the exercise and technique detail popups 
 * 
 * 
 * Props:
 *     title     @type {string}   - Sets the title of the popup window. Empty title
 * 							        omits the line under the title
 *     id        @type {string}   - Sets the id of the popup window
 * 	   isOpen    @type {boolean}  - Sets if popup should be visible or not
 *     setIsOpen @type {useState} - Sets the state of the popup window
 * 	   style     @type {object}   - Additional styles to add to the popup container.
 * 	   isNested  @type {boolean}  - disables the tinted background and fills the parent container. 
 * 								    Should be used in nested popups.
 *
 * Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
*
*	return (
*		<div>
*			<PopupSmall id={"test-popup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup} direction={startRedirection}  >
<>some children</>
</PopupSmall>
*			<RoundButton onClick={() => setShowPopup(true)} />
*		</div>
* 	)
*
* @author Team Kiwi Group 2
* @version 1.0
* @since 2024-05-22
*/
export default function PopupSmall({ title, id, isOpen, setIsOpen, children, isNested, style, onClose, zIndex, direction }) {

	// Synchronize react state with CSS-styling in browser
	useEffect(() => {
		// The body scroll should not be disabled when a nested popup is closed.
		// That should be done when a non-nested popup is closed.
		if (isNested) return
		// If it is nested, these things are already applied.
		document.body.style.overflowY = isOpen ? "hidden" : "visible"
		document.body.style.touchAction = isOpen ? "none" : "auto"
		document.body.style.height = isOpen ? "100vh" : "auto"
	}, [isNested, isOpen])

	if (!isOpen) return

	return (
		<>
			<div className={styles.backdrop} style={{ zIndex: zIndex ? zIndex - 10 : 90 }} onClick={() => {
				setIsOpen(false)
				if (onClose) onClose()
			}}
			/>
			<div
				className={styles.container}
				id={id}
				style={style}
			>
				<div className={styles.topbar}>
					{title && <Divider title={title} option="h1_center" />}
					<button
						className={styles.closebutton}
						onClick={() => {
							setIsOpen(false)
							if (onClose) onClose()

						}}
					>
						<X width={44} height={44} color="black" />
					</button>
				</div>
				<div className={styles.mainText}>
					{children}
				</div>

				<div className={styles.buttonContainer}>
					<Button
						id="continue-button"
						outlined={false}
						width="100%"
						onClick={direction}
					>
						<p>Ja</p>
					</Button>

					<Button
						id="continue-button"
						outlined={true}
						width="100%"
						onClick={() => {
							setIsOpen(false)
							if (onClose) onClose()

						}}
					>
						<p>Nej</p>
					</Button>
				</div>
			</div>
		</>
	)
}