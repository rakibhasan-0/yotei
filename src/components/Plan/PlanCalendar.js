import React, {useState} from 'react'
import DatePicker from '../Common/DatePicker/DatePicker';
import 'react-calendar/dist/Calendar.css';

/**
 * The calendar component for Plan.
 * @author Group 4 (Calzone) and Group 3 (Hawaii)
 */

/**
 * @returns The calendar component
 * 
 * This is not used for anything and is only there for visual purposes
 */
export default function PlanCalendar() {
    const [dateState, setDateState] = useState(new Date())
    const changeDate = (e) => {
        setDateState(e)
    }
    return (
        <>
        <DatePicker
            onChange={changeDate}
        />
        
        </>
    )
}