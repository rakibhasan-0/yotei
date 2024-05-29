import {React, forwardRef} from "react"
import styles from "./InputTextFieldBorderLabel.module.css"
import InputTextField from "../InputTextField/InputTextField"
/**
 * This is a version of the standard InputTextField page, used for using standard InputTextField but with a "border-label".
 * 
 * The props object is used for holding the written text
 * from and display it on the InputTextField. 
 * props:
* 		placeholder  @type {String}   Text holder until something to be shown
* 		text         @type {String}   User input text
*		onChange     @type {Function} Function to run on change
* 		required     @type {Boolean}  Is a boolean that makes sure that user cant leave an empty text field.
* 		type         @type {Type}     Change type of component
*		id           @type {String}   An id for the textfield
* 		onKeyUp      @type {Function} Gets the input value from the user
* 		errorMessage @type {String}   Shows an error message
* 		maxLength    @type {Number}   Max input length, defaults to 180 characters
* 		hideLength	@type {Boolean}  Hides the input length display, defaults to false
* 
 * 
 * Is returned with forwardRef so that we are able to use the ref of the InputTextField (makes it possible to focus the component)
 * Thereby, the textfield also has a ref parameter
 * 
 * @author Team Dragon
 * @updated 2024-05-29 Kiwi, Updated comment for props.
 * @version 1.1
 * @since 2023-05-02
 */
const InputTextFieldBorderLabel = forwardRef(function InputTextFieldBorderLabel(
	{ placeholder, text, onChange, required,type,id, onKeyUp, label, errorMessage, maxLength}, ref) {

	return(
		<div style={{position: "relative"}}>
			<label className={styles["input-label"]}>{label}</label>
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