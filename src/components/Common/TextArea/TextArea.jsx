import React from "react";
import './TextArea.css';

/**
 * This is the standard textarea page, used for using standard textareas.
 * 
 * @author Team Chimera
 * @version 1.0
 * @since 2023-04-21
 */

export function TextArea(props) {

    return(
        <div class="marginArea">
            <textarea placeholder={props.placeholder || "Write something..."} class="StandArea"></textarea> 
        </div>
    )
}
