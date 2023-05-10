import React from "react"
import "./MinutePicker.css"
/**
 * Component for reading in minutes from user. The input area will only read in
 * numbers.
 *
 * Props:
 *     prop1 @id {string}  - Id for the component.
 *     prop2 @time {variable for number}  - A variable for time.
 *     prop3 @updateTime {function} - A setter for the variable time.
 *
 * Example usage:
 *		const [time1, updateTime1] = useState("")
 *		<MinutePicker id="10" time={time1} updateTime={updateTime1}></MinutePicker>
 *
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-03
 */
export default function MinutePicker({id, callback}) {
	return (
		<div className="minute-picker">
			<input
				id={`minute-picker-${id}`}
				type="number"
				pattern="[0-9]*"
				// value={time}
				placeholder="0"
				onChange={(e) => e.target.validity.valid && callback(id, e.target.value)}
				min="0"
				className={"minute-input"}/>
			<label className="min-text">
				<p>min</p>
			</label>
		</div>
	)
}