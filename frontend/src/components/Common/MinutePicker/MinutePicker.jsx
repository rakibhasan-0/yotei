import React, {useState}from "react"
import { useEffect } from "react"
import styles from "./MinutePicker.module.css"
/**
 * Component for reading in minutes from user. The input area will only read in
 * numbers.
 *
 * Props:
 *     id @type {string}  - Id for the component.
 *     callback @type {function} - Callback function that will be called on input,
 *     								should take id and time as input.
 * 		initialValue @type {Int} - Initial minute Value
 *
 * Example usage:
 *		const [time1, updateTime1] = useState("")
 *		<MinutePicker id="10" updateTime={updateTime1} initialValue={5}></MinutePicker>
 *
 *
 * @author Team Minotaur, Squad Phoenix, Team Coconut
 * @version 3.0
 * @since 2024-04-24
 * @updated 2024-05-29 Kiwi, Updated props comment
 */
export default function MinutePicker({id, callback, initialValue}) {
	const [number,setNumber] = useState( initialValue == null ? 0 : initialValue)

	//Update the minute field when the initial value is updated.
	useEffect(() => {
		setNumber(initialValue)
	}, [initialValue])

	return (
		<div className={styles.minutePicker}>
			<input
				id={`minute-picker-${id}`}
				type="tel"
				value={number}
				onFocus={() => number == 0 && setNumber("")}
				onBlur={() => number == "" && setNumber(0)}
				onChange={(e) => {
					if(e.target.value.match("^[0-9]+$") != null){
						callback(id, e.target.value)
						setNumber(e.target.value)
					}
					else if(e.target.value.length == 0){
						callback(id, 0)
						setNumber(0)
					}
				}}
				min="0"
				className={styles.minuteInput}/>
			<label className={styles.minText}>
				<p>min</p>
			</label>
		</div>
	)
}