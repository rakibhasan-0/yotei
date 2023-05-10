import PlanItem from "./PlanItem.js"

/**
 * This is the list shown on planIndex containing the sessions of all the plans
 * @author Group 4 (Calzone) and Group 3 (Hawaii)
 */

const PlanList = ({ plans, sessions, onEdit, onDelete }) => {
	//Fetches all sessions for every plan

	let oldDate = new Date(0, 0, 0)
	/**
     * checks if the date of a session is new and should be printed out
     * @param {*} sessionDate the date of a session
     * @returns true or false
     */
	const checkNewDate = (sessionDate) => {
		let newDate = new Date(sessionDate)
		if (newDate - oldDate !== 0) {
			oldDate = newDate
			return true
		} else {
			return false
		}
	}

	let checkNewWeek = 0
	const getWeekDay = [" (Söndag)", " (Måndag)", " (Tisdag)", " (Onsdag)", " (Torsdag)", " (Fredag)", " (Lördag)"]
	/**
     * check if the week of a session is new and should be printed out
     * @param {*} sessionDate the date of a session 
     * @returns true or false
     */
	const getWeek = (sessionDate) => {
		let currentdate = new Date(sessionDate)
		//const oneJan = new Date(currentdate.getFullYear(), 0, 1);
		//const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
		//const result = Math.floor((currentdate.getDay() + 1 + numberOfDays) / 7) ;
		const result = getCurrentWeek(currentdate, 1)

		if (checkNewWeek - result !== 0) {
			checkNewWeek = result
			return true
		} else {
			return false
		}
	}

	const planColor = (session) => {
		let color = "#ffffff"
		plans.forEach(plan => {
			if (plan.id === session.plan) {
				color = plan.color
			}
		})
		return color
	}

	/**
 * Returns the week number for this date.
 * https://stackoverflow.com/questions/9045868/javascript-date-getweek
 * @param  {Date} date
 * @param  {number} [dowOffset] — The day of week the week "starts" on for your locale - it can be from `0` to `6`. By default `dowOffset` is `0` (USA, Sunday). If `dowOffset` is 1 (Monday), the week returned is the ISO 8601 week number.
 * @return {number}
 */
	function getCurrentWeek(date, dowOffset = 0) {
		/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
		const newYear = new Date(date.getFullYear(), 0, 1)
		let day = newYear.getDay() - dowOffset //the day of week the year begins on
		day = (day >= 0 ? day : day + 7)
		const daynum = Math.floor((date.getTime() - newYear.getTime() -
            (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1
		//if the year starts before the middle of a week
		if (day < 4) {
			const weeknum = Math.floor((daynum + day - 1) / 7) + 1
			if (weeknum > 52) {
				const nYear = new Date(date.getFullYear() + 1, 0, 1)
				let nday = nYear.getDay() - dowOffset
				nday = nday >= 0 ? nday : nday + 7
				/*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
				return nday < 4 ? 1 : 53
			}
			return weeknum
		}
		else {
			return Math.floor((daynum + day - 1) / 7)
		}
	}


	return (
		<div>


			<div className="container planContainer">
				{sessions.length === 0 ? <h1>Inga tillfällen hittades för valda planeringar</h1> : null}
				{sessions.map(session => {
					let date = new Date(session.date)
					let dateMonth = date.getMonth() >= 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
					let dateDay = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate()
					let dateString = date.getFullYear() + "-" + dateMonth + "-" + dateDay
					let dateWeekday = getWeekDay[date.getDay()]

					return (
						<div key={session.date}>
							{getWeek(session.date) ? <div className="row weekRow"> <p id="weekText">Vecka {checkNewWeek}</p> </div> : null}
							{checkNewDate(dateString) ? <p id="dayText">{dateString}{dateWeekday}</p> : null}
							<PlanItem session={session} color = {planColor(session)} onEdit={onEdit} onDelete={onDelete}/>
						</div>
					)
				})}
			</div>
		</div>
	)
}


export default PlanList

