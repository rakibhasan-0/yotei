import "./BeltIcon.css"

/**
 * Represents a belt icon with a white background, and 
 * a ribbon in the middle with the specified color.
 * 
 * @param {String} color The belt color
 * @returns A new child belt icon
 * @author Chimera 
 */
export default function BeltIcon({ color, child }) {
	if (child) {
		return (
			<div className="belt-icon" style={{ backgroundColor: "white" }}>
				<div className="belt-icon-child" style={{ backgroundColor: color }} />
			</div>
		)
	}
	return (<div className="belt-icon" style={{ backgroundColor: color }} />)
}
