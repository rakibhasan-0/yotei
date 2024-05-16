import {React, useState} from "react"
import styles from "./FilterPlan.module.css"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import GroupPicker from "../../components/Plan/GroupPicker"
import CheckBox from "../../components/Common/CheckBox/CheckBox"

/** THIS IS STILL A WORK IN PROGESS, ALL TESTS AND FUNCTIONALITY IS NOT IMPLEMENTED.
 * Filter component for plans.
 * 
 * Props:
 *     prop1 @type {number}  - An id to identify the component
 *     prop2 @type {object}  - A props object containing state for the filter. 
 *
 * TODO explain the parameters for the components better.
 * @param 		@type { Int? } 	      id				A unique ID for the component. ?
 * @param		@type { Array? }      chosenGroups		???
 * @param		@type { Array? } 	  setChosenGroups	Callback function for updating the selectedPlans variable in PlanIndex.jsx.
 * @paraam		@type { Date Array? } dates				???
 * @param		@type { Date? }		  onDatesChange		???
 * @param		@type { Date? }		  callbackFunction	A function that will be called for each press of the checkbox.
 * (Currently the callbackFunction is used to toggle filtering by only "my groups" or by "all groups".)
 * 
* @author Griffin, Tomato (Group 6) , Team Mango (Group 4) (2024-05-10)
* @version 2.1
* @since 2023-05-08
* Updates: 2024-05-10: Added a checkbox (with a feature toggle, since it does not work currently) for filtering by only my groups or all groups.
*/
export default function FilterPlan({ id, chosenGroups, setChosenGroups, dates, onDatesChange, callbackFunction, onlyMyGroups, toggleOnlyMyGroups}) {

	const [checkBoxIsEnabled] = useState(true) //FEATURE TOGGLE

	const onToggle = (checked, chosenGroup) => setChosenGroups(prev => {
		if(prev) {
			if(!checked) {
				//When you uncheck the checkbox (for e.g. a brown belt), you should remove the relevant belts from the filtered list.
				//console.log("PREV: " + prev) //prev seems to be the last id you pressed.
				return prev.filter(g => g !== chosenGroup)
				//(When all checkboxes are unchecked everything is added again.)
			}
			//If the checkbox is checked you should add the chosen group. (e.g. all groups with yellow belts.)
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
			<FilterContainer id={"planfilter"} numFilters={0}>
								
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

				{/* Checkbox for only showing this user's groups. */}
				{ checkBoxIsEnabled && ( //FEATURE TOGGLE
					<div className={styles.checkBoxSpace} >
						<CheckBox id={"seeOnlyMyGroups"} onClick={() => { toggleOnlyMyGroups()}}
						label={"Visa bara tillfällen för mina grupper"} checked={onlyMyGroups} />
						{/* The callbackFunction() call here toggles a boolean variable stored in PlanIndex.jsx. */}
						{/* TODO: In order to filter properly, this part here and probably GroupPicker.jsx must be updated, as well as PlanIndex.jsx.*/}
					</div>
				)
				}

				<GroupPicker id={42} onToggle={(c, g) => {onToggle(c, g)}} states={chosenGroups} onlyMyGroups={onlyMyGroups} callbackFunction={callbackFunction}/>

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