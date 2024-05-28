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
 * @param 		@type { Int } 	      id						A unique ID for the component.
 * @param		@type { Array }       chosenGroups				This corresponds to selectedPlans in PlanIndex.jsx.
 * @param		@type { Function } 	  setChosenGroups			Callback function for updating the selectedPlans variable in PlanIndex.jsx.
 * @paraam		@type { Date Array } dates						The dates in PlanIndex.
 * @param		@type { Function }	  onDatesChange			    Callback function to call when the dates change.
 * @param		@type { Function }	  callbackFunctionCheckbox	A function that will be called for each press of the onlyMyGroups checkbox. This is used in GroupPicker.jsx to set groups.
 * @param		@type { Boolean }	  onlyMyGroups				A variable for the state of the onlyMyGroups checkbox.
 * @param		@type { Function }	  toggleOnlyMyGroups		A callback function used to toggle the onlyMyGroups variable.
 *
 * 
* @author Griffin, Tomato (Group 6) , Team Mango (Group 4) (2024-05-28) , Team Durian (Group 3) (2024-05-27)
* @version 2.1
* @since 2023-05-08
* Updates: 2024-05-10: Added a checkbox (with a feature toggle, since it does not work currently) for filtering by only my groups or all groups.
* 		   2024-05-17: Fixed the filtering and refactored code slightly.
*		   2024-05-22: Added a numFilters counter to the FilterContainer.	 
*		   2024-05-28: Improved documentation.
*/
export default function FilterPlan({ id, chosenGroups, setChosenGroups, dates, onDatesChange, callbackFunctionCheckbox, onlyMyGroups, toggleOnlyMyGroups, numFilters}) {
	
	//This function is called when you press to toggle any checkbox in the GroupPicker drop-down menu.
	const onToggle = (checked, chosenGroup) => setChosenGroups(prev => {
		if(prev) {
			if(!checked) {
				//When you uncheck the checkbox (for e.g. a brown belt), you should remove the relevant belts from the filtered list.
				return prev.filter(g => g !== chosenGroup)
				//(When all checkboxes are unchecked an empty array is left. This is a special case in PlanIndex.)
				//The "chosenGroups", which is really "selectedPlans" in PlanIndex is just an array of ids of the currently selected groups.
			}
			//If the checkbox is checked you should add the chosen group. (e.g. all groups with yellow belts.)
			return [...prev, chosenGroup] //Append syntax...
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
			<FilterContainer id={"planfilter"} numFilters={numFilters}>
								
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
				<div className={styles.checkBoxSpace} style={{display : "flex", alignItems : "center"}} >
					<CheckBox id={"seeOnlyMyGroups"} onClick={() => { toggleOnlyMyGroups()}} checked={onlyMyGroups}/>
					<label className={styles.groupPickerLabel} style={{paddingLeft : "5px", marginTop : "10px"}} >Visa bara tillfällen för mina grupper</label>
					{/* The toggleOnlyMyGroups() call here toggles a boolean variable stored in PlanIndex.jsx. */}
				</div>

				<GroupPicker id={42} onToggle={(c, g) => {onToggle(c, g)}} states={chosenGroups} onlyMyGroups={onlyMyGroups} callbackFunctionCheckbox={callbackFunctionCheckbox}/>

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