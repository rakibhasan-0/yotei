import { useState } from "react"
import styles from "./TextArea.module.css"

/**
 * This is the standard textarea page, used for all textareas.
 * 
 * The props object is used for holding the written text
 * from and display it on the textArea. 
 * 
 * Props = {
 * placeholder @type {String}: Text holder until something to be shown
 * text @type {String}: User input text
 * onChange @type {Function} Function to run on change
 * required @type {Boolean} Is a boolean that makes sure that user cant leave an empty text field.
 * type @type {Type} Change type of component
 * id @type {String} An id for the textfield
 * onKeyUp @type {Function} Gets the input value from the user
 * errorMessage @type {String} Shows an error message 
 * onBlur @type {Function} Function to run when clicking away from the text area
 * onInput @type {Function} Function to run when given input
 * readOnly @type {Boolean} Boolean that makes the text area read only
 * defVal @type {String} Default value
 * maxLength    @type {Number}   Max input length, defaults to 800 characters
 * 
 *  }
 * 
 *  * Example usage:
 * const [exampleText, setExampleText] = useState("")
 * 
 *	<TextArea
 *		name="example-text-area"
 *		id="example-text-area"
 *		type="text"
 *		placeholder="Write here"
 *		value={exampleText}
 *		onChange={(e) => setExampleText(e.target.value) }}
 *		required={true}
	/>
 * 
 * 
 * @author Team Chimera & Medusa & Team Tomato
 * @since 2023-04-24
 * @updated 2024-04-19 Tomato fixed bug
 * @version 4.1
 */
export default function TextArea({
	placeholder,
	text,
	onChange,
	required,
	onBlur,
	onInput,
	readOnly,
	id,
	defVal,
	type,
	errorMessage,
	errorDisabled,
	maxLength,
}) {
	const defaultLimit = 800
	const isErr = !(errorMessage == undefined || errorMessage == null || errorMessage == "")
	const [characterCount, setCharacterCount] = useState(text?.length ?? 0)

	const countCharacters = (inputText) => {
		return inputText.length
	}

	return (
		<label className={styles.label}>
			<p className={styles.limitText}>
				{characterCount}/{maxLength || defaultLimit}
			</p>
			<textarea
				className={isErr ? `${styles.textarea} ${styles.textareaErr}` : `${styles.textarea}`}
				placeholder={placeholder}
				value={text}
				defaultValue={defVal}
				onChange={(e) => {
					if (onChange) {
						onChange(e)
					}
					setCharacterCount(countCharacters(e.target.value))
				}}
				onBlur={onBlur}
				onInput={onInput}
				required={required}
				readOnly={readOnly}
				id={id}
				type={type}
				maxLength={maxLength || defaultLimit}
			/>
			{!errorDisabled && <p className={styles.err}>{errorMessage}</p>}
		</label>
	)
}
