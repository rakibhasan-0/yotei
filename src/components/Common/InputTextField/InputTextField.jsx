import styles from "./InputTextField.module.css"

/**
 * This is the standard InputTextField page, used for using standard InputTextField.
 * 
 * The props object is used for holding the written text
 * from and display it on the InputTextField. 
 * Props:
 * placeholder  @type {String}   Text holder until something to be shown
 * text         @type {String}   User input text
 * onChange     @type {Function} Function to run on change
 * required     @type {Boolean}  Is a boolean that makes sure that user cant leave an empty text field.
 * type         @type {Type}     Change type of component
 * id           @type {String}   An id for the textfield
 * onKeyUp      @type {Function} Gets the input value from the user
 * errorMessage @type {String}   Shows an error message
 * 
 * Example usage:
 * const [exampleText, setExampleText] = useState("")
 * 
 *	<InputTextField
 *		name="example-input-text-field"
 *		id="example-input-text-field"
 *		type="text"
 *		placeholder="Write here"
 *		value={exampleText}
 *		onChange={(e) => setExampleText(e.target.value) }}
 *		required={true}
	/>
 * 
 * @author Team Chimera & Medusa
 * @version 2.0
 * @since 2023-04-24
 * @updated (unknown) Added prop errorMessage and styling for the error state, converted CSS to CSS Module
 * @updated 2023-05-30 Chimera, updated documentation
 * 
 */
export default function InputTextField({ placeholder, text, onChange, required, type, id, onKeyUp, errorMessage}) {
	
	const isErr = !(errorMessage == undefined || errorMessage == null || errorMessage == "")

	return(
		<label className={styles.label}>
			<input
				className={isErr ? `${styles.input} ${styles.inputErr}` : `${styles.input}`}
				placeholder={placeholder}
				value={text}
				onChange={onChange}
				type={type}
				id={id}
				onKeyUp={onKeyUp}
				required={required}
			/>
			<p className={styles.err}>{errorMessage}</p>
		</label>
	)
}