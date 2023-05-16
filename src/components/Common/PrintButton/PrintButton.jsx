import React, { useRef } from "react"
import ReactToPrint from "react-to-print"
import WorkoutToPrint from "./WorkoutToPrint"

/**
 * The PrintButton component renders a button that triggers the printing of the WorkoutToPrint component.
 * It uses the ReactToPrint library to handle the printing functionality.
 * Props:
 * 		id          @param {string} - The ID of the button.
 * 		workoutData @param {Object} - The object containing information about the workout.
 *             		@returns {JSX.Element} - Returns the JSX element for the print button.
 * 
 * Example usage:
 * 			<PrintButton id="print-button" workoutData={workoutData} />
 * 
 * @author Chimera (Grupp 4)
 * @since 2023-05-16
 * @version 1.0 
 */
const PrintButton = ({ id, workoutData }) => {
	const componentRef = useRef()

	return (
		<>
			<ReactToPrint
				trigger={() => <i role="print" aria-label="print" id={id} className="bi bi-printer bi-lg click click-icon ml-0"/>}
				content={() => componentRef.current}
			/>
			<div style={{ display: "none" }}>
				<div ref={componentRef}>
					<WorkoutToPrint workoutData={workoutData} />
				</div>
			</div>
		</>
	)
}

export default PrintButton

