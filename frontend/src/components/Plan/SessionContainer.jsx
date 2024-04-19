import styles from "./SessionContainer.module.css"
import React from "react"
import { useState} from "react"
import { ChevronDown } from "react-bootstrap-icons"
import BeltBox from "./BeltBox"
import SessionHeader from "./SessionHeader"
import SessionWorkout from "./SessionWorkout"

/**
 * SessionContainer is a collapsible component which displays information about a selected
 * session and the connected workout if it exists.
 * 
 * @param 		@type { id }				- Id for component
 * @paraam		@type { workout }			- The workout object connected to the session
 * @param		@type { session }			- The seesion object
 * @param		@type { plan }				- The plan object
 * 
 * @returns 
 * 
 * @author Griffin DV21JJN
 */
function SessionContainer ({ id, workout, session, plan}) {
	const [toggled, setToggled] = useState(false)
	var sessionID = setSessionID()
	var planCreatorID = setPlanCreatorID()
	var dateRegex = new RegExp("(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])")
	var dayDate

	function workoutConnected () {
		if (workout === undefined ||workout === null) {
			return false
		}
		return true
	}

	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("ID is invalid")
			return false
		}

		return true
	}

	function checkSession () {
		if (session === undefined || session === null) {
			console.error("Session is invalid")
			return false
		}

		dayDate = new Date(session.date).getDay()
		return true
	}

	function setSessionID(){
		if(checkSession())
			return session.id
		

		return null
	}

	function setPlanCreatorID(){
		if(checkPlan())
			return plan.userId
		
		return null
	}

	function checkPlan () {
		if (plan === undefined || plan === null) {
			console.error("Plan is invalid")
			return false
		}

		return true
	}

	function checkDate () {
		if (session !== undefined || session !== null) {
			let givenDate = session.date

			if (session.date !== undefined || session.date !== null) {
				if (dateRegex.test(session.date)) {
					let date = givenDate.split("-")
					let day = date[2]
					let month = date[1]
					return day + "/" + month
				}
			}
		}
		return "99/99"
	}

	function checkColor () {

		if (plan.belts.length !== 0 ) {
			let last = plan.belts.length - 1
			let sortedBelts = sortBelts()

			if (sortedBelts[last].id === 1 || sortedBelts[last].id === 3 || sortedBelts[last].id === 4 ||
				sortedBelts[last].id === 5 || sortedBelts[last].id === 6 ){
				return true
			}
			return false
		}
		return true
	}

	function sortBelts () {
		let sorted = plan.belts.slice().sort(( belt1, belt2 ) => {
			return belt1.id - belt2.id
		})
		return sorted
	}

	function getDay () {
		switch (dayDate) {
		case(1):
			return "Mån"
		case(2):
			return "Tis"
		case(3):
			return "Ons"
		case(4):
			return "Tors"
		case(5):
			return "Fre"
		case(6): 
			return "Lör"
		case(0):
			return "Sön"
		}
	}

	return (

		checkID(id) ?
			(
				<div id = {id} className={styles["sc23-session-container"]}>
					<div id = {`${id}-header`} className={styles["sc23-session-container-header"]}>
						<div id = "session-information">
							{
								checkSession() ?
									
									checkPlan() ?
										<SessionHeader id="session-container-header" date={checkDate()} day={getDay()} title={plan.name} time={session.time}/>
										:
										<SessionHeader id="session-container-header" date={checkDate()} day={getDay()} title="invalid" time={session.time}/>
									:
									checkPlan() ?
									
										<SessionHeader id="session-container-header" date="invalid" day="invalid" title={plan.name} time="invalid"/>
										:
										<div id><h2 id = "error-session-header">Kunde inte ladda in datum och tid</h2></div>
							}
						</div>
						<div className = {styles["sc23-outline"]}>
							<div className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
								{
									checkPlan() ?
										<BeltBox id ="sc23-session-container-beltbox" belts={plan.belts} style={{borderTopLeftRadius:"4px"}}/>
										:
										<BeltBox id ="sc23-session-container-beltbox" style={{borderTopLeftRadius:"4px"}}/>
								}
								{
									checkPlan() && checkColor() ?
										<ChevronDown id="sc23-dropdown" style={{color:"black"}} className={styles[["sc23-session-container-chevron-rotation-animation sc23-session-container-header-overlap", toggled ? "sc23-chevron-rotate" : ""].join(" ")]} size={20}/>
										:
										<ChevronDown id="sc23-dropdown" className={styles[["sc23-session-container-chevron-rotation-animation sc23-session-container-header-overlap", toggled ? "sc23-chevron-rotate" : ""].join(" ")]} size={20}/>
								}
							</div>
							<div id = {`${id}-content`} className={styles["sc23-session-container-content"]}>
								
								<div className={styles["sc23-session-container-child"]} style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
									{	
										workoutConnected() ?
											<div><SessionWorkout id ="testSessionWorkout"  workout={workout} sessionID={sessionID} creatorID={planCreatorID} groupID={plan.id}/></div>
											:
											<div><SessionWorkout id ="testSessionWorkout"  workout={null} sessionID={sessionID} creatorID={planCreatorID} groupID={plan.id}/></div>

											
									}
								</div> 
							</div>
						</div>
					</div>
				</div>
			)//sessionID={session.id} creatorID={plan.user_id}
			:
			(
				<div id = "session-container-error">Kunde inte ladda in tillfället</div>
			)
	)
}


export default SessionContainer