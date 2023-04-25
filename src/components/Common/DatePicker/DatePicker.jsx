import React from "react";
import "./DatePicker.css";

/**
 * Defines the button used in the home page. 
 * 
 * @author Chimera (Group 4)
 * @version 1.0
 */
export default function DatePicker({onChange, selectedDate}) {
    return (
        <div >
          <input 
            type="date" 
            value={selectedDate} 
            onChange={onChange}
            className={'date-picker'}
          />
        </div>
      );
}
