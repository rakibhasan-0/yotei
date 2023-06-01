import {React} from "react"
import styles from "./FilterPlan.module.css"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import GroupPicker from "../../components/Plan/GroupPicker"

/** THIS IS STILL A WORK IN PROGESS, ALL TESTS AND FUNCTIONALITY IS NOT IMPLEMENTED.
 * Filter component for plans.
 * 
 * Props:
 *     prop1 @type {number}  - An id to identify the component
 *     prop2 @type {object}  - A props object containing state for the filter.
*
* @author Griffin
* @version 2.0
* @since 2023-05-08
*/
export default function FilterPlan({ id, chosenGroups, setChosenGroups, dates, onDatesChange}) {

	const onToggle = (checked, chosenGroup) => setChosenGroups(prev => {
		if(prev) {
			if(!checked) {
				return prev.filter(g => g !== chosenGroup)
			}
			return [...prev, chosenGroup]
		}
	})

	const toChanged = (event) => {
		onDatesChange("to", event.target.value)
	}
	const fromChanged = (event) => {
		onDatesChange("from", event.target.value)
	}

	return (
		<div id = {id}>
			<FilterContainer id={"planfilter"}>
								
				<div className={styles.datePickerContainer}>
					<p className={styles.datePickerTitle}>Från</p>
			
					<div className={styles.datePicker}>
						<DatePicker onChange={fromChanged} selectedDate={dates.from} id="startDatePicker"/>
					</div>
					
					<p className={styles.datePickerTitle}>Till</p>
			
					<div className={styles.datePicker}>
						<DatePicker onChange={toChanged} selectedDate={dates.to} id="endDatePicker" minDate={dates.from}/>
					</div>
				</div>

				<GroupPicker id={42} onToggle={(c, g) => {onToggle(c, g)}} states={chosenGroups}/>

			</ FilterContainer>
		</div>
	)
}

/**
 * Formats given date to a string with formatting 'YYYY-MM-DD'
 * 
 * @param { string } today - Date to be formatted.
 * @returns Date as a string on the correct format.
 */
export function dateFormatter(today) {
	const date = today
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return [year, month, day].join("-")
}