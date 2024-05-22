import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "./Dropdown.module.css"

/**
 * A generic list item that can be used in a list view,
 * with a customizable optional item on the left of the
 * component text. The component can be expanded, and
 * the children will be displayed.
 * 
 * The width of the component will be set by the parent.
 * 
 * Props:
 *	item     @type {JSX}      Optional JSX element to be displayed left of the text
 *	text     @type {String}   Text of the component
 *	children @type {JSX}      JSX element which will be displayed when the component is expanded
 *	centered @type {Boolean}  Boolean to set text as centered
 *	id       @type {String}   ID of the component
 * 	onClick  @type {Function} Function when an item is pressed in the drop down
 * 	checkBox @type {JSX}	  If a checkbox is wanted, send it as a prop
 * 	style	 @type {String}	  Send a string of CSS to style the div listHeader
 * 
 * Example usage:
 * 
 * <Dropdown id={"testList"} text="Dropdown List" centered={true} >
 * <p>This is a list item</p>
 * </Dropdown>
 * 
 * @author Chimera, Tomato (Group 6)
 * @since 2023-05-02
 * @updated 2023-05-30 Chimera, updated documentation
 * @uodate	2024-05-21 Tomato,	Added a checkbox so that a dropdown menu can have one if wanted. 
 * @version 2.1 
 */
export default function Component({ item, text, children, id, autoClose, errorMessage, onClick, checkBox, style}) {
	const [toggled, setToggled] = useState(false)
	const handleToggle = () => {
		
		if (autoClose !== false) {
			setToggled(false)
		}
	}

	const handleOnClick = (e) => {
		
		if(onClick) {
			onClick()
			
		}
		e.preventDefault()
	}

	
	const errorStyle = errorMessage?.length > 0 ? { border: "2px solid var(--red-primary)" } : {}
	return (
		<div className={styles.listLabel}>
			<div id={id} className={styles.listContainer} style={errorStyle}>
				<div style={style ? style : {}} className={!style ? styles.listHeader : ""} onClick={(e) => { setToggled(!toggled); handleOnClick(e)}} id={`${id}-header`}>
					{checkBox && (
						<div className={styles.check} onClick={(e) => e.stopPropagation()}>
							{checkBox}
						</div>
					)}
					
					<div className={styles.listItem}>
						{item}
					</div>
					<p className={styles.listText}>{text}</p>
					<div className={[styles.listToggle, toggled ? styles.listRotate : ""].join(" ")} id={`${id}-toggle-dropdown`}>
						<ChevronDown id={`${id}-dropdown`} size={28} />
					</div>
				</div>
				<div className={styles.listItemContainer} >
					<div className={styles.listChild} onClick={handleToggle} style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
						{children}
					</div> 
				</div>
			</div>
			<p className={styles.listErr}>{errorMessage}</p>
		</div>
	)
}
