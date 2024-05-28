import React from "react"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import BeltPicker from "../../components/Common/BeltPicker/BeltPicker"
import style from "./FilterStatistics.module.css"

/**
 * 
 * Component for filtering statistics. Can filter by dates, belts, exercises and kihon.
 * 
 * Example usage:
 * 
 * <FilterStatistics 
 * 		onToggleExercise={onToggleExercise}
 * 		onToggleKihon={onToggleKihon}
 * 		onDateChanges={onDateChanges}
 * 		onToggleBelts={onToggleBelts}
 * 		onClearBelts={onClearBelts}
 * 		belts={belts}
 * 		dates={dates}
 * />
 * 
 * @param {function} onToggleExercise - Function to toggle exercises.
 * @param {function} onToggleKihon - Function to toggle kihon.
 * @param {function} onDateChanges - Function to change dates.
 * @param {function} onToggleBelts - Function to toggle belts.
 * @param {function} onClearBelts - Function to clear belts.
 * @param {object} belts - Object containing selected belts.
 * @param {object} dates - Object containing selected dates.
 * 
 * @returns A filter for statistics.
 * @version 1.0
 * @since 2024-05-08
 * @author Team Coconut
 * 
 */

export default function FilterStatistics({ exercises, kihon, onToggleExercise, onToggleKihon, onDateChanges, onToggleBelts, onClearBelts, belts, dates}) {

	return (
		<div>
			<FilterContainer id="filter-container" title="Filtering" numFilters={0}>

				<div className={style.dateContainer}>
					<h2>Från</h2>
					<div></div>
					<DatePicker
						id="start-date-picker"
						selectedDate={dates.from} // two years before from today
						onChange={(e) => {
							onDateChanges("from", e.target.value)
						}}
					/>
				</div>

				<div className={style.dateContainer}>
					<h2>Till</h2>
					<div></div>
					<DatePicker
						id="end-date-picker"
						selectedDate={dates.to} // today's date
						onChange={(e) => {
							onDateChanges("to", e.target.value)
						}}
					/>
				</div>

				<BeltPicker
					id={"techniqueFilter-BeltPicker"}
					onToggle={onToggleBelts}
					states={belts}
					onClearBelts={onClearBelts}
					filterWhiteBelt={false}
				/>

				<div className={style.checkboxContainer}>
					<h2>Visa Övningar</h2>
					<div></div>
					<CheckBox
						id={"techniqueFilter-VisaÖvningar"}
						checked={exercises}
						onClick={(isChecked) => {
							onToggleExercise(isChecked)
						}}
					/>
				</div>

				<div className={style.checkboxContainer}>
					<h2>Kihon</h2>
					<div></div>
					<CheckBox
						id={"techniqueFilter-KihonCheck"}
						checked={kihon}
						onClick={(isChecked) => {
							onToggleKihon(isChecked)
						}}
					/>
				</div>
				
			</FilterContainer>
		</div>
	)
}
