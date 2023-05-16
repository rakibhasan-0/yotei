import styles from "./InputTextField.module.css"

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
 * 	  errorMessage: string
 * }
 * 
 * Changes version 2:
 *     Added prop errorMessage and styling for the error state.
 * 	   Converted CSS to CSS Module.
 * 
 * @author Team Chimera & Medusa
 * @version 2.0
 * @since 2023-04-24
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