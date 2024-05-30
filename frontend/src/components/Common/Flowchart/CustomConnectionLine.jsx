import React from "react"
import { getStraightPath } from "reactflow"
/** 
 * Custom connection line used in flowchart.
 * 
 * @param {Number} fromX: starting x coordinate
 * @param {Number} fromY: starting y coordinate
 * @param {Number} toX: ending x coordinate
 * @param {Number} toY: edning y cooridante
 * @param {Object} connectionLineStyle: style object
 * 
 * @author Team Durian (Grupp 3)
 * @since 2024-05-20
*/
function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
	const [edgePath] = getStraightPath({
		sourceX: fromX,
		sourceY: fromY,
		targetX: toX,
		targetY: toY,
	})

	return (
		<g>
			<path style={connectionLineStyle} fill="none" d={edgePath} />
			<circle cx={toX} cy={toY} fill="black" r={3} stroke="black" strokeWidth={1.5} />
		</g>
	)
}

export default CustomConnectionLine