import { X } from "react-bootstrap-icons"
import styles from "./PopupSmall.module.css"
import React, { useEffect } from "react"
import Divider from "../Divider/Divider"
import Button from "../Button/Button"


/**
 * Popup is a component that creates a popup window with a title and a close button.
 * 
 * 
 * Props:
 *     title     @type {string}   - Sets the title of the popup window. Empty title
 * 							        omits the line under the title
 *     id        @type {string}   - Sets the id of the popup window
 * 	   isOpen    @type {boolean}  - Sets if popup should be visible or not
 *     setIsOpen @type {useState} - Sets the state of the popup window
 * 	   children  @type {JSX}      - Children something unclear?  
 * 	   style     @type {object}   - Additional styles to add to the popup container.
 * 	   isNested  @type {boolean}  - disables the tinted background and fills the parent container. 
 * 								    Should be used in nested popups.
 *     divderOption @type {string} - "h1_left" is default, but can be changed to any option in Divider 
 * 	   onClose @type {Function} - Function to be run when the popup closes.
 *     zIndex @type {Int} - The zIndex of the popup
 * 	   direction @type {Function} Function for redirection
 *
 * Example usage:
 *  
 *	const [showPopup, setShowPopup] = useState(false)
*
*	return (
*		<div>
*			<PopupSmall id={"test-popup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup} direction={startRedirection}  >
*			<>some children</>
*			</PopupSmall>
*			<RoundButton onClick={() => setShowPopup(true)} />
*		</div>
* 	)
*
* @author Team Medusa, Team Chimera, Team Pomegranate
* @version 3.0
* @since 2024-05-16
* @updated 2024-05-29 Kiwi, Updated props comment
*/
export default function PopupSmall({ title, id, isOpen, setIsOpen, children, isNested, style, onClose, zIndex, direction }) {

	useEffect(() => {
		if (isNested) return
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
			<div className={styles.container} id={id} style={style}>
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


