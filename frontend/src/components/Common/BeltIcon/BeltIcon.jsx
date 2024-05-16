import styles from "./BeltIcon.module.css"

/**
 * Represents a belt icon with a white background, and 
 * a ribbon in the middle with the specified color.
 * 
 * Props:
 *    belt @type {Object}: A const containing .name for name, a hexcode .color for color and a boolean .child for if it's a child 
 *

 *  
 * Example usage:
 * 
 * const belt = {
 *		child: false,
 * 		color: "880808",	
 *		name: "test"
 *	}
 * 
 * <BeltIcon id={`red-icon`} belt={belt} />
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-30
 * @version 1.1
 * @returns  A new child belt icon
 */
export default function BeltIcon({ belt }) {
	const color = `#${belt.color}`
	if (belt.child) {
		return (
			<div className={styles.beltIcon} style={{ backgroundColor: "white" }}>
				<div className={styles.beltIconChild} style={{ backgroundColor: color }} />
			</div>
		)
	}
	if (belt.name.toLowerCase().includes("dan")) {
		const num = parseInt(belt.name.split(" ")[0])
		return (
			<div className={styles.beltIcon} style={{ backgroundColor: color }}>
				{[...Array(num)].map((_, i) => <div key={i} className={styles.beltIconChild} style={{ backgroundColor: "gold" }} />)}
			</div>
		)
	}
	return (<div className={styles.beltIcon} style={{ backgroundColor: color }} />)
}
