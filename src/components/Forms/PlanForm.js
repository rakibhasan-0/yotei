import React from 'react'
import Weekday from '../Plan/Weekday'
import DayTime from '../Plan/DayTime'
import DatePicker from 'react-date-picker'
import 'react-time-picker/dist/TimePicker.css'; 
/**
 * This functional component is used as a form for adding plans.
 * 
 * @param planData          The state-data for a plan
 * @param weekdays          The state-data for weekdays
 * 
 * @param onClickData       Updates state-data for a plan
 * @param onClickWeekday    Updates state-data for weekdays
 * @param onClickDayTime    Updates state-data for time in weekdays
 * 
 * @param okName            If the name field is not empty
 * @param okStartDate       If the startDate field is not empty
 * @param okEndDate         If the endDate field is not empty
 * @param buttonClicked     If the "Add" button hs been clicked
 * 
 * @author Calzone (2022-05-13), Hawaii (2022-05-13)
 */
function PlanForm(props) {

    var name = props.planData.name;
    var color = props.planData.color;
    var startDate = props.planData.startDate;
    var endDate = props.planData.endDate;


    return (

        <form className="d-flex flex-column">

            {/* Ask the user for the name of the plan */}
            <label htmlFor="name">
                Välj namn:
                <input
                    name="name"
                    id="name"
                    type="text"
                    placeholder="Namn"
                    className={props.okName || !props.buttonClicked ? 'form-control' : 'form-control is-invalid'}
                    value={name}
                    onChange={(e) => { props.onClickData("name", e.target.value) }}
                    required
                />
            </label>

            {/* Ask the user for a color of the plan */}
            <label htmlFor="color">
                Välj färg:
                <input
                    name="color"
                    id="color"
                    type="color"
                    placeholder="Färg"
                    className="form-control"
                    value={color}
                    onChange={(e) => { props.onClickData("color", e.target.value) }}
                    required
                />
            </label>

            <div>
                {/* Ask the user for the start-date of the plan */}
                <label htmlFor="startDate">
                    Startdatum:
                    <DatePicker
					locale="sv-SV"
					name="date"
                    id="date"
                    type="date"
                    className={props.okStartDate || !props.buttonClicked ? 'form-control' : 'form-control is-invalid'}
					value={startDate}
					onChange={(e) => { props.onClickData("startDate", e) }}
                    />
                </label>

                {/* Ask the user for the end-date of the plan */}
                <label htmlFor="endDate">
                    Slutdatum:
                    <DatePicker
					locale="sv-SV"
					name="date"
                    id="date"
                    type="date"
                    className={props.okStartDate || !props.buttonClicked ? 'form-control' : 'form-control is-invalid'}
					value={endDate}
					onChange={(e) => { props.onClickData("endDate", e) }}
                    />
                </label>
            </div>

            {/* Ask the user for the weekdays for the plan */}
            <p></p>
            <p></p>
            <div className="div-week" >
                <Weekday dayName="Mån" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Tis" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Ons" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Tors" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Fre" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Lör" onClick={props.onClickWeekday} weekdays={props.weekdays} />
                <Weekday dayName="Sön" onClick={props.onClickWeekday} weekdays={props.weekdays} />
            </div>

            {/* If a weekday is checked, ask the user for a time for events */}
            <p></p>
            <h3>Tider</h3>
            <DayTime dayName="Mån" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Tis" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Ons" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Tors" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Fre" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Lör" onClick={props.onClickDayTime} weekdays={props.weekdays} />
            <DayTime dayName="Sön" onClick={props.onClickDayTime} weekdays={props.weekdays} />

        </form>
    )
}

export default PlanForm