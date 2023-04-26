import React from "react"
import "./InputTextField.css"

/**
 * This is the standard InputTextField page, used for using standard InputTextField.
 * 
 * The props object is used for holding the written text
 * from and display it on the InputTextField. 
 * props = {
 *    placeholder: string
 *    text: string
 *    onChange: function
 *    required: boolean
 *    type: string
 *    id: string
 *    onKeyUp: function
 *    
 * }
 * 
 * @author Team Chimera
 * @version 1.0
 * @since 2023-04-24
 */
export default function InputTextField({ placeholder, text, onChange, required,type,id, onKeyUp}) {
    return(
        <input
            className="input-area"
            placeholder={placeholder}
            value={text}
            onChange={onChange}
            type={type}
            id={id}
            onKeyUp={onKeyUp}
            required={required}
        />
    )
}