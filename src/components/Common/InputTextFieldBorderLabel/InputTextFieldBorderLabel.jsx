import React from "react"
import "./InputTextFieldBorderLabel.css"
import InputTextField from "../InputTextField/InputTextField"
/**
 * This is a version of the standard InputTextField page, used for using standard InputTextField but with a "border-label".
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
 *    label: string
 *    
 * }
 * 
 * @author Team Dragon
 * @version 1.0
 * @since 2023-05-02
 */
export default function InputTextFieldBorderLabel({ placeholder, text, onChange, required,type,id, onKeyUp, label, errorMessage}) {
	return(
		<div style={{position: "relative"}}>
			<label className="input-label">{label}</label>
			<InputTextField 
				placeholder={placeholder} 
				text={text} 
				onChange={onChange} 
				required={required} 
				type={type} 
				id={id} 
				onKeyUp={onKeyUp}
				label={label}
				errorMessage={errorMessage}>
			</InputTextField>
		</div>

	)
}