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
 *	item     @type {JSX}     Optional JSX element to be displayed left of the text
 *	text     @type {String}  Text of the component
 *	children @type {JSX}     JSX element which will be displayed when the component is expanded
 *	centered @type {Boolean} Boolean to set text as centered
 *	id       @type {String}  ID of the component
 * 
 * Example usage:
 * 
 * <Dropdown id={"testList"} text="Dropdown List" centered={true} >
 * <p>This is a list item</p>
 * </Dropdown>
 * 
 * @author Chimera
 * @since 2023-05-02
 * @updated 2023-05-30 Chimera, updated documentation
 * @version 2.1 
 */
export default function Component({ item, text, children, id, autoClose, errorMessage }) {
	const [toggled, setToggled] = useState(false)
	const onClick = () => {
		if (autoClose !== false) {
			setToggled(false)
		}
	}
	const style = errorMessage?.length > 0 ? { border: "2px solid var(--red-primary)" } : {}
	return (
		<label className={styles.listLabel}>
			<div id={id} className={styles.listContainer} style={style}>
				<div className={styles.listHeader} onClick={() => setToggled(!toggled)} id={`${id}-header`}>
					<div className={styles.listItem}>
						{item}
					</div>
					<p className={styles.listText}>{text}</p>
					<div className={[styles.listToggle, toggled ? styles.listRotate : ""].join(" ")} id={`${id}-toggle-dropdown`}>
						<ChevronDown id={`${id}-dropdown`} size={28} />
					</div>
				</div>
				<div className={styles.listItemContainer} >
					<div className={styles.listChild} onClick={onClick} style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
						{children}
					</div> 
				</div>
			</div>
			<p className={styles.listErr}>{errorMessage}</p>
		</label>
	)
}
