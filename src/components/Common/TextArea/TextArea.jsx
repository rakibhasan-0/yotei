import React from "react";
import './TextArea.css';

/**
 * This is the standard textarea page, used for using standard textareas.
 * 
 * The props object is used for holding the written text
 * from and display it on the textArea. 
 * props = {
 *    placeholder: string
 *    text: string
 *    onChange: function
 * }
 * 
 * @author Team Chimera
 * @version 2.0
 * @since 2023-04-24
 */
export default function TextArea({ placeholder, text, onChange }) {
    return(
        <textarea
            className="stand-area"
            placeholder={placeholder}
            value={text}
            onChange={e => onChange(e.target.value)}
        />
    )
}