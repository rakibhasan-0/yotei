import "./SessionHeader.css"
import React from "react"


/**
 * 	The SessionHeader is a component which displays a Sessions information.
 * 	The properties of the component should match the given format. The component
 * 	has been implemented to validate the format of the given input and will not 
 * 	render invalid input. It is up to the parent component to constrain the SessionHeader.
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
 * 	@author		Griffin DV21JJN C19HLN
 */

function SessionHeader ({ id, title, day, date, time }) {
	let dayRegex = new RegExp("Mån|Tis|Ons|Tors|Fre|Lör|Sön")
	let dateRegex = new RegExp("(([0][1-9])|([1-2][0-9])|(3[01]))[/]([0][1-9]|[1][0-2])")
	let timeRegex = new RegExp("(([0][0-9]|[1][0-9]|[2][0-3])[:]([0][0-9]|[1-5][0-9]))")

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

	function checkDay () {
		if (!dayRegex.test(day)) {
			console.error("Invalid day-format")
			return false
		}

		return true
	}


	function checkDate () {
		if (!dateRegex.test(date)) {
			console.error("Invalid date format")
			return false
		}

		return true
	}


	function checkTime () {
		if (!timeRegex.test(time)){
			console.error("Invalid time format")
			return false
		}

		return true
	}


	return (
		checkID() ?
			(
				<div id = {`${id}-session-header`} className = "sc23-session-header d-flex justify-content-evenly">
					<div id = {`${id}-date`} className = "sc23-session-header-day-date sc23-session-header-item">
						{
						
							checkDate() ?
								<h2 className = "sc23-session-header-text">{date}</h2>
								:
								<h2 className = "sc23-session-header-text">{"     "}</h2>
						}
						{

							checkDay() ?
								<h2 className = "sc23-session-header-text testanuda">{day}</h2>
								:
								<h2 className = "sc23-session-header-text testanuda">{"   "}</h2>
						}
					</div>
					{
						checkTitle() ?
							<div id = {`${id}-session-header-title`} className = "sc23-session-header-title sc23-session-header-item"><h2 className = "sc23-session-header-text">{title}</h2></div>
							:
							<div id = {`${id}-session-header-title-error`} className = "sc23-session-header-title sc23-session-header-item"><h2 className = "sc23-session-header-text">unnamed</h2></div>
					}

					<div id = {`${id}-time`} className = "sc23-session-header-time sc23-session-header-item">
						{
							checkTime() ?
								<h2 className = "sc23-session-header-text">{time}</h2>
								:
								<h2 className = "sc23-session-header-text">{"   "}</h2>
						}
					</div> 
					
				</div>
			)
			:
			<div id = "error-session-header" className = "sc23-session-header-session-header">Error loading component</div>
	)
}

export default SessionHeader