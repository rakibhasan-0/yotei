import {React, forwardRef} from "react"
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
 *    maxLength: number
 * }
 * 
 * Is returned with forwardRef so that we are able to use the ref of the InputTextField (makes it possible to focus the component)
 * Thereby, the textfield also has a ref parameter
 * 
 * @author Team Dragon
 * @version 1.0
 * @since 2023-05-02
 */
const InputTextFieldBorderLabel = forwardRef(function InputTextFieldBorderLabel(
	{ placeholder, text, onChange, required,type,id, onKeyUp, label, errorMessage, maxLength}, ref) {

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
				errorMessage={errorMessage}
				ref={ref}
				maxLength={maxLength}
				hideLength={true}
			>
			</InputTextField>
		</div>

	)
})
export default InputTextFieldBorderLabel