import React from "react"
import "./TextArea.css"

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
 * }
 * 
 * @author Team Chimera
 * @version 3.0
 * @since 2023-04-24
 */
export default function TextArea({ placeholder, text, onChange, required, onBlur, onInput, readOnly, id,defVal,type}) {
	return(
		<textarea
			className="stand-area"
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
	) 
}