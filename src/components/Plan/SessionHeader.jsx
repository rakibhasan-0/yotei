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
		if (time !== undefined || time != undefined) {
			time = time.slice(0,-3)
			if (!timeRegex.test(time)){
				console.error("Invalid time format")
				return false
			}
		}

		return true
	}


	return (
		checkID() ?
			(
				<div id = {`${id}-session-header`} className = "sc23-session-header d-flex justify-content-evenly">
					<div id = {`${id}-date`} className = "sc23-session-header-day-date">
						{
						
							checkDate() ?
								<p className = "sc23-session-header-text">{date}</p>
								:
								<p className = "sc23-session-header-text">{"     "}</p>
						}
						{

							checkDay() ?
								<p className = "sc23-session-header-text sc23-day">{day}</p>
								:
								<p className = "sc23-session-header-text sc23-day">{"   "}</p>
						}
					</div>
					{
						checkTitle() ?
							<div id = {`${id}-session-header-title`} className = "sc23-session-header-title"><p className = "sc23-session-header-text">{title}</p></div>
							:
							<div id = {`${id}-session-header-title-error`} className = "sc23-session-header-title"><p className = "sc23-session-header-text">unnamed</p></div>
					}

					<div id = {`${id}-time`} className = "sc23-session-header-time">
						{
							checkTime() ?
								<p className = "sc23-session-header-text">{time}</p>
								:
								<p className = "sc23-session-header-text">{"   "}</p>
						}
					</div> 
					
				</div>
			)
			:
			<div id = "error-session-header" className = "sc23-session-header-session-header">Error loading component</div>
	)
}

export default SessionHeader