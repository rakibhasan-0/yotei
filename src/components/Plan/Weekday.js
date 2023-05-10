import React from "react"
import "./Weekday.css"

/**
 * A component for a checkbox representing a weekday
 * 
 * @param dayName   The name of the day
 * @param onClick   Updates state-data for the given day
 * 
 * @author Calzone (2022-05-13), Hawaii (2022-05-13)
 */
function Weekday({ dayName, onClick }) {

	return (
		<label className="label-day">
			{dayName}dag
      
			{/* Checkbox */}
			<input
				name="day"
				id="day"
				type="checkbox"
				className="form-control"
				onChange={() => onClick(dayName)}
			/>
		</label>
	)
}

export default Weekday