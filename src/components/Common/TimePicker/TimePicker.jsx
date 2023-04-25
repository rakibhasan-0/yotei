import React from "react";
import "./TimePicker.css";

/**
 * Defines the time picker. 
 * 
 * @author Chimera (Group 4)
 * @version 1.0
 */
export default function TimePicker({onChange, selectedTime}) {
  return (
    <div>
        <input 
            type="time" 
            value={selectedTime} 
            onChange={onChange}
            className={'time-picker'}
        />
    </div>
  );
}
