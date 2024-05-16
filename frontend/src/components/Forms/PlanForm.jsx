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
 * 	planData: the data for the plan
 *	weekdays: the weekdays chosen and the time of that day
 *	belts: the belts
 *	setBelts: function for setting belts
 *	onClickData: function for altering data
 *	onClickWeekday: function for handling toggling of weekdays 
 *	onClickDayTime: function for handling changes in the time input field
 *	okName: function for verifying that the name is set
 *	okStartDate: function for verifying that start date is valid
 *	okEndDate: function for verifying that end date is valid
 *	buttonClicked: the state if the button has been clicked.
 *	submitClicked: function for handling submits of the form, if the "Gå vidare" button is clicked.
 *	backClicked: function for handling if the back button is clicked
 *	textInputErrorMsg(Optional): error message to InputTextField-component 
 * }
 * 
 * 
 * @author Squad 2 Griffins, Squad 3 Durian
 * @since 2023-05-10, 2024-04-17
 * @update 2024-04-29, Team Kiwi : Added true for filtering basic techniques in BeltPicker 
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
				<p className={styles.p_date-name}>Till:</p>
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