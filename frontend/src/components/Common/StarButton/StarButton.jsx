import React from "react"
import { Star, StarFill } from "react-bootstrap-icons"
import styles from "./StarButton.module.css"

/**
 * A star button that can be toggled on or off, where the
 * toggled state has a filled star and the untoggled state
 * is an empty outlined star.
 * 
 * props = {
 *    toggled @type {Boolean}: Fills the starbutton when true
 *    onClick @type {Function}: Function to run when the button is clicked
 *    id @type {String}: ID for the component
 * }
 * 
 * Example usage:
 * 
 * const [isToggled, setToggled] = useState(false);
 * <StarButton id="starbutton-example" toggled={isToggled} onClick={() => setToggled(!isToggled)} />
 * 
 * @author Chimera
 * @since 2023-05-02
 * @update 2023-05-30 Chimera, added Documentation
 * @version 2.1 
 */
export default function StarButton({id, onClick, toggled}) {
	return (
		<div id={id} onClick={onClick} className={styles.starContainer}>
			<StarFill className={`${styles.star} ${toggled ? "" : styles.starHidden}`} color='yellow' />
			<Star size={"100%"} className={`${toggled ? styles.starOverlay : styles.star}`} />
		</div>
	)
}
