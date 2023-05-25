/** @jest-environment jsdom */
import React, { Fragment } from "react"
import "./SessionList.css"
import SessionContainer from "./SessionContainer"
import Divider from "../Common/Divider/Divider"




/**
 * The SessionList component is used to display a set of Sessions given by parent.
 * The components renders a SessionContainer for each given Session and handles errors
 * when rendering by rendering placeholders.
 * 
 * @param 		@type { String } 	id			A unique ID for the component.
 * @param		@type { Array }		plans		The Plan which are to be displayed
 * @paraam		@type { Date }		startDate	The start of the intervall for the dates of the sessions 
 * @param		@type { Date }		endDate		The end of the intervaall for the dates of the sessions
 * 
 * @author	Griffin DV21JJN C20JJS
 * @returns A SessionList component 
 */


function SessionList ({ id, plans, sessions, workouts }) {
	let sortedSessions = sortSessions()
	let currentWeek = -1

	/* ----- Input Validation ----- */
	function checkID () {
		if (id === null || id === undefined) {
			console.error("Invalid ID for SessionList component.")
			return false
		}
		return true
	}

	function checkPlans () {
		if (plans === null || plans === undefined) {
			console.error("Invalid Plan for SessionList component.")
			return false
		}
		return true
	}

	function checkSessions () {
		if (sessions === null || sessions === undefined) {
			console.error("Invalid Session for SessionList component.")
			return false
		}
		return true
	}

	/* ----- SORTING ----- */
	function sortSessions () {
		if (checkSessions()) {
			let sorted = sessions.slice().sort((session1, session2) => { 
				let dateTime1 = includeTimeInDate(session1)
				let dateTime2 = includeTimeInDate(session2)
	
				if (new Date(dateTime1) - new Date(dateTime2) < 0)
					return -1
			})

			return sorted
		}
		return null
	}
	
	function includeTimeInDate (session) {
		let date = new Date(session.date)
		let splitTime = session.time.split(":")
		let hour = parseInt(splitTime[0])
		let minutes = parseInt(splitTime[1])
		date.setHours(hour, minutes)
		date = date.toString()
	
		return date
	}


	function checkNewWeek(session) {
		let week = getWeekFromDate(session.date)
		if (currentWeek == week)
			return false

		currentWeek = week
		return true
	}

	/*
	 *	Code from https://weeknumber.com/how-to/javascript
	 */
	function getWeekFromDate (givenDate) {
		var date = new Date(givenDate)
		date.setHours(0, 0, 0, 0)
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4)
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) 
	}


	function getSessionPlan(session) {
		return plans.find(plan => plan.id == session.plan)
	}


	function getSessionWorkout(session) {
		if (workouts == null || workouts == undefined)
			return null
		return workouts.find(workout => workout.id == session.workout)
	}

	return (
		checkID() && checkPlans() && checkSessions() ?
			<div id={id} className = "sc23-session-list">
				{
					sortedSessions.map((session, i) => {
						return (
							checkNewWeek(session) ?
								<Fragment key={i}>
									<Divider id={`${currentWeek}-divider`} title={"Vecka " + currentWeek} option="h2_center"/>
									<SessionContainer id={`${session.id}-session-container`} workout={getSessionWorkout(session)} session={session} plan={getSessionPlan(session)}/>
								</Fragment>	
								:
								<SessionContainer key={i} id={`${session.id}-session-container`} workout={getSessionWorkout(session)} session={session} plan={getSessionPlan(session)} />
						)
					})
				}
			</div>
			:
			<div id ="session-list-render-error" className = "sc23-session-list">Kunde inte ladda in tillfällen</div>
	)
}

export default SessionList