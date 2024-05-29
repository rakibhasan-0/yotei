import {React} from "react"
import CheckBox from "../Common/CheckBox/CheckBox.jsx"
import TimePicker from "../Common/TimePicker/TimePicker.jsx"
import styles from "./WeekdayTimePicker.module.css"

/**
 * A component that should be used to select days and starting time of the sessions for a group plan.
 * 
 * id @type {String/Number} The id of the component. (string)
 * weekdays @type {Object} The object containing the data of the weekdays. (If they're checked and what time is set.)
 *  Example of weekdays data:
 *		[
 *			{ name: "Mån", value: false, time: "" },
 *			{ name: "Tis", value: false, time: "" },
 *			{ name: "Ons", value: false, time: "" },
 *			{ name: "Tors", value: false, time: "" },
 *			{ name: "Fre", value: false, time: "" },
 *			{ name: "Lör", value: false, time: "" },
 *			{ name: "Sön", value: false, time: "" }
 *		]
 * dayName @type {String} A short name of the day. (Mån, Tis, Ons, Tors, Fre, Lör, Sön) (string)
 * weekdayClickHandler @type {Function} A handler for handling the checking of the Weekday checkbox. (function)
 * dayTimeClickHandler @type {Function} A handler for handling the input of data to the TimePicker. (function)
 * 
 * @author Griffin
 * @since 2023-05-04
 * @updated 2024-05-29 Kiwi, Updated comment props.
 * @version 1.1
 */

export default function WeekdayTimePicker({id, weekdays, dayName, weekdayClickHandler, dayTimeClickHandler}){
	var currentDay

	for (var i = 0; i < 7; i++) {
		currentDay = weekdays[i]

		if (currentDay.name === dayName) {
			break
		}
	}

	return(
		<div className={styles.weekday_time_picker} id={id}>
			<ul>
				<li className={styles.check_box_li}>
					{/* Check box */}
					<CheckBox id={dayName+"CheckBox"} onClick={()=> weekdayClickHandler(dayName)} checked={currentDay.value}/>
				</li>
				<li className={styles.week_day_text_li}>
					{dayName + "dag"}
				</li>
				<li className={styles.time_picker_li}>
					{/* Time picker */}
					{ currentDay.value && 
						<TimePicker 
							id={dayName+"TimePicker"} 
							onChange={(e) => { dayTimeClickHandler(dayName, e) }} 
						/>
					}
				</li>
			</ul>
		</div>
	)
}
