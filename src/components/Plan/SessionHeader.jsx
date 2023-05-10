import "./SessionHeader.css"
import React from "react"


/**
 * 	The SessionHeader is a component which displays a Sessions information.
 * 	The properties of the component should match the given format. It is up
 * 	to the parent component to constrain the SessionHeader.
 * 
 * 	@param 		id 		@type { string }  		- ID of the component
 * 	@param 		title	@type { string }		- title of the session (centered text)
 * 	@param		day		@type { string }		- day of the session (shortened to three letters)
 * 	@param		date	@type { string }		- date of the session (DD/MM)
 * 	@param		time	@type { string }		- time of the session (HH:MM)
 * 
 * Example usage:
 * 
 * <SessionHeader id="my-id" title="my header" day="mån" date="23/5" time="13:37" />
 * 
 * 	@returns A SessionHeader
 * 
 * 
 * 	@author		Griffin DV21JJN
 */

function SessionHeader ({ id, title, day, date, time }) {

	function checkID () {
		if (id === null || id === undefined) {
			console.error("Invalid component ID")
			return false
		}

		return true
	}

	function checkTitle () {
		if (title === null || title === undefined) {
			console.error("Invalid title")
			return false
		}

		return true
	}

	return (
		checkID() ?
			<div id = {`${id}-session-header`} className = "sc23-session-header d-flex justify-content-evenly">


				<div id = {`${id}-date`} className = "sc23-session-header-day-date sc23-session-header-item"><h2>{date + "  " + day}</h2></div>

				{
					checkTitle() ?
						<div id = {`${id}-session-header-title`} className = "sc23-session-header-title sc23-session-header-item"><h2>{title}</h2></div>
						:
						<div id = {`${id}-session-header-title-error`} className = "sc23-session-header-title sc23-session-header-item"><h2>unnamed</h2></div>
				}

				<div id = {`${id}-time`} className = "sc23-session-header-time sc23-session-header-item"><h2>{time}</h2></div> 
					
			</div>
			:
			<div id = "error-session-header" className = "sc23-session-header-session-header">Error loading component</div>
	)
}

export default SessionHeader