import "./EditButton.css"
import React from "react"

/**
 * Defines the print button.
 * 
 * Printing currently does NOT work on following browsers: FireFox, DuckDuckGo and Opera GX (lol what)
 * 
 * @author Team Capriciosa (Group 2)
 * @version 1.0
 * @deprecated use Button.js instead
 */
function PrintButton() {
	return (
		<div className="btn btn-edit container-fluid">
			<img onClick={savePDF} src="/print.svg" alt="print icon"/>
		</div>
	)
}

/**
 * Saves the current page to PDF. Same as doing CTRL-P.
 */
function savePDF() {
	/** window.print funkar på (telefon):
     *      chrome
     *      opera
     *      brave
     *      safari
     *      edge
     *      vivaldi
     * 
     *   funkar ej på (telefon också):
     *      firefox
     *      duckduckgo
     *      opera gx
     */
	window.print()
}

export default PrintButton