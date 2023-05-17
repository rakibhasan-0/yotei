import styles from "./BeltIcon.module.css"

/**
 * Represents a belt icon with a white background, and 
 * a ribbon in the middle with the specified color.
 * 
 * @param {String} color The belt color
 * @returns A new child belt icon
 * @author Chimera 
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
				{[...Array(num)].map((i) => <div key={i} className={styles.beltIconChild} style={{ backgroundColor: "gold" }} />)}
			</div>
		)
	}
	return (<div className={styles.beltIcon} style={{ backgroundColor: color }} />)
}
