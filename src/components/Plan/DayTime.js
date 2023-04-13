import React from 'react'
import './DayTime.css'
import TimePicker from 'react-time-picker'
/**
 * A component for choosing a time for a day. 
 * 
 * @param data 		Describes the details of a Session.
 * @param onClick   The onClick callback that sets form input to an
 * 				    associated state. 
 *
 * @author Calzone (2022-05-16), Hawaii (2022-05-16)
 */
function DayTime({ dayName, onClick, weekdays }) {

    var dayRow
    var value

    /* Finds the right time in the weekdays-state so that 
     * the value is updated correctly in the time-input */
    for(var i = 0; i < 7; i++){
        dayRow = weekdays[i]

        if (dayRow.name == dayName) {
            value = weekdays[i].time
            break
        }
    }

    /* Do not render time-select if day has not been chosen */
    if (dayRow.value == false) {
        return (<div></div>)
    }
    else {
        return (
            <label htmlFor="dayTime">
                <div className="div-day-selected-container">
                    <div className="div-day-selected">
                        <div className="day-selected-text">{dayName}dag</div>

                        {/*Select start-time for a selected day*/}
                        <div>
                            <TimePicker 
                                name="dayTime"
                                id="dayTime"
                                type="time"
                                value={value}
                                className="form-control day-selected-date"
                                locale="sv-SV"
                                name="time"
                                id="time"
                                type="time"
                                className="DateTimePicker"
                                className="form-control"
                                format="H:mm"
                                maxTime="23:59"
                                minTime="00:00"
                                disableClock={true}
                                onChange={(e) => { onClick(dayName, e) }}
							/>
                        </div>
                    </div>
                </div>
            </label>
        )
    }
}

export default DayTime
