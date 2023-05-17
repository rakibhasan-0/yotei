import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "./Component.module.css"

/**
 * A generic list item that can be used in a list view,
 * with a customizable optional item on the left of the
 * component text. The component can be expanded, and
 * the children will be displayed.
 * 
 * The width of the component will be set by the parent.
 * 
 * props = {
 *     item: Optional JSX element which will be displayed on the left of the text,
 *     text: Text of the component,
 *     children: JSX element which will be displayed when the component is expanded
 * 	   centered: Boolean to set text as centered
 *     id: string
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
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
				<div className={styles.listHeader} onClick={() => setToggled(!toggled)}>
					<div className={styles.listItem}>
						{item}
					</div>
					<p className={styles.listText}>{text}</p>
					<div className={[styles.listToggle, toggled ? styles.listRotate : ""].join(" ")}>
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
