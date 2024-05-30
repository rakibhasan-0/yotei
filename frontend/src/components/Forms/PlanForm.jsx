import React from "react"
import DatePicker from "../Common/DatePicker/DatePicker"
import BeltPicker from "../Common/BeltPicker/BeltPicker"
import WeekdayTimePicker from "../Plan/WeekdayTimePicker"
import Divider from "../Common/Divider/Divider"
import Button from "../Common/Button/Button"
import styles from "./PlanForm.module.css"
import InputTextField from "../Common/InputTextField/InputTextField"

/**
 * A form for collecting the data for a new group plan.
 * 
 * props = {
 * 	planData @type {Object} the data for the plan
 *	weekdays @type {Object} the weekdays chosen and the time of that day
 *	belts @type {Object} the belts
 *	setBelts @type {Function} function for setting belts
 *	onClickData @type {Function} function for altering data
 *	onClickWeekday @type {Function} function for handling toggling of weekdays 
 *	onClickDayTime @type {Function} function for handling changes in the time input field
 *	okName @type {Function} function for verifying that the name is set
 *	okStartDate @type {Function} function for verifying that start date is valid
 *	okEndDate @type {Function} function for verifying that end date is valid
 *	buttonClicked @type {useState} the state if the button has been clicked.
 *	submitClicked @type {Function} function for handling submits of the form, if the "Gå vidare" button is clicked.
 *	backClicked @type {Function} function for handling if the back button is clicked
 *	textInputErrorMsg(Optional) @type {String} error message to InputTextField-component 
 * }
 * 
 * 
 * @author Squad 2 Griffins, Squad 3 Durian
 * @since 2023-05-10, 2024-04-17
 * @update 2024-04-29, Team Kiwi - Added true for filtering basic techniques in BeltPicker 
 * @update 2024-05-29, Team Kiwi - Updated props comment
 * @update 2024-05-30, Team Mango - Fixed a CSS bug due to a typo.
 */

export default function PlanForm(props) {
	var name = props.planData.name
	const today = new Date()
	const twoYearsFromNow = new Date()
	twoYearsFromNow.setFullYear(today.getFullYear()+2)

	const onToggle = (checked, belt) => props.setBelts(prev => {
		if(!checked) {
			return prev.filter(b => b !== belt)
		}
		else {
			return [...prev, belt]
		}
	})

	return (
		<div className="plan-form">
			<div className="name-input-form">
				<InputTextField
					name="name"
					id="name"
					text={name}
					type="text"
					placeholder="Namn"
					value={name}
					onChange={(e) => { props.onClickData("name", e.target.value) }}
					required={true}
					errorMessage={props.textInputErrorMsg}
					
				/>
			</div>
            
			<div className="belt-picker">
				<BeltPicker id="form-belt-picker" onToggle={onToggle} states={props.belts} filterBasicTechniques = {true} />
			</div>

			<Divider title="Period" option="h2_left"/>
			<div className={styles.start_end_date}>
				<p className={styles.p_date_name}>Från:</p>
				<div className={styles.p_date_picker}>
					<DatePicker 
						id="start-date-picker"
						onChange={(e) => { props.onClickData("startDate", e.target.value) }} 
						minDate={dateFormatter(today)}   
					/>
				</div>
				<p className={styles.p_date_name}>Till:</p>
				<div className={styles.p_date_picker}>
					<DatePicker 
						id="end-date-picker"
						onChange={(e) => { props.onClickData("endDate", e.target.value) }}
						maxDate={dateFormatter(twoYearsFromNow)}
					/>
				</div>
			</div>
			<Divider title="Dagar" option="h2_left"/>
			<div style={{marginTop: "20px"}}>
				<div className={styles.weekday_container}>
					<div className={styles.div_week_day_time}>
						<WeekdayTimePicker 
							dayName="Mån" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Tis" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Ons" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Tors" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Fre" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Lör" 
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
						<WeekdayTimePicker 
							dayName="Sön"
							weekdays={props.weekdays}
							weekdayClickHandler={props.onClickWeekday}
							dayTimeClickHandler={props.onClickDayTime}
						/>
					</div>
				</div>
			</div>
			<div className={styles.button_container}>
				<Button 
					onClick={props.backClicked}
					outlined={true}
				>
					<p>
						Tillbaka
					</p>
				</Button>
				<Button onClick={props.submitClicked}>
					<p>
						Gå vidare
					</p>
				</Button>
			</div>         
		</div>
	)
}

/**
	 * Formats given date to a string with formatting 'YYYY-MM-DD'
	 * 
	 * @param { string } today - Date to be formatted.
	 * @returns Date as a string on the correct format.
	 */
function dateFormatter(today) {
	const date = today
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return [year, month, day].join("-")
}