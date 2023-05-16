import React from "react"
import "./MinutePicker.css"
/**
 * Component for reading in minutes from user. The input area will only read in
 * numbers.
 *
 * Props:
 *     prop1 @id {string}  - Id for the component.
 *     prop3 @callback {function} - Callback function that will be called on input,
 *     								should take id and time as input.
 *
 * Example usage:
 *      const callback = (id, time) => {
 *      	console.log("input: " + time + ", on id: " + id)
 * 		}
 *
 *      <MinutePicker id="10" callback={callback}></MinutePicker>
 *
 *
 * @author Team Minotaur
 * @version 2.0
 * @since 2023-05-03
 */
export default function MinutePicker({id, callback, initialValue}) {
	return (
		<div className="minute-picker">
			<input
				id={`minute-picker-${id}`}
				type="number"
				pattern="[0-9]*"
				value={initialValue}
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