import React from "react"
import DatePicker from "../Common/DatePicker/DatePicker"
import BeltPicker from "../Common/BeltPicker/BeltPicker"
import WeekdayTimePicker from "../Plan/WeekdayTimePicker"
import Divider from "../Common/Divider/Divider"
import Button from "../Common/Button/Button"
import "./PlanForm.css"
import InputTextField from "../Common/InputTextField/InputTextField"


/**
 * A form for collecting the data for a new group plan.
 * 
 * 
 * 
 * @author Griffins
 * @since 2023-05-10
 */

export default function PlanForm(props) {
	var name = props.planData.name

	return (
		<div className="plan-form">
			<div className="name-input-form">
				<InputTextField
					name="name"
					id="name"
					type="text"
					placeholder="Namn"
					value={name}
					onChange={(e) => { props.onClickData("name", e.target.value) }}
					required={true}
				/>
			</div>
            
			<div className="belt-picker">
				<BeltPicker id="form-belt-picker" states={props.belts}/>
			</div>

			<Divider title="Period" option="h2_left"/>
			<div className="start-end-date">
				<p className="p-date">
                    Från:
					<DatePicker 
						id="start-date-picker"
						onChange={(e) => { props.onClickData("startDate", e.target.value) }}    
					/>
				</p>
				<p className="p-date">
                    Till:
					<DatePicker 
						id="end-date-picker"
						onChange={(e) => { props.onClickData("endDate", e.target.value) }}
					/>
				</p>
			</div>
			<Divider title="Dagar" option="h2_left"/>
			<div className="div-week-day-time">
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
			<div className="wrap-centering">
				<Button 
					onClick={props.backClicked}
					outlined={true}
				>
					{"Tillbaka"}
				</Button>
				<Button onClick={props.submitClicked}>
					{"Gå vidare"}
				</Button>
			</div>         
		</div>
	)
}