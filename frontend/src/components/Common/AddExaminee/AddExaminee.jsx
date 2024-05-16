import styles from "./AddExaminee.module.css"
import { forwardRef } from "react"
import { Plus } from "react-bootstrap-icons"
import { useState } from "react"

/**
 * This is AddExaminee component
 * 
 * The props object is used for holding the written text
 * from and display it on the InputTextField. 
 * Props:
 * placeholder  @type {String}   Text holder until something to be shown
 * text         @type {String}   User input text
 * onSubmit     @type {Function} Function to run on change
 * required     @type {Boolean}  Is a boolean that makes sure that user cant leave an empty text field.
 * type         @type {Type}     Change type of component
 * id           @type {String}   An id for the textfield
 * onKeyUp      @type {Function} Gets the input value from the user
 * errorMessage @type {String}   Shows an error message
 * maxLength    @type {Number}   Max input length, defaults to 180 characters
 * hideLength	  @type {Boolean}  Hides the input length display, defaults to false
 * 
 * Example usage:
 * const [exampleText, setExampleText] = useState("")
 * 
 *	<AddExaminee
 *		name="example-input-text-field"
 *		id="example-input-text-field"
 *		type="text"
 *		placeholder="Write here"
 *		value={exampleText}
 *		onSubmit={(e) => setExampleText(e.target.value) }}
 *		required={true}
	/>
 * 
 * Is returned with forwardRef so that we are able to use the ref of the input-node (makes it possible to focus)
 * Thereby, the textfield also has a ref parameter
 * 
 * @author Team Pomegrante
 * @version 1.0
 * @since 2024-05-03
 * 
 */
const AddExaminee = forwardRef(function AddExaminee(
	{ placeholder, text, onSubmit, required, type, id, onKeyUp, errorMessage, maxLength, hideLength}, ref) {
	
	const defaultLimit = 180
	const isErr = !(errorMessage == undefined || errorMessage == null || errorMessage == "")

	const [inputValue, setInputValue] = useState("")

	const handleChange = (event) => {
		setInputValue(event.target.value)
	}

	const handleClick = () => {
		if (inputValue.trim() !== "") {
			onSubmit(inputValue.trim())
			setInputValue("")
		}
	}

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault()
			handleClick()
		}
	}

	return(
		<form onSubmit={handleClick}>
			<label className={styles.label}>
				{!hideLength && <p className={styles.limitText}>{text?.length || 0}/{maxLength || defaultLimit}</p> }
				<div className={styles.inputContainer}>
					<input
						className={isErr ? `${styles.input} ${styles.inputErr}` : `${styles.input}`}
						placeholder={placeholder}
						value={inputValue}
						type={type}
						id={id}
						onKeyUp={onKeyUp}
						required={required}
						ref={ref}
						maxLength={maxLength || defaultLimit}
						onChange={handleChange}
						onKeyDown={handleKeyPress}
					/>
					<Plus id="plus-icon" onClick={handleClick} className={styles.plusIcon} /> 
				</div>
				<p className={styles.err}>{errorMessage}</p>
			</label>
		</form>
		
	)
})
export default AddExaminee