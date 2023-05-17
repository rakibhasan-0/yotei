import React from "react"
import { Star, StarFill } from "react-bootstrap-icons"
import styles from "./StarButton.module.css"

/**
 * A star button that can be toggled on or off, where the
 * toggled state has a filled star and the untoggled state
 * is an empty outlined star.
 * 
 * Example usage:
 * 
 * const [isToggled, setToggled] = useState(false);
 * <StarButton toggled={isToggled} onClick={() => setToggled(!isToggled)} />
 * 
 * props = {
 *    toggled: boolean,
 *    onClick: function
 *    id: string
 * }
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function StarButton({id, onClick, toggled}) {
	return (
		<div id={id} onClick={onClick} className={styles.starContainer}>
			<StarFill className={`${styles.star} ${toggled ? "" : styles.starHidden}`} color='yellow' />
			<Star size={"100%"} className={`${toggled ? styles.starOverlay : styles.star}`} />
		</div>
	)
}
