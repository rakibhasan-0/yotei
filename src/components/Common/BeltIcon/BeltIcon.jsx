import "./BeltIcon.css"

/**
 * Represents a belt icon with a white background, and 
 * a ribbon in the middle with the specified color.
 * 
 * @param {String} belt The belt color
 * @returns A new child belt icon
 */
export default function BeltIcon({ belt, child }) {
	if (child) {
		return (
			<div className="belt-icon" style={{ backgroundColor: "white" }}>
				<div className="belt-icon-child" style={{ backgroundColor: `var(--belt-${belt})` }} />
			</div>
		)
	}
	return (<div className="belt-icon" style={{ backgroundColor: `var(--belt-${belt})` }} />)
}