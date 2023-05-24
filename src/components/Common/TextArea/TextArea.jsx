import styles from "./TextArea.module.css"

/**
 * This is the standard textarea page, used for all textareas.
 * 
 * The props object is used for holding the written text
 * from and display it on the textArea. 
 * props = {
 *    placeholder: string
 *    text: string
 *    onChange: function
 *    required: function
 *    onBlur: function
 *    onInput: function
 *    readOnly: boolean
 *    id: string
 *    defVal: string
 *    type: string
 * 	  errorMessage: string
 * }
 * 
 * Changes version 4.0
 * 		Updated CSS to use CSS modules.
 * 		Added prop errorMessage to display errors.
 * 
 * @author Team Chimera & Medusa
 * @version 4.0
 * @since 2023-04-24
 */
export default function TextArea({ placeholder, text, onChange, required, onBlur, onInput, readOnly, id, defVal, type, errorMessage, errorDisabled}) {

	const isErr = !(errorMessage == undefined || errorMessage == null || errorMessage == "")
	return(
		<label className={styles.label}>
			<textarea
				className={isErr ? `${styles.textarea} ${styles.textareaErr}` : `${styles.textarea}`}
				placeholder={placeholder}
				value={text}
				defaultValue={defVal}
				onChange={onChange}
				onBlur={onBlur}
				onInput={onInput}
				required={required}
				readOnly={readOnly}
				id={id}
				type={type}
			/>
			{!errorDisabled && <p className={styles.err}>{errorMessage}</p>}
		</label>
	) 
}