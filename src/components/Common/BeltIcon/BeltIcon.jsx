import "./BeltIcon.css"

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
			<div className="belt-icon" style={{ backgroundColor: "white" }}>
				<div className="belt-icon-child" style={{ backgroundColor: color }} />
			</div>
		)
	}
	if (belt.name.toLowerCase().includes("dan")) {
		const num = parseInt(belt.name.split(" ")[0])
		return (
			<div className="belt-icon belt-icon-black" style={{ backgroundColor: color }}>
				{[...Array(num)].map((i) => <div key={i} className="belt-icon-child icon-black" style={{ backgroundColor: "gold" }} />)}
			</div>
		)
	}
	return (<div className="belt-icon" style={{ backgroundColor: color }} />)
}
