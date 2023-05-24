import {React, useState} from "react"
import "./FilterPlan.css"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import GroupPicker from "../../components/Plan/GroupPicker"

/**
 * Filter component for plans.
 * 
 * Props:
 *     prop1 @type {number}  - An id to identify the component
 *     prop2 @type {object}  - A props object containing state for the filter.
*
* @author Griffin
* @version 1.0
* @since 2023-05-08
*/
export default function FilterPlan({ id}) {
	const date = dateFormatter(new Date())
	const [selectedStartDate, setSelectedStartDate] = useState(date)
	const [selectedEndDate, setSelectedEndDate] = useState("")

	const handleStartDateChange = (event) => {
		setSelectedStartDate(event.target.value)
		console.log("Start date changed! " + selectedStartDate)
		// Show all plans from this date
	}

	const handleEndDateChange = (event) => {
		setSelectedEndDate(event.target.value)
		console.log("End date changed!")
		// Show all plans up to this date
	}

	return (
		<div className = "FilterPlan" id = {id}>
			<FilterContainer id={"planfilter"}>
								
				<div className={"filterplan-datePickerContainer"}>
					<div className="filterplan-titleDatePickerContain">
						<p className="filterplan-datePickerTitle">Från</p>
				
						<div className={"filterplan-datePicker"}>
							<DatePicker onChange={handleStartDateChange} selectedDate={selectedStartDate} id="startDatePicker"/>
						</div>
					</div>	
					
					<div className="filterplan-titleDatePickerContain">
						<p >Till</p>
						<div className={"filterplan-datePicker"}>
							<DatePicker onChange={handleEndDateChange} selectedDate={selectedEndDate} id="endDatePicker" minDate={selectedStartDate}/>
						</div>
					</div>
				</div>
		
				<GroupPicker id = {42} onToggle={() => console.log("replace me. not done 42")}></GroupPicker>

			</ FilterContainer>
		</div>
	)
}

export function dateFormatter(today) {
	const date = today
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return [year, month, day].join("-")
}