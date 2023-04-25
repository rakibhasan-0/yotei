import React from "react";
import './InputTextField.css';

/**
 * This is the standard InputTextField page, used for using standard InputTextField.
 * 
 * The props object is used for holding the written text
 * from and display it on the InputTextField. 
 * props = {
 *    placeholder: string
 *    text: string
 *    onChange: function
 * }
 * 
 * @author Team Chimera
 * @version 1.0
 * @since 2023-04-24
 */
export default function InputTextField({ placeholder, text, onChange }) {
    return(
        <input
            className="input-area"
            placeholder={placeholder}
            value={text}
            onChange={e => onChange?.(e.target.value)}
        />
    )
}